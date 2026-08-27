import {
  Lexend,
  Montserrat,
  Playfair_Display,
  Noto_Sans_Arabic,
  Noto_Sans_SC,
  PT_Sans,
  Nunito_Sans,
} from "next/font/google";
import type { Locale } from "@/lib/i18n";

// Fonts sourced from af.net's live site (see design-reference/README.md).
// next/font self-hosts these at build time, so there's no external Google
// Fonts request at runtime — keeps the speed win from going headless.
export const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-locale",
  display: "swap",
});
export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-locale",
  display: "swap",
});
export const ptSans = PT_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-locale",
  display: "swap",
});
export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-locale",
  display: "swap",
});

// Locale-specific body font override, matching af.net's per-language CSS
// (Arabic/Chinese/Russian need a font that actually covers their script;
// everyone else falls back to the default Lexend body font).
const localeFontMap: Partial<Record<Locale, { className: string; variable: string }>> = {
  ar: notoSansArabic,
  zh: notoSansSC,
  ru: ptSans,
  es: nunitoSans,
  fr: nunitoSans,
};

export function localeFontClassName(locale: Locale) {
  return localeFontMap[locale]?.className ?? "";
}

export function localeFontVariable(locale: Locale) {
  return localeFontMap[locale]?.variable ?? "";
}
