import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { isLocale, type Locale } from "@/lib/i18n";

// Route segment config requires a literal value — keep in sync with
// REVALIDATE_SECONDS in src/lib/wordpress.ts.
export const revalidate = 300;

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getPostBySlug(slug, locale as Locale).catch(() => null);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <p className="mb-6 text-sm text-gray-500">{new Date(post.date).toLocaleDateString(locale)}</p>
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
