import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

type OfficialAssetsContext = {
  params: Promise<{
    path?: string[];
  }>;
};

export const dynamic = "force-dynamic";

const OFFICIAL_ASSETS_BASE = "https://www.fly-h2o.cn/assets";

const localAssetsRoots = [
  path.join(process.cwd(), "public", "fly-h2o-assets"),
  path.join(process.cwd(), "资料", "fly-h2o-official-reference-20260523", "full-static-source", "assets"),
];

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=UTF-8",
  ".eot": "application/vnd.ms-fontobject",
  ".exr": "image/aces",
  ".gif": "image/gif",
  ".glb": "model/gltf-binary",
  ".hdr": "image/vnd.radiance",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=UTF-8",
  ".mp4": "video/mp4",
  ".obj": "model/obj",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const contentTypeForPath = (filePath: string) =>
  contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";

const copyRequestHeaders = (request: Request) => {
  const headers = new Headers();
  const passthrough = ["accept", "if-modified-since", "if-none-match", "range", "user-agent"];

  for (const key of passthrough) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  return headers;
};

const copyUpstreamResponseHeaders = (headers: Headers) => {
  const responseHeaders = new Headers();
  const passthrough = [
    "accept-ranges",
    "cache-control",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "expires",
    "last-modified",
  ];

  for (const key of passthrough) {
    const value = headers.get(key);
    if (value) responseHeaders.set(key, value);
  }

  responseHeaders.set("access-control-allow-origin", "*");
  return responseHeaders;
};

async function readLocalFallback(request: Request, root: string, segments: string[]) {
  const requestedPath = path.join(root, ...segments);
  const resolvedPath = path.resolve(requestedPath);

  if (!resolvedPath.startsWith(root + path.sep)) return null;

  try {
    const fileStats = await stat(resolvedPath);
    if (!fileStats.isFile()) return null;

    const headers = new Headers({
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": contentTypeForPath(resolvedPath),
    });

    const range = request.headers.get("range");
    if (range) {
      const match = range.match(/^bytes=(\d*)-(\d*)$/);
      if (match) {
        const start = match[1] ? Number(match[1]) : 0;
        const end = match[2] ? Number(match[2]) : fileStats.size - 1;
        const safeEnd = Math.min(end, fileStats.size - 1);
        const chunkSize = safeEnd - start + 1;

        if (start >= 0 && safeEnd >= start && start < fileStats.size) {
          headers.set("content-length", String(chunkSize));
          headers.set("content-range", `bytes ${start}-${safeEnd}/${fileStats.size}`);

          return new Response(
            request.method === "HEAD"
              ? null
              : (Readable.toWeb(createReadStream(resolvedPath, { start, end: safeEnd })) as ReadableStream),
            { status: 206, headers },
          );
        }
      }
    }

    headers.set("content-length", String(fileStats.size));
    return new Response(
      request.method === "HEAD" ? null : (Readable.toWeb(createReadStream(resolvedPath)) as ReadableStream),
      { status: 200, headers },
    );
  } catch {
    return null;
  }
}

async function fetchOfficialAssetFallback(request: Request, segments: string[]) {
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${OFFICIAL_ASSETS_BASE}/${segments.map(encodeURIComponent).join("/")}`);
  targetUrl.search = incomingUrl.search;

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: copyRequestHeaders(request),
    cache: "no-store",
  });

  const upstreamContentType = upstreamResponse.headers.get("content-type") || "";
  const requestedExt = path.extname(segments.at(-1) || "").toLowerCase();
  if (upstreamResponse.ok && requestedExt && requestedExt !== ".html" && upstreamContentType.includes("text/html")) {
    return new Response("Asset not found", { status: 404 });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyUpstreamResponseHeaders(upstreamResponse.headers),
  });
}

async function getOfficialAsset(request: Request, context: OfficialAssetsContext) {
  const { path: segments = [] } = await context.params;
  for (const root of localAssetsRoots) {
    const localResponse = await readLocalFallback(request, root, segments);
    if (localResponse) return localResponse;
  }

  return fetchOfficialAssetFallback(request, segments);
}

export const GET = getOfficialAsset;
export const HEAD = getOfficialAsset;
