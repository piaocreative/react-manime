import { getItemFromLocalStorage, setItemToLocalStorage } from './localStorageHelpers';
import { retrieveUserData, updateUserColumn, addCredits } from 'api/user';
import constants from '../constants';

import { getStore } from 'lib/redux'
import { SET_KEY_VALUE } from 'actions'
import log from 'utils/logging'
import {  } from './track'


export async function checkReferral (identityId) {
  try {
    const store = getStore();
    const referralId2 = getItemFromLocalStorage('referralId2');
    const promotionId = getItemFromLocalStorage('promotionId');
    const sourceId = getItemFromLocalStorage('sourceId');
    setItemToLocalStorage('referralId2', '');
    setItemToLocalStorage('promotionId', '');
    setItemToLocalStorage('sourceId', '');
    if (referralId2) {
      const sourceUserObject = await retrieveUserData(sourceId);
      await updateUserColumn(identityId, 'referralId', referralId2);
      addCredits(identityId, promotionId === 'defaultPromotion' ? constants.referral.NORMAL_REFERREE_CREDIT : 0, 'Referral - Referred', 'Referral - Referred');

      try{
        store.dispatch(SET_KEY_VALUE('credits', constants.referral.NORMAL_REFERREE_CREDIT))
      }catch(error){
        log.error("[referralUtils][checkReferral] could not dispatch event", error)
      }

    }
  } catch (err) {
    log.error('[referralUtils][checkReferral] try', { err } );
  }
}