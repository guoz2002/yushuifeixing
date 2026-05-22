import Script from "next/script";
import { buildStructuredData, getSeoConfig, type SeoSearchParams } from "@/lib/seo";

type SeoContentProps = {
  path: string;
  searchParams?: SeoSearchParams;
};

export function SeoContent({ path, searchParams }: SeoContentProps) {
  const seo = getSeoConfig(path, searchParams);
  const structuredData = buildStructuredData(path, searchParams);

  return (
    <>
      <Script
        id={`structured-data-${path.replace(/[^a-z0-9]/gi, "-") || "home"}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="seo-static-content">
        <h1>{seo.h1}</h1>
        <p>{seo.summary}</p>
        <ul>
          {seo.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
