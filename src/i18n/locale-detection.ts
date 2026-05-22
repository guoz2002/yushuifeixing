import { defaultLocale, isLocale, localeStorageKey } from "./config";
import type { Locale } from "./types";

const countryLocales: Record<string, Locale> = {
  CN: "zh",
  HK: "zh",
  MO: "zh",
  TW: "zh",
  SG: "zh",
  IT: "it",
  SM: "it",
  VA: "it",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  NZ: "en",
};

function localeFromCountry(country: string | null | undefined): Locale | undefined {
  if (!country) return undefined;
  return countryLocales[country.trim().toUpperCase()];
}

function localeFromLanguage(language: string | null | undefined): Locale | undefined {
  if (!language) return undefined;
  const normalized = language.trim().toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("it")) return "it";
  if (normalized.startsWith("en")) return "en";
  return undefined;
}

function localeFromTimeZone(timeZone: string | null | undefined): Locale | undefined {
  if (!timeZone) return undefined;
  if (["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Macau", "Asia/Taipei", "Asia/Singapore"].includes(timeZone)) return "zh";
  if (["Europe/Rome", "Europe/San_Marino", "Europe/Vatican"].includes(timeZone)) return "it";
  return undefined;
}

function firstLocaleFromAcceptLanguage(acceptLanguage: string | null | undefined): Locale | undefined {
  return acceptLanguage
    ?.split(",")
    .map((part) => localeFromLanguage(part.split(";")[0]))
    .find(Boolean);
}

export function resolveInitialLocale(input: {
  storedLocale?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
  browserLanguages?: readonly string[];
  timeZone?: string | null;
  fallbackLocale?: Locale;
}) {
  if (isLocale(input.storedLocale)) return input.storedLocale;

  return (
    localeFromCountry(input.country) ||
    firstLocaleFromAcceptLanguage(input.acceptLanguage) ||
    input.browserLanguages?.map(localeFromLanguage).find(Boolean) ||
    localeFromTimeZone(input.timeZone) ||
    input.fallbackLocale ||
    defaultLocale
  );
}

export function detectBrowserLocale(fallbackLocale = defaultLocale) {
  if (typeof window === "undefined") return fallbackLocale;

  return resolveInitialLocale({
    storedLocale: window.localStorage.getItem(localeStorageKey),
    browserLanguages: navigator.languages?.length ? navigator.languages : [navigator.language],
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    fallbackLocale,
  });
}

export function localeFromRequestHeaders(headerList: Pick<Headers, "get">) {
  return resolveInitialLocale({
    country:
      headerList.get("x-vercel-ip-country") ||
      headerList.get("cf-ipcountry") ||
      headerList.get("cloudfront-viewer-country") ||
      headerList.get("x-country-code"),
    acceptLanguage: headerList.get("accept-language"),
  });
}
