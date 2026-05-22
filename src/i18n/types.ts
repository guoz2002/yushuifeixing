export type Locale = "en" | "it" | "zh";

export type Dictionary = Record<string, string>;

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
};
