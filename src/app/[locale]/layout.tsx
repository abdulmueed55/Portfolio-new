import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { isLocale, locales, rtlLocales, type Locale } from "@/lib/i18n";
import { lexend, montserrat, playfair, localeFontClassName, localeFontVariable } from "@/lib/fonts";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "AIFOD — AI for Developing Countries Forum",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dir = rtlLocales.includes(typedLocale) ? "rtl" : "ltr";

  const fontVariables = [
    lexend.variable,
    montserrat.variable,
    playfair.variable,
    localeFontVariable(typedLocale),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={typedLocale} dir={dir} className={fontVariables}>
      <body className={`flex min-h-screen flex-col ${localeFontClassName(typedLocale)}`}>
        <Header locale={typedLocale} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
