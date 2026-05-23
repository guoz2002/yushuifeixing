import { dictionaries } from "./dictionaries";
import type { Locale } from "./types";

export function translate(locale: Locale, text: string) {
  const localized = dictionaries[locale][text];
  if (localized) return localized;

  // Respect the currently selected locale first.
  // For non-default locales, avoid cross-locale fallback to English.
  if (locale !== "en") return text;

  return dictionaries.en[text] || text;
}
