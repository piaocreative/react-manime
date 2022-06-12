
import config from 'config';
import { API } from '@aws-amplify/api';

const API_MANIME = 'ManimeApi';

export const ManimeApi = (method, path, body=undefined, header=undefined) => {
  const apiName = API_MANIME;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.ManimeApi.apiKey,
      ...header
    }
  };
  if(!API[method]){
    return null;
  }
  return API[method](apiName, path, userInit);
}