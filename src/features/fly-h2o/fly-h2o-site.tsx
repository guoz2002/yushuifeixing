"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { I18nProvider, type Locale } from "@/i18n";
import { routeTitles } from "./data/routes";
import { normalizedPath, routeKeyForPath } from "./utils/routes";
import { TopNav } from "./components/top-nav";
import { MenuOverlay } from "./components/menu-overlay";
import { ComingSoonProvider } from "./components/coming-soon-dialog";
import { Hero } from "./components/hero";
import { FlyFooter } from "./components/fly-footer";
import { PageBody } from "./page-body";

export function FlyH2OSite({ slug, initialLocale }: { slug?: string[]; initialLocale?: Locale }) {
  const pathname = usePathname();
  const rawPath = normalizedPath(pathname, slug);
  const path = routeKeyForPath(rawPath);
  const page = routeTitles[path] || routeTitles["/"];
  const [menuOpen, setMenuOpen] = useState(false);
  const hasEmbeddedHero = page.kind === "home" || page.kind === "model" || path === "/products";

  return (
    <I18nProvider initialLocale={initialLocale}>
      <ComingSoonProvider>
        <main className="flySite">
          <TopNav onMenu={() => setMenuOpen(true)} />
          <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
          {!hasEmbeddedHero ? <Hero page={page} /> : null}
          <PageBody page={page} path={path} rawPath={rawPath} />
          <FlyFooter />
        </main>
      </ComingSoonProvider>
    </I18nProvider>
  );
}
