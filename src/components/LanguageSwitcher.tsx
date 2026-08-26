"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  fr: "FR",
  ru: "RU",
  es: "ES",
  zh: "CN",
};

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label="Language switcher" className="flex gap-2 text-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}/${rest}`}
          className={locale === current ? "font-semibold underline" : "text-gray-500 hover:text-gray-900"}
        >
          {LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
