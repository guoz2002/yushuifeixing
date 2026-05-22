"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useI18n } from "@/i18n";

export function TopNav({ onMenu }: { onMenu: () => void }) {
  const { t } = useI18n();

  return (
    <header className="topNav">
      <button className="navMenuButton" onClick={onMenu} type="button" aria-label={t("Open menu")}>
        <Menu size={24} strokeWidth={1.6} />
        <span>{t("MENU")}</span>
      </button>
      <Link className="brandMark" href="/">
        ALAQUA
      </Link>
      <div className="navRight">
        <Link href="/store/hydrofoil">{t("STORE")}</Link>
        <Link href="/contact">{t("CONTACT")}</Link>
      </div>
    </header>
  );
}
