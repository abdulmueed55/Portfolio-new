export const locales = ["en", "ar", "fr", "ru", "es", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Maps a Next.js URL locale segment to the language code WPGraphQL expects
// from your multilingual plugin (WPML or Polylang). Adjust these codes to
// match whatever your plugin actually returns/accepts once it's installed.
export const wpLanguageCodes: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  fr: "FR",
  ru: "RU",
  es: "ES",
  zh: "ZH_CN",
};

export const rtlLocales: Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
