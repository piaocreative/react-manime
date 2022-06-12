// module.exports = {
//   googleClientId: '37993977907-igk7u7eiiq9571tvklocuhju1ud380dd.apps.googleusercontent.com',
//   facebookAppId: '295268481180605',
//   shopifyDomain: 'manime1.myshopify.com',
//   shopifyGraphQLDomain: 'https://manime1.myshopify.com/api/graphql',
//   storefrontAccessToken: '710fb3ab98e0ae0bd0fa5279262cd5a1',
//   sentryDsn: 'https://0b960a0e865149659b1353de5bbafa8f@sentry.io/1439602',
//   stripePublicKey: 'pk_live_z2bUCYDIKJEP7aMEFXmoudOh',
//   defaultNodeId: 'Z2lkOi8vc2hvcGlmeS9DaGVja291dExpbmVJdGVtLzMwMDE1OTMxOTQwOTczMD9jaGVja291dD0wYmQwOTk4ZDdiMDE3OGRjYzVkOGJhNTkyMmJiNTQzOQ==',
//   emailTemplateId: 'd-67a4bc39c97442eaacd56061a3e7883c',
//   giftupApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTlkM2YyMy1kMmEzLTRlY2UtOTRjMy0yYTM0MjU2MDc3YTIiLCJzdWIiOiJzY2FybGV0LmtzMTIxNEBnbWFpbC5jb20iLCJleHAiOjE4ODg2MDAwOTYsImlzcyI6Imh0dHBzOi8vZ2lmdHVwLmFwcC8iLCJhdWQiOiJodHRwczovL2dpZnR1cC5hcHAvIn0.QC-v40i2F-6YtQDe1L82wUGsPAQMuMDDZHWlM3IIOOo',
//   giftupTestMode: false,
//   workingDaysApiKey: '63A92AF7-62A0-1A95-73BB-4902E0D36298',
//   sendGridApiKey: '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',
//   klaviyoKey: 'pk_247442aa2540ff51f6153f6963e5d0e49c',
//   klaviyoTemplate: {
//     fitFeedback: 'M9uwXP',
//     referrer: 'LZEsnE',
//     referred: 'PUi3xY'
//   },
//   ipStackKey: '4f4f82071d6a49ec54ccbd1e575c6f7c'
// };

module.exports = {
  env: process.env.ENV,

  aws: {
    amplify: {
      identityPoolId: process.env.AWS_AMPLIFY_IDENDITY_POOL_ID,
      region: process.env.AWS_AMPLIFY_REGION,
      userPoolId: process.env.AWS_AMPLIFY_USER_POOL_ID,
      userPoolWebClientId: process.env.AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
      domain: process.env.AWS_AMPLIFY_DOMAIN,
    },
    storage: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
    },
    api: {
      LambdaPayment: {
        endpoint: process.env.AWS_LAMBDA_LAMBDAPAYMENT_ENDPOINT,
        region: process.env.AWS_LAMBDA_LAMBDAPAYMENT_REGION,
        apiKey: process.env.AWS_LAMBDA_LAMBDAPAYMENT_API_KEY,
      },
      ManimeApi: {
        endpoint: process.env.AWS_LAMBDA_LAMBDARDSDEV_ENDPOINT,
        region: process.env.AWS_LAMBDA_LAMBDARDSDEV_REGION,
        apiKey: process.env.AWS_LAMBDA_LAMBDARDSDEV_API_KEY,
      },
      ManimeApiTest: {
        endpoint: process.env.AWS_MANIME_API_TEST,
        region: process.env.AWS_LAMBDA_LAMBDARDSDEV_REGION,
        apiKey: process.env.AWS_LAMBDA_LAMBDARDSDEV_API_KEY,
      },
      ManimeApiCached: {
        endpoint: process.env.AWS_MANIME_API_CACHED,
        region: process.env.AWS_MANIME_API_CACHED_REGION,
      },
      IntegrationProxy: {
        endpoint: process.env.AWS_LAMBDA_LAMBDASERVER_ENDPOINT,
        region: process.env.AWS_LAMBDA_LAMBDASERVER_REGION,
      },
      DynamoDB1: {
        endpoint: process.env.AWS_LAMBDA_DYNAMODB1_ENDPOINT,
        region: process.env.AWS_LAMBDA_DYNAMODB1_REGION,
      },
      PresignedDB: {
        endpoint: process.env.AWS_LAMBDA_PRESIGNEDDB_ENDPOINT,
        region: process.env.AWS_LAMBDA_PRESIGNEDDB_REGION,
      },
      EmailCollectionDB: {
        endpoint: process.env.AWS_LAMBDA_EMAILCOLLECTIONDB_ENDPOINT,
        region: process.env.AWS_LAMBDA_EMAILCOLLECTIONDB_REGION,
      },
      RedeemableItemsDB: {
        endpoint: process.env.AWS_LAMBDA_REDEEMABLEITEMSDB_ENDPOINT,
        region: process.env.AWS_LAMBDA_REDEEMABLEITEMSDB_REGION,
      },
    },
  },

  endpoints: {
    referrals: process.env.ENDPOINT_REFERRALS,
    saveCheckout: process.env.ENDPOINT_SAVE_CHECKOUT,
    shortLink: process.env.ENDPOINT_SHORT_LINK,
  },

  session: {
    secret: process.env.SESSION_SECRET,
  },

  stripePublicKey: process.env.STRIPE_PUBLIC,
  stripeJsSrc: process.env.STRIPE_JS_SRC || 'https://js.stripe.com/v3/',

  klaviyoTemplate: {
    fitFeedback: process.env.KLAVIYO_TEMPLATE_FEEDBACK,
    referrer: process.env.KLAVIYO_TEMPLATE_REFERRER,
    referred: process.env.KLAVIYO_TEMPLATE_REFERRED,
    desktopTransfer: process.env.KLAVIYO_TEMPLATE_TRANSFER,
    landing: process.env.KLAVIYO_TEMPLATE_LANDING,
    apiKey: process.env.KLAVIYO_API_KEY,
    sendEmailUrl: process.env.KLAVIYO_LAMBDA_URL,
    xFashion: process.env.KLAVIYO_TEMPLATE_XFASHION,
  },

  giftCard: {
    apiKey: process.env.GIFT_CARD_API_KEY,
    siteId: process.env.GIFT_CARD_SITE_ID,
    testMode: /true/i.test(process.env.GIFT_CARD_TEST_MODE),
  },

  googleTagId: process.env.GA_TAG_ID,

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },

  smartyStreetsKey: process.env.SMARTY_STREETS_KEY,

  ipStackKey: process.env.IPSTACK_KEY,

  appUrl: process.env.APP_URL,

  shopify: {
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
    graphQLDomain: process.env.SHOPIFY_GRAPHQL_DOMAIN,
  },

  sentryDsn: process.env.SENTRY_DSN,

  workingDaysApiKey: process.env.WORKING_DAYS_API_KEY,
  soldOutThreshold: parseInt(process.env.OUT_OF_STOCK_THRESHOLD || 0),
};
