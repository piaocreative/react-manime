
import { ManimeApi } from './connections/manimeApi'
import {getFitVersion, getLotteryOverride}  from 'utils/camera';
import {UAParser} from 'ua-parser-js'
import {experiments} from 'utils/abTest'
import log from 'utils/logging'
const DEFAULT_PROFILE = {
  isDefault: false,
  statusLeftFingers: null,
  statusLeftThumb: null,
  statusRightFingers: null,
  statusRightThumb: null,
  versionLeftFingers: null,
  versionLeftThumb: null,
  versionRightFingers: null,
  versionRightThumb: null,
  versionSide: null,
  statusSide: false,
  fitStatus: null, //'fittingValidated'
};

export const createProfile = async (profile) => {
  const result = await ManimeApi('post', '/profiles/create', profile);
  return result;
};


export const editProfile = async (profile) => {
  const activeVariant = getFitVersion();
  const lotteryOverride = getLotteryOverride();

  // with more time would be good to add this to redux and only set it on initial mount of the app
  const width = window?.screen?.width * window?.devicePixelRatio;
  const height = window?.screen?.height * window?.devicePixelRatio
  const scaleFactor = window?.devicePixelRatio
  const userAgent = navigator?.userAgent || "";
  var parser = new UAParser(userAgent);
  const metaData = {
    fitVersion: lotteryOverride ? experiments.fitting.variantNames[1] :  activeVariant ,
    vendor: parser.getDevice().vendor,
    model: parser.getDevice().model,
    width, 
    height,
    scaleFactor,
  }
  const result = await ManimeApi('post', '/profiles/patch', { ...profile, metaData});
  return result;
};

export const getProfiles = async userId => {
  const result = await ManimeApi('get', `/profiles/read?filter=userId eq ${userId}`);
  log.verbose('get profile result is ',  result)
  return result;
};

export const getProfileWithId = async profileId => {
  const result = await ManimeApi('get', `/profiles/read?filter=profileId eq ${profileId}`);
  if (result && result.length === 1) {
    return result[0];
  }
  return null;
};

export const removeProfile = async profileId => {
  return await ManimeApi('delete', `/profiles`, {
    profileId
  });
};

export const getProfileOverview = async userId => {
  const result = await ManimeApi('get', `/userData?userId=${userId}`);
  return result;
}

export const addFitReview = async (body) => {
  return await ManimeApi('post', '/fitreviews/create', body);
};
