const googleSiteVerification = "google-site-verification: googlec2d9acab0abf7a86.html";

export function GET() {
  return new Response(`${googleSiteVerification}\n`, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
