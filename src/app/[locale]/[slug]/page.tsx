import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/queries";
import { isLocale, type Locale } from "@/lib/i18n";
import { WpContent } from "@/components/WpContent";

// Route segment config requires a literal value — keep in sync with
// REVALIDATE_SECONDS in src/lib/wordpress.ts.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const page = await getPageBySlug(slug, locale as Locale).catch(() => null);
  return {
    title: page?.title.rendered,
  };
}

// Renders any WordPress page by slug (About, Membership, Nairobi/Geneva/
// Vienna/Bangkok summit pages, etc.) using the exact HTML WordPress already
// generates for it, so content/layout stays what editors publish in WP.
export default async function GenericPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getPageBySlug(slug, locale as Locale).catch(() => null);
  if (!page) notFound();

  // af.net's pages are built as full custom HTML/CSS layouts, not plain
  // articles — no title heading or narrow container wrapper here, so we
  // don't fight the page's own full-width design (matches the homepage).
  return <WpContent className="wp-content" html={page.content.rendered} />;
}
