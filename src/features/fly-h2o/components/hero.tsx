"use client";

import { useI18n } from "@/i18n";
import { media } from "../data/media";
import type { PageConfig } from "../types";

export function Hero({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <section className="heroSection">
      <video className="heroVideo" src={media.heroVideo} autoPlay muted loop playsInline poster={media.y3Menu} />
      <div className="heroShade" />
      <div className="heroCenter">
        <h1>Alaqua</h1>
        <p>{t(page.title)}</p>
        <a href="#main-content">{t(page.kicker)}</a>
      </div>
      <div className="scrollNeedle" />
    </section>
  );
}
