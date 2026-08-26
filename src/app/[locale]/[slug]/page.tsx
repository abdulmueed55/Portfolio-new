import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/queries";
import { isLocale, type Locale } from "@/lib/i18n";

// Route segment config requires a literal value — keep in sync with
// REVALIDATE_SECONDS in src/lib/wordpress.ts.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const page = await getPageBySlug(slug, locale as Locale).catch(() => null);
  return {
    title: page?.seo?.title ?? page?.title,
    description: page?.seo?.metaDesc,
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

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{page.title}</h1>
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
