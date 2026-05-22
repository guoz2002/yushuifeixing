import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/app-api/",
        "/fly-h2o-oss/",
        "/assets/",
        "/2d",
        "/preview/",
        "/options/",
        "/store/",
        "/auth/",
        "/account",
        "/login",
        "/profile",
        "/order",
        "/orders/",
        "/order-confirmation/",
        "/help-center/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
