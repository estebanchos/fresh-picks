export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    totalQuantity
    checkoutUrl
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
