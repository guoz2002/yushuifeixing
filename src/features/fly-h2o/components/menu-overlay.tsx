/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { localeOptions, useI18n } from "@/i18n";
import { menuItems, menuPanels, type MenuPanelKey } from "../data/navigation";
import { useDragScroll } from "../hooks/use-drag-scroll";

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, t } = useI18n();
  const [activePanel, setActivePanel] = useState<MenuPanelKey>("products");
  const railRef = useRef<HTMLElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);
  const { dragging: railDragging, dragProps: railDragProps } = useDragScroll<HTMLElement>(railRef);
  const { dragging: productsDragging, dragProps: productsDragProps } = useDragScroll<HTMLDivElement>(productsRef);
  const activeCards = menuPanels[activePanel];

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`siteMenu ${open ? "isOpen" : ""}`} aria-hidden={!open}>
      <button className="menuBackdrop" onClick={onClose} type="button" aria-label={t("Close menu")} tabIndex={open ? 0 : -1} />
      <section className="menuPanel" role="dialog" aria-modal={open} aria-label={t("MENU")}>
        <button className="menuClose" onClick={onClose} type="button" aria-label={t("Close menu")}>
          <X size={32} strokeWidth={1.25} />
        </button>
        <aside className={`menuRail ${railDragging ? "isDragging" : ""}`} ref={railRef} {...railDragProps}>
          <nav className="menuNav" aria-label={t("MENU")}>
            {menuItems.map((item) =>
              "href" in item ? (
                <Link className={item.spaced ? "isSpaced" : ""} href={item.href} key={`${item.label}-${item.href}`} onClick={onClose}>
                  {t(item.label)}
                </Link>
              ) : (
                <button
                  aria-pressed={activePanel === item.panel}
                  className={`${activePanel === item.panel ? "active" : ""} ${item.spaced ? "isSpaced" : ""}`}
                  key={`${item.label}-${item.panel}`}
                  onClick={() => setActivePanel(item.panel)}
                  onFocus={() => setActivePanel(item.panel)}
                  onMouseEnter={() => setActivePanel(item.panel)}
                  type="button"
                >
                  {t(item.label)}
                  <ChevronRight size={15} strokeWidth={1.5} />
                </button>
              ),
            )}
          </nav>
          <div className="menuFooter">
            <div className="languageRow">
              {localeOptions.map((option) => (
                <button
                  aria-pressed={locale === option.value}
                  className={locale === option.value ? "active" : ""}
                  key={option.value}
                  onClick={() => setLocale(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Link className="menuAccount" href="/profile" onClick={onClose}>
              {t("My Account")}
            </Link>
          </div>
        </aside>
        <div className={`menuProducts ${productsDragging ? "isDragging" : ""}`} ref={productsRef} {...productsDragProps}>
          {activeCards.map((card) => (
            <a href={card.href} className="menuProductCard" key={`${activePanel}-${card.title}`} onClick={onClose}>
              <img src={card.image} alt={t(card.title)} />
              <span className="menuProductLabel">{t(card.label)}</span>
              <strong>{t(card.title)}</strong>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
