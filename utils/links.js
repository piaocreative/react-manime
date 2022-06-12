const pageLinks = {
  Home: {
    url: '/',
  },
  // Auth
  Auth: {
    url: '/auth',
  },
  Login: {
    url: '/auth',
  },
  SignUp: {
    url: '/auth',
  },
  SignOut: {
    url: '/auth?step=signOut',
  },
  ForgotPassword: {
    url: '/auth?step=forgot',
  },
  BuilderRoot: {
    url: '/[handle]',
  },
  // SHOP
  SetupDesign: {
    url: '/shop',
    label: 'Shop',
  },
  SetupManiDesign: {
    url: '/manicures',
    label: 'Manis',
  },
  SetupPediDesign: {
    url: '/pedicures',
    label: 'Pedis',
  },
  ShopEssentials: {
    url: '/essentials',
    label: 'Essentials',
  },
  NewProduct: {
    url: '/new-products',
    label: "What's New",
  },
  ShopLastChance: {
    url: '/last-chance',
    label: 'Last Chance',
  },
  ShopBundles: {
    url: '/bundles',
    label: 'Bundles',
  },
  ShopArchive: {
    url: '/archive',
    label: 'Archive',
  },
  ShopAllure: {
    url: '/allure',
    label: "Allure's Top Picks",
  },
  FlashSale: {
    url: '/flash-sale',
    label: 'Flash Sale',
    isSale: true,
  },
  SetupConfirmation: {
    url: '/setup/confirmation',
  },
  GroupGift: {
    url: '/gift/group/[[...step]]',
    label: 'Friends Gift',
  },
  GroupGiftWelcome: {
    url: '/gift/group/welcome',
    label: 'Friends Gift Box',
  },
  GroupGiftStart: {
    url: '/gift/group',
    label: 'Friends Gift',
  },
  GroupGiftShop: {
    url: '/gift/group/shop',
    label: 'Friends Gift Shop',
  },
  GroupGiftRedeem: {
    url: '/gift/group/redeem',
    label: 'Redeem Friends Gift',
  },
  GroupGiftRedeemShipping: {
    url: '/gift/group/redeem/shipping',
    label: 'Enter Shipping Information',
  },
  GroupGiftRedeemConfirmation: {
    url: '/gift/group/redeem/confirmation',
    label: 'Friends Gift Kit Redemption Confirmation',
  },
  TelfarRedeem: {
    url: '/telfar/redeem',
    label: 'Redeem Friends Gift',
  },
  TelfarRedeemShipping: {
    url: '/telfar/redeem/shipping',
    label: 'Enter Shipping Information',
  },
  TelfarRedeemConfirmation: {
    url: '/telfar/redeem/confirmation',
    label: 'Friends Gift Kit Redemption Confirmation',
  },
  SubscriptionsRedemption: {
    url: '/subscription/redeem/[[...step]]',
  },
  SubscriptionsRedemptionPick: {
    url: '/subscription/redeem/pick-products',
    label: 'Redeem Now',
  },
  SubscriptionLanding: {
    url: '/subscribe',
  },

  // DESIGNERS
  Designer: {
    'Alicia Torello': {
      url: '/designer/alicia-torello',
      label: 'Alicia Torello',
    },
    'Ami Vega': {
      url: '/designer/ami-vega',
      label: 'Ami Vega',
    },
    'Amy Le': {
      url: '/designer/amy-le',
      label: 'Amy Le',
    },
    BadGirlNails: {
      url: '/designer/badgirlnails',
      label: 'BadGirlNails',
    },
    'Bana Jarjour': {
      url: '/designer/bana-jarjour',
      label: 'Bana Jarjour',
    },
    'Canishiea J. Sams': {
      url: '/designer/canishiea-j-sams',
      label: 'Canishiea J. Sams',
      isNew: true,
    },
    'Cassandre Marie': {
      url: '/designer/cassandre-marie',
      label: 'Cassandre Marie',
      isNew: true,
    },
    Chelseaqueen: {
      url: '/designer/chelseaqueen',
      label: 'Chelseaqueen',
      isNew: true,
    },
    'Eda Levenson': {
      url: '/designer/lfn',
      label: 'Eda Levenson',
    },
    FrecklePusNails: {
      url: '/designer/frecklepusnails',
      label: 'FrecklePusNails',
    },
    Glosshouse: {
      url: '/designer/glosshouse',
      label: 'Glosshouse',
    },
    'Hang Nguyen': {
      url: '/designer/hang',
      label: 'Hang Nguyen',
      isNew: true,
    },
    'Isabel May': {
      url: '/designer/isabel-may',
      label: 'Isabel May',
    },
    'Jessica Washick': {
      url: '/designer/jessica-washick',
      label: 'Jessica Washick',
    },
    'Kia Stewart': {
      url: '/designer/kia-stewart',
      label: 'Kia Stewart',
    },
    'Madeline Poole': {
      url: '/designer/madeline-poole',
      label: 'Madeline Poole',
    },
    'Mei Kawajiri': {
      url: '/designer/mei-kawajiri',
      label: 'Mei Kawajiri',
    },
    'Michelle Won': {
      url: '/designer/michelle-won',
      label: 'Michelle Won',
    },
    'Mimi D': {
      url: '/designer/mimi-d',
      label: 'Mimi D',
    },
    'Moonchild.Nails': {
      url: '/designer/moonchild-nails',
      label: 'Moonchild.Nails',
      isNew: true,
    },
    'Natalie Pavloski': {
      url: '/designer/natalie-pavloski',
      label: 'Natalie Pavloski',
    },
    'Polished Yogi': {
      url: '/designer/polished-yogi',
      label: 'Polished Yogi',
    },
    'Pria Bhama': {
      url: '/designer/pria-bhama',
      label: 'Pria Bhama',
    },
    Spifster: {
      url: '/designer/spifster-sutton',
      label: 'Spifster',
    },
    Superflynails: {
      url: '/designer/superflynails',
      label: 'Superflynails',
      isNew: true,
    },
    Nailjob: {
      url: '/designer/nailjob',
      label: 'Nailjob',
    },
    'Queenie Nguyen': {
      url: '/designer/queenie-nguyen',
      label: 'Queenie Nguyen',
      isNew: true,
    },
    Heluviee: {
      url: '/designer/heluviee',
      label: 'Heluviee',
      isNew: true,
    },
  },

  // COLLECTIONS
  Collection: {
    "90's Throwback": {
      url: '/collection/90s-throwback',
      label: "90's Throwback",
      isNew: true,
    },
    'Summer Nostalgia': {
      url: '/collection/summer-nostalgia',
      label: 'Summer Nostalgia',
      isNew: true,
    },
    'Summer Picnic': {
      url: '/collection/summer-picnic',
      label: 'Summer Picnic',
    },
    'PRIDE Capsule': {
      url: '/collection/pride-capsule',
      label: 'PRIDE Capsule',
    },
    'ManiMe x Marrow': {
      url: '/collection/manime-x-marrow',
      label: 'ManiMe x Marrow',
    },
    'Spring Forward': {
      url: '/collection/spring-forward',
      label: 'Spring Forward',
    },
    'Signature Capsule': {
      url: '/collection/signature-capsule',
      label: 'Signature Capsule',
    },
    BHM: {
      url: '/collection/bhm',
      label: 'BHM',
    },
    'XO Capsule': {
      url: '/collection/xo-capsule',
      label: 'XO Capsule',
    },
    Remixed: {
      url: '/collection/remixed',
      label: 'Remixed',
    },
    'Glow Up': {
      url: '/collection/glow-up',
      label: 'Glow Up',
    },
    'X Fashion': {
      url: '/collection/x-fashion',
      label: 'X Fashion',
    },
    'Creepy Capsule': {
      url: '/collection/creepy-capsule',
      label: 'Creepy Capsule',
    },
    'Bare Your Nails': {
      url: '/collection/byn',
      label: 'Bare Your Nails',
    },
    'Dreamy Escapes': {
      url: '/collection/dreamy-escapes',
      label: 'Dreamy Escapes',
    },
    Care: {
      url: '/collection/care',
      label: 'CARE',
    },
    'In the Air': {
      url: '/collection/in-the-air',
      label: 'In the Air',
    },
    '100% MP': {
      url: '/collection/mp-100',
      label: '100% MP',
    },
    'Solid Colors': {
      url: '/collection/solid-colors',
      label: 'Solid Choice',
    },
    Signature: {
      url: '/collection/signature',
      label: 'Signature',
      isNew: true,
    },
  },

  // GIFTING
  Gift: {
    url: '/gift',
    label: 'Gift',
  },
  GiftCard: {
    url: '/gift/card',
  },
  GiftBundle: {
    url: '/gift/bundle/[...params]',
  },
  GiftDeluxeGiftKit: {
    url: '/gift/bundle/Deluxe_Gift_Kit',
  },

  // Waiting list
  PrideWaitingList: {
    url: '/pride-waitinglist',
  },

  // HOWTO
  HowToApply: {
    url: '/how-to-apply',
    label: 'How to apply',
  },
  HowItWorks: {
    url: '/how-it-works',
    label: 'How it works',
  },

  // LEARN
  AboutUs: {
    url: '/about-us',
    label: 'About Us',
  },
  Blog: {
    url: '/blog',
    label: 'Blog',
  },
  Faq: {
    url: '/faq',
    label: 'Faq',
  },
  DeprecatedProductDetail: {
    url: '/setup/product-detail',
  },
  ProductDetail: {
    url: '/product/',
  },
  SetupAdditionalDesign: {
    url: '/setup/additionalDesigns',
  },
  GuidedFitting: {
    url: '/my-fit/[[...step]]',
  },
  ManiGuided: {
    url: '/my-fit/manis',
  },
  PediGuided: {
    url: '/my-fit/pedis',
  },
  ManiFitting: {
    url: '/fitting/mani',
  },
  PediFitting: {
    url: '/fitting/pedi',
  },
  Refit: {
    url: '/refit',
  },

  // Profile
  Profile: {
    Orders: {
      url: '/profile/orders',
    },
    Account: {
      url: '/profile/overview',
    },
    ChangePassword: {
      url: '/profile/change-password',
    },
    Friends: {
      url: '/profile/friends',
    },
    Gift: {
      url: '/profile/gift',
    },
    ShippingPayment: {
      url: '/profile/shipping-payment',
    },
    ManageSubscription: {
      url: '/profile/subscription',
    },
  },
  // Checkout
  Checkout: {
    url: '/checkout',
    label: 'Checkout',
  },
  CheckoutPayment: {
    url: '/checkout?tab=1',
  },
  // footer
  Privacy: {
    url: '/privacy',
  },
  Terms: {
    url: '/terms',
  },
};

