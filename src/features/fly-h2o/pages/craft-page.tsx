/* eslint-disable @next/next/no-img-element */
"use client";

import { BatteryCharging, ShieldCheck, Users, Waves } from "lucide-react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { craftImages } from "../data/overview";
import { detailPages } from "../data/detail-pages";
import type { PageConfig } from "../types";

export function CraftPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <section className="craftPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="craftGrid">
        {craftImages.map((image, index) => (
          <article key={image}>
            <img src={image} alt={`Craft ${index + 1}`} />
            <span>0{index + 1}</span>
            <h3>{t(["Factory", "Manufacturing", "Carbon Fiber", "Brand"][index])}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DetailPage({ page, detail }: { page: PageConfig; detail: (typeof detailPages)[string] }) {
  const { t } = useI18n();

  return (
    <section className="detailPage" id="main-content">
      <div className="detailIntro">
        <p>{t(detail.label)}</p>
        <h2>{t(detail.title)}</h2>
        <span>{t(detail.lead)}</span>
      </div>
      <div className="detailShowcase">
        <article className="detailHeroBlock">
          <img src={detail.media[0]} alt={detail.label} />
          <div>
            <p>{t(page.kicker)}</p>
            <h3>{t(page.title)}</h3>
          </div>
        </article>
        <div className="detailStats">
          {detail.stats.map(([label, value]) => (
            <div key={label}>
              <span>{t(label)}</span>
              <strong>{t(value)}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="detailGrid">
        {detail.bullets.map(([title, text], index) => (
          <article key={title}>
            <img src={detail.media[(index + 1) % detail.media.length]} alt="" />
            <span>{`0${index + 1}`}</span>
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TechPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();
  const items = [
    [Waves, "Hydrofoil Control", "Active foils reduce resistance and lift the craft above the waterline."],
    [BatteryCharging, "Electric Power", "Quiet propulsion, high voltage energy, clean operation."],
    [ShieldCheck, "Stability", "Sensor fusion and software keep the riding posture stable."],
  ] as const;

  return (
    <section className="techPage" id="main-content">
      <video src={media.detailVideo} autoPlay muted loop playsInline />
      <div className="techOverlay">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="techCards">
          {items.map(([Icon, title, text]) => (
            <article key={title}>
              <Icon size={24} strokeWidth={1.65} />
              <h3>{t(title)}</h3>
              <span>{t(text)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InvestorPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <section className="investorPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="investorCards">
        {[
          ["Songhe Capital", "Industrial investment partner"],
          ["XBOTPARK", "Hard-tech incubation network"],
          ["Professor Li Zexiang", "Technology and industry mentor"],
        ].map(([name, role]) => (
          <article key={name}>
            <Users size={24} strokeWidth={1.5} />
            <h3>{t(name)}</h3>
            <p>{t(role)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
