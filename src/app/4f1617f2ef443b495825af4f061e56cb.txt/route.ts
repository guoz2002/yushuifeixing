const indexNowKey = "4f1617f2ef443b495825af4f061e56cb";

export function GET() {
  return new Response(`${indexNowKey}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
