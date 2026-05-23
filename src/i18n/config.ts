import type { Locale } from "./types";

export const defaultLocale: Locale = "en";

export const localeStorageKey = "fly-h2o-locale";
export const localeSourceStorageKey = "fly-h2o-locale-source";

export const localeOptions: { value: Locale; label: string; htmlLang: string }[] = [
  { value: "en", label: "EN", htmlLang: "en" },
  { value: "it", label: "IT", htmlLang: "it" },
  { value: "zh", label: "中文", htmlLang: "zh-CN" },
];

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && localeOptions.some((option) => option.value === value));
}

export function htmlLangForLocale(locale: Locale) {
  return localeOptions.find((option) => option.value === locale)?.htmlLang || "en";
}
