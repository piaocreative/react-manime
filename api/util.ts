import { API } from '@aws-amplify/api';
import { IntegrationProxy } from 'api/connections/integrationProxy';
import { ManimeApi } from 'api/connections/manimeApi';
import axios from 'axios';
import config from 'config';
import log from 'utils/logging';

const DYNAMO_DB_1 = 'DynamoDB1';

const withHeader = (response, headerLabel, headerValue) => ({
  ...response,
  headers: { ...response?.headers, [headerLabel]: headerValue },
});
const withJsonHeader = response => withHeader(response, 'Content-Type', 'application/json');

export const sendSlackMessage = async (channelName, message) => {
  const body = { channelName, body: message };
  return await ManimeApi('post', `/slack/messages`, body);
};

export const subscribeToKlaviyo = async (email, listId) => {
  const response = await IntegrationProxy('post', '/klaviyo/subscribe', {
    body: { email, listId },
  });
  return response;
};

export const compressImage = async (identityId, quality, fileName) => {
  const response = await IntegrationProxy('post', '/image/compress', {
    body: { identityId, quality, fileName },
  });
  return response;
};

export const sendEmail = async dynamicData => {
  const response = await IntegrationProxy('post', '/email', {
    body: { ...dynamicData },
  });
  return response;
  return null;
};

export const sendSMS = async (to, body) => {
  const response = await IntegrationProxy('post', '/message', {
    body: { to, body },
  });
  log.info(response);
  return response;
};

export const sendSESEmail = async dynamicData => {
  const userInit = {
    body: { ...dynamicData },
  };

  const response = await IntegrationProxy('post', '/ses', userInit);
  return response;
};

export const createFunnelUser = async email => {
  const userInit = {
    body: { email },
  };
  const response = await IntegrationProxy('post', '/actions', userInit);
  return response;
};

export const addSessionDDB = async (sessionId, referralId) => {
  const userInit = {
    body: { sessionId, referralId },
  };
  // const response = await IntegrationProxy('post', '/actions', userInit);
  // return response;
};

export const addSessionActionDDB = async (sessionId, attributeName, attributeValue) => {
  const userInit = {
    body: { sessionId, attributeName, attributeValue },
  };
  // const response = await API.put('IntegrationProxy', '/actions', userInit);
  // return response;
};

export const smartyStreetExtract = async addressString => {
  const userInit = {
    body: { addressString },
  };
  try {
    const toReturn = await IntegrationProxy('post', '/smartystreet/extract', userInit);
    return toReturn;
  } catch (err) {
    log.error('caught error getting smartystreets. ', err);
  }
};

// Retry
const API_RETRIES = 7;
const INIT_TIMEOUT = 2000;

export const postEmail = async email => {
  const userInit = {
    body: { text: email },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const response = await API.post(DYNAMO_DB_1, `/todos`, userInit);
  return response;
};

export const sendGridEmailValidation = async email => {
  return axios({
    url: `https://api.sendgrid.com/v3/validations/email`,
    method: 'post',
    headers: {
      Authorization: `bearer ${config.sendgrid.apiKey}`,
      'Content-Type': 'application/json',
    },
    data: { email },
  });
};

export const getShortenLink = async Url => {
  try {
    const result = await axios({
      url: `${config.endpoints.shortLink}/getLink`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { url: Url },
    });
    return result.data;
  } catch (err) {
    return Url;
  }
};

export const upsertPresigned = async (userId, text) => {
  const init = {
    body: { id: userId, text },
  };

  const response = await API.post('PresignedDB', `/presigned`, init);
  log.info(response);
  return response;
};

export const getPresigned = async userId => {
  const response = await API.get('PresignedDB', `/presigned/${userId}`, undefined);
  return response;
};

export const upsertEmailCollection = async (userId, text) => {
  const init = {
    body: { id: userId, text },
  };

  const response = await API.post('EmailCollectionDB', `/email`, init);
  // log.info(response);
  return response;
};

export const getRedeemableItem = async id => {
  const response = await API.get('RedeemableItemsDB', `/item/${id}`, undefined);
  return response;
};

export const postRedeemableItem = async (id, text) => {
  const init = {
    body: { id, text },
  };

  const response = await API.post('RedeemableItemsDB', `/item`, init);
  return response;
};

export const sendKlaviyoEmail = async ({
  templateId = '',
  user = {} as any,
  fromName = 'ManiMe',
  fromEmail = 'ManiMe@manime.co',
  context = {} as any,
  subject = '',
}) => {
  var data = {
    subject: subject || 'Subject',
    from_name: fromName,
    from_email: fromEmail,
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
    context: {
      message: (context || {}).message || '',
      sender: (context || {}).sender || '',
      link: (context || {}).link || '',
      name: (context || {}).name || '',
      friend_name: (context || {}).friend_name || '',
    },
  };
  const response = await axios({
    url: `${config.klaviyoTemplate.sendEmailUrl}/${templateId}/render`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  });

  try {
    const body = JSON.parse(response.data.body);
    const dynamicData = {
      email: user.email,
      from: fromEmail,
      subject: subject || 'Subject',
      body: body.data.html,
    };
    await sendSESEmail(dynamicData);
  } catch (err) {
    log.error('[lambdaFunctions][sendKlaviyoEmail] error sending  email ' + err, { err });
  }
};
