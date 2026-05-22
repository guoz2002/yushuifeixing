/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { modelSpecs } from "../data/overview";
import { ModelStage } from "../components/model-stage";
import type { PageConfig } from "../types";

export function ProductPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <>
      <section className="pageIntro" id="main-content">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="specGrid">
          {modelSpecs.map(([label, value]) => (
            <div key={label}>
              <span>{t(label)}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="configurator">
        <div className="configVisual">
          <img src={media.color1} alt="Y-3 color option" />
        </div>
        <div className="configCopy">
          <p>{t("CUSTOM")}</p>
          <h2>Y-3</h2>
          <div className="swatches">
            {["#e02925", "#537320", "#9b9b99", "#ffb713", "#162964"].map((color) => (
              <span style={{ background: color }} key={color} />
            ))}
          </div>
          <Link href="/contact">{t("BOOK TEST RIDE")}</Link>
        </div>
      </section>
      <section className="modelBand">
        <ModelStage />
      </section>
    </>
  );
}
