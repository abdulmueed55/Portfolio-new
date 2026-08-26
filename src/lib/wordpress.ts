import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!endpoint) {
  // Fails loudly at build/runtime instead of silently returning empty data.
  throw new Error(
    "NEXT_PUBLIC_WORDPRESS_API_URL is not set. Point it at your WordPress site's " +
      "WPGraphQL endpoint, e.g. https://af.net/graphql"
  );
}

export const wpClient = new GraphQLClient(endpoint);

// Revalidation window (seconds) for ISR. Pages get regenerated in the
// background at most this often, so content stays fresh without giving up
// the speed of static generation.
export const REVALIDATE_SECONDS = 300;
