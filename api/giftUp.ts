import axios from 'axios'
import config from 'config';

export const getGiftCard = async code => {
  return axios({
    url: `https://api.giftup.app/gift-cards/${code}`,
    method: 'get',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
    },
  })
}

export const redeemGiftCard = async (code, amount, reason) => {
  return axios({
    url: `https://api.giftup.app/gift-cards/${code}/redeem`,
    method: 'post',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
    },
    data: {amount, reason}
  });
}

export const getGiftCardList = async () => {
  return axios({
    url: `https://api.giftup.app/gift-cards`,
    method: 'get',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
    },
  });
}