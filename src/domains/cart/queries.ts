export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    totalQuantity
    checkoutUrl
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;
