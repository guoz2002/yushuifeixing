import { dictionaries } from "./dictionaries";
import type { Locale } from "./types";

export function translate(locale: Locale, text: string) {
  return dictionaries[locale][text] || dictionaries.en[text] || text;
}
