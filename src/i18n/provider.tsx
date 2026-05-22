"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { defaultLocale, htmlLangForLocale, isLocale, localeStorageKey } from "./config";
import { detectBrowserLocale } from "./locale-detection";
import { translate } from "./translate";
import type { I18nContextValue, Locale } from "./types";

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
  t: (text) => text,
});

export function I18nProvider({ children, initialLocale }: PropsWithChildren<{ initialLocale?: Locale }>) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return initialLocale || defaultLocale;

    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (isLocale(storedLocale)) return storedLocale;
    return initialLocale || detectBrowserLocale(defaultLocale);
  });

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(localeStorageKey, nextLocale);
    document.documentElement.lang = htmlLangForLocale(nextLocale);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
    document.documentElement.lang = htmlLangForLocale(locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (text) => translate(locale, text),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
