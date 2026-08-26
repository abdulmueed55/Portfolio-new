import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { isLocale, locales, rtlLocales, type Locale } from "@/lib/i18n";
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

  return (
    <html lang={typedLocale} dir={dir}>
      <body className="flex min-h-screen flex-col">
        <Header locale={typedLocale} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
