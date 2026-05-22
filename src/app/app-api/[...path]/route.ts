export const dynamic = "force-dynamic";

const disabledApiResponse = () =>
  Response.json(
    {
      error: "local_api_disabled",
      message: "This local rebuild does not call the production API.",
    },
    {
      status: 404,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
      },
    },
  );

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

export const GET = disabledApiResponse;
export const HEAD = disabledApiResponse;
export const POST = disabledApiResponse;
export const PUT = disabledApiResponse;
export const PATCH = disabledApiResponse;
export const DELETE = disabledApiResponse;
