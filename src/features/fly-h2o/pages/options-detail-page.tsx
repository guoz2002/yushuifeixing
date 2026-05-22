/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Package, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { pathParam } from "../utils/routes";
import { ModelStage } from "../components/model-stage";
import type { PageConfig } from "../types";

export function OptionsDetailPage({ page, rawPath }: { page: PageConfig; rawPath: string }) {
  const { t } = useI18n();
  const options = [
    { name: "Flame Red", color: "#e02925", image: media.color1 },
    { name: "Olive Green", color: "#537320", image: media.color2 },
    { name: "Titanium Silver", color: "#9b9b99", image: media.color3 },
    { name: "Solar Yellow", color: "#ffb713", image: media.color4 },
    { name: "Deep Blue", color: "#162964", image: media.color5 },
  ];
  const preset = Number(pathParam(rawPath));
  const [active, setActive] = useState(Number.isFinite(preset) && preset > 0 ? Math.min(preset - 1, options.length - 1) : 0);
  const current = options[active];

  return (
    <section className="optionsStudio" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="optionsStudioPanel">
        <div className="optionsVisual">
          <img src={current.image} alt={current.name} />
        </div>
        <aside className="optionsControl">
          <SlidersHorizontal size={24} strokeWidth={1.5} />
          <span>{t("LOCAL CONFIGURATOR")}</span>
          <h3>Y-3 {t(current.name)}</h3>
          <p>{t("Color, exterior package and inquiry actions are rebuilt locally. Checkout and production pricing are not connected.")}</p>
          <div className="swatches labeled">
            {options.map((option, index) => (
              <button
                aria-label={t(option.name)}
                className={active === index ? "active" : ""}
                key={option.name}
                onClick={() => setActive(index)}
                style={{ background: option.color }}
                type="button"
              />
            ))}
          </div>
          <div className="optionRows">
            <span>
              <Package size={16} /> {t("Exterior color kit")}
            </span>
            <span>
              <CalendarDays size={16} /> {t("Test-drive inquiry only")}
            </span>
          </div>
          <Link href="/test-drive">{t("BOOK TEST DRIVE")}</Link>
        </aside>
      </div>
      <div className="modelBand embedded">
        <ModelStage />
      </div>
    </section>
  );
}
