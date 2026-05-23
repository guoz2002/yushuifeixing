/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { localeOptions, useI18n } from "@/i18n";
import { menuItems, menuPanels, type MenuPanelKey } from "../data/navigation";
import { useComingSoonDialog } from "./coming-soon-dialog";
import { useDragScroll } from "../hooks/use-drag-scroll";

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, t } = useI18n();
  const openComingSoon = useComingSoonDialog();
  const [activePanel, setActivePanel] = useState<MenuPanelKey>("products");
  const railRef = useRef<HTMLElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);
  const { dragging: railDragging, dragProps: railDragProps } = useDragScroll<HTMLElement>(railRef, {
    bypassClickBlockSelector: "[data-locale-switcher='true']",
  });
  const { dragging: productsDragging, dragProps: productsDragProps } = useDragScroll<HTMLDivElement>(productsRef);
  const activeCards = menuPanels[activePanel];

  function playCardVideo(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.play().catch(() => {});
  }

  function stopCardVideo(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

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
                  data-locale-switcher="true"
                  key={option.value}
                  onClick={() => setLocale(option.value)}
                  onPointerDown={(event) => event.stopPropagation()}
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
          {activeCards.map((card) => {
            const useTextImage = Boolean(card.useTextImage);
            const cardClassName = `menuProductCard${useTextImage ? " isTextImage" : ""}`;
            const cardContents = (
              <>
                {useTextImage ? (
                  <div className="menuProductTextImage" aria-hidden="true">
                    <span>{t(card.title)}</span>
                  </div>
                ) : (
                  <img src={card.image} alt={t(card.title)} />
                )}
                {card.video && !useTextImage ? (
                  <video className="menuProductVideo" loop muted playsInline preload="metadata" src={card.video} aria-hidden="true" />
                ) : null}
                <span className="menuProductLabel">{t(card.label)}</span>
                <strong>{t(card.title)}</strong>
              </>
            );

            if (card.comingSoon) {
              return (
                <button
                  type="button"
                  className={cardClassName}
                  key={`${activePanel}-${card.title}`}
                  onBlur={stopCardVideo}
                  onClick={() => {
                    onClose();
                    openComingSoon();
                  }}
                  onFocus={playCardVideo}
                  onMouseEnter={playCardVideo}
                  onMouseLeave={stopCardVideo}
                >
                  {cardContents}
                </button>
              );
            }

            return (
              <a
                href={card.href}
                className={cardClassName}
                key={`${activePanel}-${card.title}`}
                onBlur={stopCardVideo}
                onClick={onClose}
                onFocus={playCardVideo}
                onMouseEnter={playCardVideo}
                onMouseLeave={stopCardVideo}
              >
                {cardContents}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
