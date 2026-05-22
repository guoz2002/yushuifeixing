import { enTranslations } from "./en";
import { itTranslations } from "./it";
import { zhTranslations } from "./zh";
import type { Dictionary, Locale } from "../types";

export const dictionaries: Record<Locale, Dictionary> = {
  en: enTranslations,
  it: itTranslations,
  zh: zhTranslations,
};
