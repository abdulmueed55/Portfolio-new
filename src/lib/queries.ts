import { gql } from "graphql-request";
import { wpClient } from "@/lib/wordpress";
import { wpLanguageCodes, type Locale } from "@/lib/i18n";

const MENU_ITEM_FIELDS = gql`
  fragment MenuItemFields on MenuItem {
    id
    label
    url
    path
    parentId
  }
`;

const PAGE_FIELDS = gql`
  fragment PageFields on Page {
    id
    title
    slug
    content
    seo {
      title
      metaDesc
    }
  }
`;

const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    slug
    excerpt
    date
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
  }
`;

export async function getPrimaryMenu(locale: Locale) {
  const query = gql`
    ${MENU_ITEM_FIELDS}
    query PrimaryMenu($language: LanguageCodeEnum) {
      menuItems(where: { location: PRIMARY, language: $language }, first: 100) {
        nodes {
          ...MenuItemFields
        }
      }
    }
  `;

  const data = await wpClient.request<{ menuItems: { nodes: any[] } }>(query, {
    language: wpLanguageCodes[locale],
  });
  return data.menuItems.nodes;
}

export async function getPageBySlug(slug: string, locale: Locale) {
  const query = gql`
    ${PAGE_FIELDS}
    query PageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        ...PageFields
      }
    }
  `;

  const data = await wpClient.request<{ page: any | null }>(
    query,
    { slug },
    { "Accept-Language": wpLanguageCodes[locale] }
  );
  return data.page;
}

export async function getPosts(locale: Locale, first = 12) {
  const query = gql`
    ${POST_FIELDS}
    query Posts($first: Int!, $language: LanguageCodeEnum) {
      posts(first: $first, where: { language: $language, status: PUBLISH }) {
        nodes {
          ...PostFields
        }
      }
    }
  `;

  const data = await wpClient.request<{ posts: { nodes: any[] } }>(query, {
    first,
    language: wpLanguageCodes[locale],
  });
  return data.posts.nodes;
}

export async function getPostBySlug(slug: string, locale: Locale) {
  const query = gql`
    ${POST_FIELDS}
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ...PostFields
        content
      }
    }
  `;

  const data = await wpClient.request<{ post: any | null }>(
    query,
    { slug },
    { "Accept-Language": wpLanguageCodes[locale] }
  );
  return data.post;
}
