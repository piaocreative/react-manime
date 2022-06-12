import short from 'short-uuid';
import { ManimeApi } from './connections/manimeApi'
// FIXME: UPDATE AFTER FILTERBY
export const getReferralLink = async referralId => {
  // FIXME later : denis touched
  const response = await ManimeApi('get', `/referrals/read?filter=referralId eq ${referralId}` );
  return response;
};


export const retrieveUsersWithReferralId = async referralId => {
  const result = await ManimeApi('get', `/users/read?filter=referralId eq ${referralId}`);
  return result;
};

export const addReferralToUser = async (referralId, sourceId, userId) => {
  const userData = {
    referralId,
    referrerUserId: sourceId,
    referredUserId: userId
  };
  const result = await ManimeApi('post', `/referraltousers/create`, userData);
  return result;
}

export const getReferralsWithIdentityId = async (sourceId, linkType, promotionId) => {
  let path = `/referrals/read?filter=sourceId eq ${sourceId}`
  if (linkType) path += `,type eq ${linkType}`;
  if (promotionId) path += `,promotionId eq ${promotionId}`;
  const response = await ManimeApi('get',  path);
  return response;
}

export const createReferralLink = async (promotionId, sourceId, type) => {
  const referralId = short.generate();
  const userData = { referralId, promotionId, sourceId, type };
  const result = await ManimeApi('post', '/referrals', userData);
  return result;
};