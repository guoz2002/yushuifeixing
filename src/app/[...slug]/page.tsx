import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlyH2OSite } from "@/features/fly-h2o";
import { SeoContent } from "@/components/seo-content";
import { detectRequestLocale } from "@/i18n/server";
import { buildMetadata, pathFromSlug, type SeoSearchParams } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<SeoSearchParams>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  return buildMetadata(pathFromSlug(slug), resolvedSearchParams);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const path = pathFromSlug(slug);
  if (path === "/contact") notFound();
  const initialLocale = await detectRequestLocale();

  return (
    <>
      <SeoContent path={path} searchParams={resolvedSearchParams} />
      <FlyH2OSite slug={slug} initialLocale={initialLocale} />
    </>
  );
}
