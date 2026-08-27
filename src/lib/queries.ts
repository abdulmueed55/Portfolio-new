import { wpFetch } from "@/lib/wordpress";
import { wpLanguageCodes, type Locale } from "@/lib/i18n";

// Core WP REST API doesn't expose the nav menu by default (that needs a
// separate plugin). Hardcoded here to match af.net's current primary nav —
// keep this in sync manually until a menu REST endpoint is added.
const PRIMARY_MENU: { id: string; label: string; path: string }[] = [
  { id: "nairobi", label: "Nairobi", path: "/nairobi" },
  { id: "geneva", label: "Geneva", path: "/geneva" },
  { id: "vienna", label: "Vienna", path: "/vienna" },
  { id: "bangkok", label: "Bangkok", path: "/bangkok" },
  { id: "news", label: "News", path: "/news" },
  { id: "about", label: "About", path: "/about-the-forum" },
  { id: "membership", label: "Membership", path: "/membership" },
];

export async function getPrimaryMenu(_locale: Locale) {
  return PRIMARY_MENU;
}

interface WpRendered {
  rendered: string;
}

interface WpPage {
  id: number;
  slug: string;
  title: WpRendered;
  content: WpRendered;
}

interface WpPost {
  id: number;
  slug: string;
  title: WpRendered;
  content: WpRendered;
  plain_excerpt?: string;
  excerpt: WpRendered;
  date: string;
  featured_image_urls?: {
    thumbnail: string | null;
    medium: string | null;
    large: string | null;
    full: string | null;
  };
}

function langParam(locale: Locale) {
  // Matches the `?lang=xx` convention used by both WPML's and Polylang's
  // REST API language support. Confirm this is enabled on af.net — if a
  // different multilingual plugin is active, adjust this one spot.
  return wpLanguageCodes[locale].toLowerCase();
}

export async function getPageBySlug(slug: string, locale: Locale) {
  const cleanSlug = slug === "/" ? "home" : slug;
  const pages = await wpFetch<WpPage[]>("/wp/v2/pages", {
    slug: cleanSlug,
    lang: langParam(locale),
  });
  return pages[0] ?? null;
}

export async function getPosts(locale: Locale, perPage = 12) {
  return wpFetch<WpPost[]>("/wp/v2/posts", {
    per_page: perPage,
    lang: langParam(locale),
  });
}

export async function getPostBySlug(slug: string, locale: Locale) {
  const posts = await wpFetch<WpPost[]>("/wp/v2/posts", {
    slug,
    lang: langParam(locale),
  });
  return posts[0] ?? null;
}
