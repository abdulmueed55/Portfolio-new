import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/queries";
import { isLocale, type Locale } from "@/lib/i18n";

// Route segment config requires a literal value — keep in sync with
// REVALIDATE_SECONDS in src/lib/wordpress.ts.
export const revalidate = 300;

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const posts = await getPosts(locale as Locale).catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">News</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Link key={post.id} href={`/${locale}/news/${post.slug}`} className="block">
            {post.featured_image_urls?.medium && (
              <Image
                src={post.featured_image_urls.medium}
                alt={post.title.rendered}
                width={400}
                height={240}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}
            <h2 className="text-lg font-semibold">{post.title.rendered}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {post.plain_excerpt || post.excerpt.rendered.replace(/<[^>]+>/g, "")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
