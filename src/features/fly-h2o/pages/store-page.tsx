/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { CreditCard, Package, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/i18n";
import { accessoryItems, storeFeatures } from "../data/store";
import { pathParam } from "../utils/routes";
import type { PageConfig } from "../types";

export function StorePage({ page, path }: { page: PageConfig; path: string }) {
  const { t } = useI18n();
  const feature = storeFeatures.find((item) => item.path === path);

  if (path === "/store/accessories") {
    return (
      <section className="storePage" id="main-content">
        <div className="pageIntro compact">
          <p>{t(page.label)}</p>
          <h2>{t(page.title)}</h2>
        </div>
        <div className="accessoryGrid">
          {accessoryItems.map((item) => (
            <Link className="accessoryCard" href={`/store/accessories/${item.id}`} key={item.id}>
              <img src={item.image} alt={item.title} />
              <span>{t(item.label)}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (feature && path !== "/store") {
    return (
      <section className="storePage" id="main-content">
        <div className="storeDetail">
          <div className="storeDetailMedia">
            <img src={feature.image} alt={feature.title} />
          </div>
          <div className="storeDetailCopy">
            <Package size={24} strokeWidth={1.5} />
            <span>{t(feature.label)}</span>
            <h2>{t(feature.title)}</h2>
            <p>{t(feature.lead)}</p>
            <div className="detailStats compactStats">
              {feature.specs.map(([label, value]) => (
                <div key={label}>
                  <span>{t(label)}</span>
                  <strong>{t(value)}</strong>
                </div>
              ))}
            </div>
            <div className="storeActions">
              <Link href="/contact">{t("INQUIRE")}</Link>
              <Link href="/test-drive">{t("TEST DRIVE")}</Link>
            </div>
            <div className="localNotice">{t("Checkout and business APIs are intentionally disabled in this local rebuild.")}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="storePage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="storeFeatureGrid">
        {storeFeatures.map((item) => (
          <Link className="storeFeatureCard" href={item.path} key={item.path}>
            <img src={item.image} alt={item.title} />
            <span>{t(item.label)}</span>
            <h3>{t(item.title)}</h3>
            <p>{t(item.lead)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AccessoryPage({ page, rawPath }: { page: PageConfig; rawPath: string }) {
  const { t } = useI18n();
  const id = pathParam(rawPath);
  const item = accessoryItems.find((accessory, index) => accessory.id === id || String(index + 1) === id) || accessoryItems[0];

  return (
    <section className="accessoryDetail" id="main-content">
      <div className="accessoryMedia">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="accessoryCopy">
        <p>{t(page.kicker)}</p>
        <h2>{t(item.title)}</h2>
        <span>{t(item.description)}</span>
        <div className="optionRows">
          <span>
            <Package size={16} /> {t(item.label)}
          </span>
          <span>
            <CreditCard size={16} /> {t("Production payment disabled")}
          </span>
          <span>
            <SlidersHorizontal size={16} /> {t("Local inquiry flow")}
          </span>
        </div>
        <div className="storeActions">
          <Link href="/contact">{t("INQUIRE")}</Link>
          <Link href="/store/accessories">{t("BACK TO ACCESSORIES")}</Link>
        </div>
        <div className="localNotice">{t("This is a local product detail page; it does not create a real cart or order.")}</div>
      </div>
    </section>
  );
}
