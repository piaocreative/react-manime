import config from 'config';
import { API } from '@aws-amplify/api';
import log from 'utils/logging'
const API_LAMBDA_PAYMENT = 'LambdaPayment';


export const PaymentApi =  (method, path, body=undefined) => {
  const apiName = API_LAMBDA_PAYMENT;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.LambdaPayment.apiKey
    }
  };

  try{
    return API[method](apiName, path, userInit);
  } catch(err) {
    log.error(`[payment][PaymentAPI] could not execute api ${err}`,  {method, path, body, err})
  }

}