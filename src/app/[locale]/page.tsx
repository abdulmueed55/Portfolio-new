import { getPageBySlug } from "@/lib/queries";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

// Route segment config requires a literal value — keep in sync with
// REVALIDATE_SECONDS in src/lib/wordpress.ts.
export const revalidate = 300;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // WordPress's front page is fetched by its slug ("home" or "/") the same
  // way any other page is, so the homepage content stays fully editable
  // from WordPress.
  const page = await getPageBySlug("/", locale as Locale).catch(() => null);

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Homepage content not loaded yet</h1>
        <p className="mt-2 text-gray-500">
          Set NEXT_PUBLIC_WORDPRESS_API_URL to af.net&apos;s REST API base
          (e.g. https://af.net/wp-json) to see the real homepage here.
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{page.title.rendered}</h1>
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </article>
  );
}
