
import config from 'config';
import { API } from '@aws-amplify/api';

const API_INTEGRATION_PROXY = 'IntegrationProxy';
const DEFAULT_HEADER = {
  headers: { 
    'Content-Type': 'application/json' ,
  }
};;

export const IntegrationProxy = (method, path, body = undefined) => {
  const apiName = API_INTEGRATION_PROXY;

  if(!API[method]){
    return null;
  }
  return API[method](apiName, path, {...DEFAULT_HEADER, ...body});

}