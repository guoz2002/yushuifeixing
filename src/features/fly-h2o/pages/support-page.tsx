"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";
import type { PageConfig } from "../types";

export function SupportPage({ page }: { page: PageConfig }) {
  const { t } = useI18n();

  return (
    <section className="supportPage" id="main-content">
      <div>
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      {["Operation Guide", "Maintenance", "Battery Recycling", "Safety Terms", "Customer Service"].map((item) => (
        <Link href="/help-center" key={item}>
          {t(item)}
          <ChevronRight size={16} />
        </Link>
      ))}
    </section>
  );
}
