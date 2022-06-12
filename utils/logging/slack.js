const { API } = require( '@aws-amplify/api');


const API_LAMBDA_RDS = 'ManimeApi';
const SLACK_PATH = `/slack/messages`

// import newDetailProductIds from '../newDetailProductIds';

module.exports = {

logSlack : (channelName, message) => {
    const body = {channelName, body: message}
  const apiName = API_LAMBDA_RDS;
  const userInit = {
    body,
    headers: { 'Content-Type': 'application/json' }
  };
  return API.post(apiName, SLACK_PATH, userInit);

}
}