import Amplify from '@aws-amplify/core';
import config from '../config';

export function configureAmplify() {
  let identityPoolId = config.aws.amplify.identityPoolId;
  let region = config.aws.amplify.region;
  let userPoolId = config.aws.amplify.userPoolId;
  let userPoolWebClientId = config.aws.amplify.userPoolWebClientId;

  Amplify.configure({
    Auth: {
      identityPoolId,
      region,
      userPoolId,
      userPoolWebClientId,
      mandatorySignIn: true,
      oauth: {
        domain: config.aws.amplify.domain,
        scope: ['phone', 'email', 'profile', 'aws.cognito.signin.user.admin', 'openid'],
        redirectSignIn: `${config.appUrl}/auth?step=oauth_redirect`,
        redirectSignOut: `${config.appUrl}`,
        // responseType: 'code',
        responseType: 'token',
        options: {
          AdvancedSecurityDataCollectionFlag: false,
        },
      },
      federationTarget: 'COGNITO_USER_POOLS',
    },
    Storage: {
      bucket: config.aws.storage.bucket,
      region: config.aws.storage.region,
    },
    API: {
      endpoints: [
        {
          name: 'LambdaPayment',
          endpoint: config.aws.api.LambdaPayment.endpoint,
          service: 'execute-api',
          region: config.aws.api.LambdaPayment.region,
        },
        {
          name: 'ManimeApi',
          endpoint: config.aws.api.ManimeApi.endpoint,
          service: 'execute-api',
          region: config.aws.api.ManimeApi.region,
        },
        {
          name: 'ManimeApiCached',
          endpoint: config.aws.api.ManimeApiCached.endpoint,
          service: 'execute-api',
          region: config.aws.api.ManimeApiCached.region,
        },
        {
          name: 'IntegrationProxy',
          endpoint: config.aws.api.IntegrationProxy.endpoint,
          service: 'execute-api',
          region: config.aws.api.IntegrationProxy.region,
        },
        {
          name: 'DynamoDB1',
          endpoint: config.aws.api.DynamoDB1.endpoint,
          service: 'execute-api',
          region: config.aws.api.DynamoDB1.region,
        },
        {
          name: 'PresignedDB',
          endpoint: config.aws.api.PresignedDB.endpoint,
          service: 'execute-api',
          region: config.aws.api.PresignedDB.region,
        },
        {
          name: 'EmailCollectionDB',
          endpoint: config.aws.api.EmailCollectionDB.endpoint,
          service: 'execute-api',
          region: config.aws.api.EmailCollectionDB.region,
        },
        {
          name: 'RedeemableItemsDB',
          endpoint: config.aws.api.RedeemableItemsDB.endpoint,
          service: 'execute-api',
          region: config.aws.api.RedeemableItemsDB.region,
        },
      ],
    },
  });
}
