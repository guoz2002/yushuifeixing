/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { galleryCards, rangeCards } from "../data/overview";
import { productCards } from "../data/navigation";

export function FullBleedStory() {
  const { t } = useI18n();

  return (
    <section className="storyStack" id="main-content">
      <article className="mediaPanel">
        <video src={media.showVideo} autoPlay muted loop playsInline />
        <div>
          <span>01</span>
          <h2>{t("Powered by science.")}</h2>
          <p>{t("Black stage, red light, centered product, restrained text: the page lets motion and water technology carry the brand tone.")}</p>
        </div>
      </article>
      <article className="mediaPanel split">
        <video src={media.cityVideo} autoPlay muted loop playsInline />
        <div>
          <span>02</span>
          <h2>{t("Elevated by water.")}</h2>
          <p>{t("Real water scenes, top-view movement and long cinematic sections create a quiet product-led scroll rhythm.")}</p>
        </div>
      </article>
    </section>
  );
}

export function RangeSection() {
  const { t } = useI18n();

  return (
    <section className="rangeSection">
      <div className="sectionHeader">
        <p>{t("RANGE OF USE")}</p>
        <h2>{t("Hydrofoil scenes built from real water.")}</h2>
        <span>{t("Resort routes, city waterfronts, leisure cruising and test rides share one quiet electric platform.")}</span>
      </div>
      <div className="rangeRail">
        {rangeCards.map((card, index) => (
          <Link className="rangeCard" href={card.href} key={card.title}>
            <img src={card.image} alt={card.title} />
            <div>
              <span>{`0${index + 1}`}</span>
              <h3>{t(card.title)}</h3>
              <p>{t(card.text)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProductMatrixSection() {
  const { t } = useI18n();

  return (
    <section className="productMatrix">
      <div className="sectionHeader compactCenter">
        <p>{t("MODEL SERIES")}</p>
        <h2>{t("Y series product family.")}</h2>
      </div>
      <div className="productMatrixGrid">
        {productCards.map((card) => (
          <Link href={card.href} className="productTile" key={card.title}>
            <img src={card.image} alt={card.title} />
            <span>{t(card.label)}</span>
            <h3>{card.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AppExperienceSection() {
  const { t } = useI18n();

  return (
    <section className="appExperience">
      <div className="sectionHeader">
        <p>{t("DIGITAL EXPERIENCE")}</p>
        <h2>{t("Owner app, cabin screen and product status surfaces.")}</h2>
      </div>
      <div className="galleryStrip">
        {galleryCards.map((card) => (
          <article key={card.title}>
            <img src={card.image} alt={card.title} />
            <h3>{t(card.title)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
