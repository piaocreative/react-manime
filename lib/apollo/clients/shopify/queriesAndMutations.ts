
import { gql } from '@apollo/client';
const CheckoutFragment = gql`
fragment PercentageDiscount on PricingPercentageValue {
  percentage
}

fragment DollarDiscount on MoneyV2 {
  amount
  currencyCode
}
  fragment CheckoutFragment on Checkout {
    id
    appliedGiftCards {
      amountUsedV2 {
        amount
        currencyCode
      }
      balanceV2 {
        amount
        currencyCode
      }
      id
      lastCharacters
      presentmentAmountUsed {
        amount
        currencyCode
      }
    }
    customAttributes {
      key
      value
    }
    totalTax
    subtotalPrice
    totalPrice
    lineItemsSubtotalPrice {
      amount
    }
    shippingAddress {
      firstName
      lastName
      address1
      address2
      city
      country
      province
      zip
    }
    availableShippingRates {
      shippingRates {
        handle
        priceV2 {
          amount
        }
        title
      }
    }
    shippingLine {
      handle
      priceV2 {
        amount
      }
      title
    }
    discountApplications (first: 250) {
      edges {
        node {
          allocationMethod
          targetSelection
          targetType
          value {
            ...PercentageDiscount
            ...DollarDiscount
          }
        }
      }
    }
    lineItems (first: 250) {
      edges {
        node {
          id
          title
          customAttributes {
            key
            value
          }
          discountAllocations {

            allocatedAmount {     
              amount
              currencyCode
            }
          }


          variant {
            id
            title
            image {
              id
              src
            }
            price
            product {
              id
              productType
            }
          }
          quantity
        }
      }
    }
  }
`;

export const query = gql`
  query query {
    shop {
      name
      description
      products(first:20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const checkoutQuery = gql`
  query Checkout($checkoutId: ID!) {
    node(id: $checkoutId) {
      id
      ... on Checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const createCheckout = gql`
  mutation checkoutCreate ($input: CheckoutCreateInput!){
    checkoutCreate(input: $input) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutLineItemsAdd = gql`
  mutation checkoutLineItemsAdd ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutLineItemsUpdate = gql`
  mutation checkoutLineItemsUpdate ($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
    checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutLineItemsReplace = gql`
  mutation checkoutLineItemsReplace($lineItems: [CheckoutLineItemInput!]!, $checkoutId: ID!) {
    checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) {
      userErrors {
        code
        field
        message
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutLineItemsRemove = gql`
  mutation checkoutLineItemsRemove ($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
      userErrors {
        message
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutCustomerAssociate = gql`
  mutation checkoutCustomerAssociate($checkoutId: ID!, $customerAccessToken: String!) {
    checkoutCustomerAssociate(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
      userErrors {
        field
        message
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const customerAccessTokenCreate = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      userErrors {
        message
        field
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

export const checkoutDiscountCodeApplyV2 = gql`
  mutation checkoutDiscountCodeApplyV2($discountCode: String!, $checkoutId: ID!) {
    checkoutDiscountCodeApplyV2(discountCode: $discountCode, checkoutId: $checkoutId) {
      checkoutUserErrors {
        code
        field
        message
      }
      userErrors {
        field
        message
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutDiscountCodeRemove = gql`
  mutation checkoutDiscountCodeRemove($checkoutId: ID!) {
    checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutShippingAddressUpdateV2 = gql`
  mutation checkoutShippingAddressUpdateV2($shippingAddress: MailingAddressInput!, $checkoutId: ID!) {
    checkoutShippingAddressUpdateV2(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutShippingLineUpdate = gql`
  mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
    checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
      checkoutUserErrors {
        code
        field
        message
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutAttributesUpdateV2 = gql`
  mutation checkoutAttributesUpdateV2($checkoutId: ID!, $input: CheckoutAttributesUpdateV2Input!) {
    checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutGiftCardsAppend = gql`
  mutation checkoutGiftCardsAppend($giftCardCodes: [String!]!, $checkoutId: ID!) {
    checkoutGiftCardsAppend(giftCardCodes: $giftCardCodes, checkoutId: $checkoutId) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${CheckoutFragment}
`;

export const checkoutGiftCardRemoveV2 = gql`
  mutation checkoutGiftCardRemoveV2($appliedGiftCardId: ID!, $checkoutId: ID!) {
    checkoutGiftCardRemoveV2(appliedGiftCardId: $appliedGiftCardId, checkoutId: $checkoutId) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${CheckoutFragment}
`;

export const MutationKeys = {
  checkoutQuery: 'checkoutQuery',
  checkoutLineItemsAdd: 'checkoutLineItemsAdd',
  checkoutLineItemsUpdate: 'checkoutLineItemsUpdate',
  checkoutLineItemsRemove: 'checkoutLineItemsRemove',
  checkoutCustomerAssociate: 'checkoutCustomerAssociate',
  customerAccessTokenCreate: 'customerAccessTokenCreate',
  checkoutDiscountCodeApplyV2: 'checkoutDiscountCodeApplyV2',
  checkoutShippingAddressUpdateV2: 'checkoutShippingAddressUpdateV2',
  checkoutShippingLineUpdate: 'checkoutShippingLineUpdate',
  checkoutLineItemsReplace: 'checkoutLineItemsReplace',
  checkoutAttributesUpdateV2: 'checkoutAttributesUpdateV2',
  checkoutGiftCardsAppend: 'checkoutGiftCardsAppend',
  checkoutGiftCardRemoveV2: 'checkoutGiftCardRemoveV2',
  checkoutDiscountCodeRemove: 'checkoutDiscountCodeRemove',
}