const imageLinks = {
  User: {
    url: 'https://d1b527uqd0dzcu.cloudfront.net/user1.svg',
  },
  Logo: {
    url: '/static/icons/manime-logo.svg',
  },
  Bag: {
    url: '/static/icons/bot-bag.svg',
  },
};

const profileLinks = [
  {
    label: 'Orders',
    link: pageLinks.Profile.Orders.url,
  },
  {
    label: 'Refer a Friend',
    link: pageLinks.Profile.Friends.url,
  },
  {
    label: 'Gift',
    link: pageLinks.Profile.Gift.url,
  },
  {
    label: 'Payment & Shipping',
    link: pageLinks.Profile.ShippingPayment.url,
  },
  {
    label: 'Manage Subscription',
    link: pageLinks.Profile.ManageSubscription.url,
  },
  {
    label: 'Change Password',
    link: pageLinks.Profile.ChangePassword.url,
  },
];

const bannedHeaderPages = [
  pageLinks.Checkout.url,
  pageLinks.ManiFitting.url,
  pageLinks.PediFitting.url,
  pageLinks.Refit.url,
  pageLinks.GroupGift.url,
  pageLinks.GuidedFitting.url,
  pageLinks.SubscriptionsRedemption.url,
];

const bannedFooterPages = [
  pageLinks.Checkout.url,
  pageLinks.ManiFitting.url,
  pageLinks.PediFitting.url,
  pageLinks.Refit.url,
  pageLinks.GroupGift.url,
  pageLinks.GroupGiftWelcome.url,
  pageLinks.GuidedFitting.url,
  pageLinks.SubscriptionsRedemption.url,
];

const externalLinks = {
  SubscriptionManage: {
    url: process.env.SUBSCRIPTION_MANAGE,
    label: 'Manage Subscription',
  },
};

module.exports = {
  pageLinks,
  externalLinks,
  imageLinks,
  profileLinks,
  bannedHeaderPages,
  bannedFooterPages,
};
