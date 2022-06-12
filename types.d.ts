export type Markup = string;
export type URL = string;

export type StepState = {
  order?: number;
  previous?: string;
  next?: string;
  meta?: any;
};

export type StepSequence = {
  start: string;
  steps: KeyValue<StepState>;
  meta: any;
};

export interface KeyValue<T> {
  [key: string]: T;
}

export type StepState = {
  order: number;
  previous?: string;
  next?: string;
  meta?: any;
};

export type StepSequence = {
  start: string;
  steps: KeyValue<StepState>;
  meta: any;
};

export type WaitListContent = {
  enabled?: boolean;
  emailTemplate: string;
  modalBody?: string;
  modalHeader?: string;
  modalImage?: string;
  confirmationBody?: string;
  confirmationHeader?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export type ExtraFields = {
  giftType?: string;
  priceLabel?: string;
  discountLabel?: string;
  originalPrice?: number;
  image?: string;
  text?: string;
  productImage?: string;
  waitList?: WaitListContent;
  waitListTemplate?: string;
  ctaDescription?: string;
  imageStyle?: any;
  banner?: any;
  preLaunchDateString?: string;
  bundleVideo?: any;
};
export type Product = {
  nailProductId: string;
  designerId?: string;
  name: string;
  description: Markup;
  totalLikes?: string;
  totalHates?: string;
  totalManime?: string;
  totalPurchases?: string;
  dateCreated: Date;
  visible: boolean;
  listingTitle?: string;
  shortDescription?: string;
  linkLabel?: string;
  extraFields?: ExtraFields;
  price: number;
  compareAtPrice?: string;
  picuri1?: URL;
  picuri2?: URL;
  picuri3?: URL;
  picuri4?: URL;
  picuri5?: URL;
  picuri6?: URL;
  index: string;
  overlayUri: URL;
  version: number;
  retail: number;
  tags: string[];
  variantId: string;
  productType: string;
  images: URL[];
  sku: string;
  weight: string;
  title?: string;
  quantity?: string;
  collectionTitle: null;
  shopifyHandle: string;
  sortOrder: Date;
  isArchived: boolean;
  archivedImageUrl?: URL;
  releaseName: string;
  releaseDate?: Date;
  releaseDateAsText?: string;
  isDevelopmentOnly: boolean;
  metaKeywords?: string[];
  sortOrderShopPage?: number;
  sortOrderWhatsNewPage?: string;
  subtitle?: string;
};

export type User = {
  name: {
    firstName: string;
    lastName: string;
  };
  pageName: string;
  identityId: string;
  description: string;
  email: string;
  phoneNumber: string;
  stripeId;
  isAuth: true;
  isCognitoAuth: true;
  subscriptionPlan: subscription;
  fitStatus;
  acceptsConditions;
  checkoutId;
  defaultShippingAddressId;
  referralId;
  shopifyId;
  credits;
  providerName;
  acceptsMarketing;
  totalOrders;
  acceptsSMS;
  defaultProfileId;
};

export type Address = {
  firstName?: string;
  lastName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};
export type CreditCard = {
  brand?: string;
  expMonth?: number;
  expYear?: number;
  last4?: number;
  address?: Address;
};
export type GraphqlFunction = Function;

export type GalleryHOCProps = {
  productType: string;
  nailProducts: Product[];
  tags: string[];
  checkProductTags: function;
  sortIndex: number;
  loading: boolean;
  isMobileView: boolean;
  displayProductsCount: number;
  setDisplayProductsCount: function;
};

export type ShopifyHOCProps = {
  addVariantToCart: Function;
  addVariantListToCart: Function;
  addVariantToCart_Guest: Function;
  appendGiftCard: Function;
  removeGiftCard: Function;
  updateLineItemInCart: Function;
  removeLineItemInCart: Function;
  associateCustomerCheckout: Function;
  applyDiscountCode: Function;
  updateShippingAddress: Function;
  updateShippingLine: Function;
  autoApplyUpdateShippingLine: Function;
  isDefaultShippingAddress: Function;
  updateCheckoutAttributes: Function;
  dispatchCheckout: Function;
  removeDiscountCode: Function;
  addVariant: Function;
  removeVariant: Function;
  isHiddenTitle: Function;
  checkoutQuery: GraphqlFunction;
  createCheckout: GraphqlFunction;
  checkoutLineItemsAdd: GraphqlFunction;
  checkoutLineItemsUpdate: GraphqlFunction;
  checkoutLineItemsRemove: GraphqlFunction;
  checkoutCustomerAssociate: GraphqlFunction;
  customerAccessTokenCreate: GraphqlFunction;
  checkoutDiscountCodeApplyV2: GraphqlFunction;
  checkoutShippingAddressUpdateV2: GraphqlFunction;
  checkoutShippingLineUpdate: GraphqlFunction;
  checkoutLineItemsReplace: GraphqlFunction;
  checkoutAttributesUpdateV2: GraphqlFunction;
  checkoutGiftCardsAppend: GraphqlFunction;
  checkoutGiftCardRemoveV2: GraphqlFunction;
  checkoutDiscountCodeRemove: GraphqlFunction;
  emptyCart: Function;
  client: any;
};

export type ShopifyLineItemInput = {
  quantity: number;
  variantId: string;
  customAttribute?: ShopifyAttributeInput[];
};
export type ShopifyAddressInput = {
  address1?: string;
  address2?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  province?: string;
  city?: string;
  phone?: string;
  zip?: string;
};
export type ShopifyAttributeInput = {
  key: string;
  value: string;
};
export type CreateCheckoutInput = {
  allowPartialAddresses?: boolean;
  customAttributes?: ShopifyAttributeInput[];
  email?: string;
  lineItems?: ShopifyLineItemInput[];
  note?: string;
  presentmentCurrencyCode?: string;
  shippingAddress: ShopifyAddressInput;
};

export type ShopifyShippingLineUpdate = {
  checkoutId: string;
  shippingRateHandle: string;
};

export type GroupGiftMember = {
  userId: string;
  groupGiftid?: string;
  orderId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};
export enum ComType {
  INIITAL,
  INVITATION,
  REMINDER,
}
export type GroupGiftComs = {
  groupGiftId?: string;
  from: string;
  comType: ComType;
  createdDate?: Date;
  updatedDate?: Date;
  message?: string;
  to?: string;
};

export type GroupGiftLineItems = {
  groupGiftId?: string;
  variantId: string;
};

export type GroupGift = {
  groupGiftId: string;
  buyerId: string;
  checkoutId?: string;
  groupOrderId?: string;
  orderId?: string;
  eventName: string;
  memberCount: number;
  eventDate: Date;
  createdDat?: Date;
  updatedDate?: Date;
  members: GroupGiftMember[];
  lineItems: GroupGiftLineItems[];
};
export type SubscriptionPlanItem = {
  productType: string;
  quantity: number;
};
export type SubscriptionPlan = {
  planCode: string;
  description: string;
  dateCreated: Date;
  dateUpdated: Date;
  items: [SubscriptionPlanItem];
};

export type SubscriptionEntitlement = {
  entitlementId: string;
  userId: string;
  planCode: string;
  groupOrderId?: string | undefined;
  redeemed: boolean;
  metaData: string;
  dateCreated: Date;
  dateUpdated: Date;
};
