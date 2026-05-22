/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { dealerItems } from "../data/store";
import { pathParam } from "../utils/routes";
import type { PageConfig } from "../types";

export function TeamPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();
  const team = [
    ["Product Engineering", "Hydrofoil structure, propulsion and control architecture.", media.team1],
    ["Industrial Design", "Cabin, bodywork, materials and the premium water-mobility identity.", media.team2],
    ["Operations", "Test rides, delivery, dealer support and service workflows.", media.investor3],
  ];

  return (
    <section className="teamPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="teamGrid">
        {team.map(([title, text, image]) => (
          <article key={title}>
            <img src={image} alt={title} />
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestDrivePage({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <section className="testDrivePage" id="main-content">
      <div className="testDriveMedia">
        <video src={media.showVideo} autoPlay muted loop playsInline poster={media.range1} />
      </div>
      <div className="testDriveForm">
        <CalendarDays size={24} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(page.title)}</h2>
        <form>
          <input placeholder={t("Full Name")} />
          <input placeholder={t("Email or Phone")} />
          <input placeholder={t("City")} />
          <select defaultValue="Y-3">
            <option>Y-3</option>
            <option>Y-5</option>
          </select>
          <input type="date" />
          <textarea placeholder={t("Preferred water, route or message")} />
          <button type="button">{t("SUBMIT LOCAL REQUEST")}</button>
        </form>
        <div className="localNotice">{t("The booking form is present for the frontend replica only; no official appointment is created.")}</div>
      </div>
    </section>
  );
}

export function DealerPage({ page, path, rawPath }: { page: PageConfig; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isDetail = path.endsWith("/:id");
  const dealer = dealerItems.find((item, index) => item.id === pathParam(rawPath) || String(index + 1) === pathParam(rawPath)) || dealerItems[0];

  if (isDetail) {
    return (
      <section className="dealerPage" id="main-content">
        <div className="dealerDetail">
          <img src={dealer.image} alt={dealer.title} />
          <div>
            <MapPin size={24} strokeWidth={1.5} />
            <p>{t(dealer.region)}</p>
            <h2>{t(dealer.title)}</h2>
            <span>{t(dealer.address)}</span>
            <div className="storeActions">
              <Link href="/test-drive">{t("BOOK TEST DRIVE")}</Link>
              <Link href="/contact/dealers">{t("BACK TO NETWORK")}</Link>
            </div>
            <div className="localNotice">{t("Dealer data is local static content in this rebuild.")}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dealerPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="dealerGrid">
        {dealerItems.map((item) => (
          <Link className="dealerCard" href={`/contact/dealers/${item.id}`} key={item.id}>
            <img src={item.image} alt={item.title} />
            <span>{t(item.region)}</span>
            <h3>{t(item.title)}</h3>
            <p>{t(item.address)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
