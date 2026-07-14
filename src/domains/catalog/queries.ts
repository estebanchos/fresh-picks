/** GraphQL documents for the catalog domain. Shared fields live in
 * PRODUCT_CARD_FRAGMENT; every document takes variables — no inlined values. */

export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    title
    handle
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      products(first: $first, after: $after) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCard
      description
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;
