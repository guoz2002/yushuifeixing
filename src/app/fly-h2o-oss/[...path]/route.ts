import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const OSS_BASE = "https://oss.fly-h2o.cn";

type OssContext = {
  params: Promise<{
    path?: string[];
  }>;
};

export const dynamic = "force-dynamic";

const publicOssRoot = path.join(process.cwd(), "public", "fly-h2o-oss");

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".exr": "image/aces",
  ".glb": "model/gltf-binary",
  ".hdr": "image/vnd.radiance",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=UTF-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".webm": "video/webm",
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

const copyOssResponseHeaders = (headers: Headers) => {
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

async function readLocalAsset(request: Request, segments: string[]) {
  const requestedPath = path.join(publicOssRoot, ...segments);
  const resolvedPath = path.resolve(requestedPath);

  if (!resolvedPath.startsWith(publicOssRoot + path.sep)) return null;

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

async function getLocalOssAsset(request: Request, context: OssContext) {
  const { path = [] } = await context.params;
  const localResponse = await readLocalAsset(request, path);
  if (localResponse) return localResponse;

  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${OSS_BASE}/${path.map(encodeURIComponent).join("/")}`);
  targetUrl.search = incomingUrl.search;

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: copyRequestHeaders(request),
    cache: "no-store",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyOssResponseHeaders(upstreamResponse.headers),
  });
}

export const GET = getLocalOssAsset;
export const HEAD = getLocalOssAsset;
