/* eslint-disable @next/next/no-img-element */
"use client";

import { Mail, MapPin, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n";
import { media } from "../data/media";
import { pathParam } from "../utils/routes";
import type { PageConfig } from "../types";

export function ContactPage({ page, path, rawPath }: { page: PageConfig; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isCharging = path === "/contact/charging";
  const isFinance = path === "/contact/finance";
  const isCustomerService = path.includes("customerService") || path === "/customerService";
  const image = isCharging ? media.chargingHero : isFinance ? media.financeHero : isCustomerService ? media.service2 : media.contact;
  const requestId = path.endsWith("/:id") ? pathParam(rawPath) : "";

  return (
    <section className="contactPage" id="main-content">
      <img src={image} alt={page.label} />
      <div className="contactCard">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="contactRows">
          <span>
            <MapPin size={16} /> {t("Shenzhen / Zhuhai")}
          </span>
          <span>
            <ShoppingBag size={16} />{" "}
            {isCharging
              ? t("Charging, energy and operating service")
              : isFinance
                ? t("Purchase, leasing and finance consultation")
                : t("Test drive, dealer and business cooperation")}
          </span>
          <span>
            <Mail size={16} /> {requestId ? `${t("Local request reference")}: ${requestId}` : t("Local form only, production API disabled")}
          </span>
        </div>
        <form>
          <input placeholder={t("Full Name")} />
          <input placeholder={t("Email or Phone")} />
          <textarea placeholder={isCustomerService ? t("Describe service request") : t("Message")} />
          <button type="button">{t("SEND MESSAGE")}</button>
        </form>
        <div className="localNotice">{t("This page keeps the visible workflow local and does not submit to the official backend.")}</div>
      </div>
    </section>
  );
}
