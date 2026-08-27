function requireBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!baseUrl) {
    // Fails loudly at build/runtime instead of silently returning empty data.
    throw new Error(
      "NEXT_PUBLIC_WORDPRESS_API_URL is not set. Point it at your WordPress site's " +
        "REST API base, e.g. https://af.net/wp-json"
    );
  }
  return baseUrl;
}

// af.net already has a working, CORS-enabled REST API (originally built for
// its React Native app — see kadence-child/rest-api-config.php), so the
// frontend talks to that directly instead of requiring WPGraphQL.
export async function wpFetch<T>(path: string, searchParams?: Record<string, string | number>) {
  const baseUrl = requireBaseUrl();
  const url = new URL(path.replace(/^\//, ""), `${baseUrl.replace(/\/$/, "")}/`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`WordPress REST API ${url.pathname} returned ${res.status}`);
  }
  return (await res.json()) as T;
}

// Revalidation window (seconds) for ISR. Pages get regenerated in the
// background at most this often, so content stays fresh without giving up
// the speed of static generation.
export const REVALIDATE_SECONDS = 300;
