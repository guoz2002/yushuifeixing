import type { Metadata } from "next";
import { FlyH2OSite } from "@/features/fly-h2o";
import { SeoContent } from "@/components/seo-content";
import { detectRequestLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("/products");

export default async function ProductsRoute() {
  const initialLocale = await detectRequestLocale();

  return (
    <>
      <SeoContent path="/products" />
      <FlyH2OSite slug={["products"]} initialLocale={initialLocale} />
    </>
  );
}
