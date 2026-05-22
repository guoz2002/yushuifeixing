import type { Metadata } from "next";
import { htmlLangForLocale } from "@/i18n/config";
import { detectRequestLocale } from "@/i18n/server";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await detectRequestLocale();

  return (
    <html lang={htmlLangForLocale(initialLocale)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
