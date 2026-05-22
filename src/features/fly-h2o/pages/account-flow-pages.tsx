"use client";

import Link from "next/link";
import { CalendarDays, CreditCard, KeyRound, Lock, Mail, Package, ShieldCheck, Users } from "lucide-react";
import { useI18n } from "@/i18n";
import { pathParam } from "../utils/routes";
import type { PageConfig } from "../types";

export function HelpFlowPage({ page, path }: { page: PageConfig; path: string }) {
  const { t } = useI18n();
  const flowData = {
    "/help-center/reset-password": {
      icon: KeyRound,
      title: "Reset Password",
      text: "Verify contact information, set a new password and return to the local sign-in surface.",
    },
    "/help-center/account-appeal": {
      icon: Mail,
      title: "Account Appeal",
      text: "Collect appeal information and supporting details without submitting to the official service.",
    },
    "/help-center/freeze-account": {
      icon: Lock,
      title: "Freeze Account",
      text: "A local account safety form for freezing access in the replica interface.",
    },
    "/help-center/unfreeze-account": {
      icon: KeyRound,
      title: "Unfreeze Account",
      text: "A local recovery workflow for restoring account access.",
    },
    "/help-center/unblock-account": {
      icon: ShieldCheck,
      title: "Unblock Account",
      text: "A support request flow for account restriction review.",
    },
    "/help-center/delete-account": {
      icon: Lock,
      title: "Delete Account",
      text: "A deletion request page with confirmation-style UI, kept local only.",
    },
  };
  const flow = flowData[path as keyof typeof flowData] || flowData["/help-center/reset-password"];
  const Icon = flow.icon;

  return (
    <section className="helpFlowPage" id="main-content">
      <div className="flowPanel">
        <Icon size={30} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(flow.title)}</h2>
        <span>{t(flow.text)}</span>
        <form>
          <input placeholder={t("Email or Phone")} />
          <input placeholder={t("Verification Code")} />
          <textarea placeholder={t("Description")} />
          <button type="button">{t("SUBMIT LOCAL FORM")}</button>
        </form>
        <div className="localNotice">{t("All account help actions are frontend-only in this local version.")}</div>
      </div>
    </section>
  );
}

export function AuthPage({ page, path, rawPath }: { page: PageConfig; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isLogin = path === "/login";
  const provider = pathParam(rawPath) || "bind";

  if (!isLogin) {
    return (
      <section className="authPage" id="main-content">
        <div className="authCard">
          <KeyRound size={30} strokeWidth={1.5} />
          <p>{t(page.kicker)}</p>
          <h2>{t(page.title)}</h2>
          <span>
            {provider.toUpperCase()} {t("authorization is captured as a local callback page. No OAuth token is requested.")}
          </span>
          <div className="storeActions">
            <Link href="/login">{t("BACK TO SIGN IN")}</Link>
            <Link href="/profile">{t("LOCAL PROFILE")}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="authPage" id="main-content">
      <div className="authCard">
        <Lock size={30} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(page.title)}</h2>
        <form>
          <label>
            <Mail size={16} /> {t("Email or Phone")}
            <input placeholder="account@example.com" />
          </label>
          <label>
            <Lock size={16} /> {t("Password")}
            <input placeholder={t("Password")} type="password" />
          </label>
          <button type="button">{t("SIGN IN LOCALLY")}</button>
        </form>
        <div className="authProviders">
          {["wechat", "google", "line", "linkedin", "twitter", "alipay"].map((item) => (
            <Link href={`/auth/${item}`} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <div className="localNotice">{t("Login UI is reproduced locally; it does not call the official login API.")}</div>
      </div>
    </section>
  );
}

export function AccountPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();
  const items = [
    [Users, "Profile", "Local identity details and contact preferences."],
    [Package, "Orders", "Static order entry points for the replica."],
    [CreditCard, "Payment", "Payment methods are intentionally unavailable."],
    [Lock, "Security", "Password and account safety flows point to local help pages."],
  ] as const;

  return (
    <section className="accountPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="accountGrid">
        {items.map(([Icon, title, text]) => (
          <article key={title}>
            <Icon size={24} strokeWidth={1.5} />
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
      <div className="localNotice wide">{t("This profile center is a local frontend shell with no authenticated session.")}</div>
    </section>
  );
}

export function OrderPage({ page, path, rawPath }: { page: PageConfig; path: string; rawPath: string }) {
  const { t } = useI18n();
  const orderId = pathParam(rawPath) || "LOCAL-ORDER";
  const isConfirmation = path.startsWith("/order-confirmation");

  return (
    <section className="orderPage" id="main-content">
      <div className="orderSummary">
        <CreditCard size={28} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{isConfirmation ? t("Order Confirmation") : t("Order Detail")}</h2>
        <span>
          {t("Order ID")}: {orderId}
        </span>
        <div className="orderGrid">
          <article>
            <Package size={20} />
            <h3>{t("Y-3 Inquiry Package")}</h3>
            <p>{t("Static product line item for local page coverage.")}</p>
          </article>
          <article>
            <CalendarDays size={20} />
            <h3>{t("Appointment Pending")}</h3>
            <p>{t("No production booking or payment has been created.")}</p>
          </article>
        </div>
        <div className="storeActions">
          <Link href="/store">{t("STORE")}</Link>
          <Link href="/profile">{t("PROFILE")}</Link>
        </div>
        <div className="localNotice">{t("Orders are local placeholders and do not read from the official order API.")}</div>
      </div>
    </section>
  );
}
