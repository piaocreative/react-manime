
import config from 'config';
import { API } from '@aws-amplify/api';
const API_MANIME_CACHED = 'ManimeApiCached'

export const ManimeApiCached = (method, path, body=undefined, header=undefined) => {
  const apiName = API_MANIME_CACHED;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.ManimeApi.apiKey,
      ...header
    }
  };

  if ( !API[method]){
    throw Error(`Unsupported HTTP method , ${JSON.stringify({method, path})}`);
  }

  return API[method](apiName, path, userInit);


}