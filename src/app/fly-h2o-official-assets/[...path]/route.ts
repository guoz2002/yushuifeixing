import path from "node:path";

type OfficialAssetsContext = {
  params: Promise<{
    path?: string[];
  }>;
};

export const dynamic = "force-dynamic";

const OFFICIAL_ASSETS_BASE = "https://www.fly-h2o.cn/assets";

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
  return fetchOfficialAssetFallback(request, segments);
}

export const GET = getOfficialAsset;
export const HEAD = getOfficialAsset;
