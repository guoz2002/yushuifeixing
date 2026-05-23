"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/i18n";

const ComingSoonContext = createContext<(() => void) | null>(null);

export function useComingSoonDialog() {
  const openDialog = useContext(ComingSoonContext);
  return openDialog ?? (() => {});
}

export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return (
    <ComingSoonContext.Provider value={openDialog}>
      {children}
      <ComingSoonDialog open={open} onClose={closeDialog} />
    </ComingSoonContext.Provider>
  );
}

function ComingSoonDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="comingSoonOverlay" role="presentation">
      <button className="comingSoonBackdrop" type="button" aria-label={t("Close dialog")} onClick={onClose} />
      <section className="comingSoonPanel" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title">
        <button ref={closeButtonRef} className="comingSoonClose" type="button" aria-label={t("Close dialog")} onClick={onClose}>
          <X size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <p>Y-5</p>
        <h2 id="coming-soon-title">{t("正在制作中")}</h2>
        <button className="comingSoonConfirm" type="button" onClick={onClose}>
          {t("知道了")}
        </button>
      </section>
    </div>
  );
}
