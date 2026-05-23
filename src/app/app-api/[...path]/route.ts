export const dynamic = "force-dynamic";

const APP_API_BASE = "https://api.fly-h2o.cn/app-api";

type AppApiContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const copyRequestHeaders = (request: Request) => {
  const headers = new Headers();
  const passthrough = [
    "accept",
    "authorization",
    "content-type",
    "if-modified-since",
    "if-none-match",
    "origin",
    "range",
    "referer",
    "user-agent",
  ];

  for (const key of passthrough) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  return headers;
};

const copyResponseHeaders = (headers: Headers) => {
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
  responseHeaders.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS");
  responseHeaders.set("access-control-allow-headers", "content-type, authorization");
  return responseHeaders;
};

async function proxyAppApi(request: Request, context: AppApiContext) {
  const { path = [] } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${APP_API_BASE}/${path.map(encodeURIComponent).join("/")}`);
  targetUrl.search = incomingUrl.search;

  const requestInit: RequestInit = {
    method: request.method,
    headers: copyRequestHeaders(request),
    cache: "no-store",
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    requestInit.body = request.body;
  }

  const upstreamResponse = await fetch(targetUrl, requestInit);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyResponseHeaders(upstreamResponse.headers),
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
    },
  });
}

export const GET = proxyAppApi;
export const HEAD = proxyAppApi;
export const POST = proxyAppApi;
export const PUT = proxyAppApi;
export const PATCH = proxyAppApi;
export const DELETE = proxyAppApi;
