const OSS_BASE = "https://oss.fly-h2o.cn";

type OssContext = {
  params: Promise<{
    path?: string[];
  }>;
};

export const dynamic = "force-dynamic";

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

async function getLocalOssAsset(request: Request, context: OssContext) {
  const { path = [] } = await context.params;
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
