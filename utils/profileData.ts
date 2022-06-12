import {track, } from './track'
import {  Storage } from '@aws-amplify/storage';
import log from './logging';
import { editProfile } from 'api/profile';

import { SET_PROFILE_KEY_VALUE } from 'actions';
export const getProfileId = (profiles, productType='Manis') => {
  if (!Array.isArray(profiles)) {
    log.error('[INVALID PROFILES] [profileData.js]', { profiles });
    return '';
  }
  const profile = profiles.find(profile => profile.profileType === productType);
  return profile?.profileId || '';
}

export function hasValidManiProfile(profile): boolean{
  if (profile) {
    const {
      statusLeftFingers,
      statusLeftThumb,
      statusRightFingers,
      statusRightThumb,
      statusSide,
    } = profile;
    if (statusLeftFingers && statusLeftThumb && statusRightFingers && statusRightThumb && statusSide)
      return true;
  }
  return false;
}

export function hasValidPediProfile(profile): boolean {
  if (profile) {
    const {
      statusLeftFingers,
      statusRightFingers,
      statusSide,
      statusSidePinky
    } = profile;

    if (statusLeftFingers && statusRightFingers && statusSide){
      return true
    }
  }
  return false;
}


function dataURLtoBlob(dataURL){
  // Decode the dataURL
  let binary = atob(dataURL.split(',')[1])
  // Create 8-bit unsigned array
  let array = []
  let i = 0
  while (i < binary.length){
    array.push(binary.charCodeAt(i))
    i++
  }

  return new Blob([ new Uint8Array(array) ], {type: 'image/jpg'})
}

export async function listFittingKeys(folder=undefined, level='private'){

  const path = `${folder ? folder + '/' : ''}`
   const lists = await Storage.list(path, {level: level});
  const keys = [];
  lists.forEach(entry=>{
   //filters on subdirectories

     if(!folder){
       if(entry.key.indexOf('/')===-1){
        keys.push(entry.key)
       }
     }else{
      keys.push(entry.key)
     }
      

  })
  log.verbose('got list of keys: ', keys)
  return keys;
}

export async function getFittingImageUrl(imageKey){
  return Storage.get(imageKey, { level: 'private' }) 
}
export async function updateProfilePhotoStatus(profileId, step, version, ){

  const statusKey = `status${step[0].toUpperCase()}${step.substring(1)}`
  const versionKey = `version${step[0].toUpperCase()}${step.substring(1)}`
  const profilePatch = {
    profileId,
    [versionKey]: version,
    [statusKey]: true
  }

  await editProfile(profilePatch)
  return {
    versionCamel: versionKey, 
    versionValue: version,
    statusCamel: statusKey, 
    statusValue: true
  }

}

export async function uploadFittingPicture ( {step, file, fileName, fileType='png', folder=undefined, profile=undefined,  version=undefined, level='private' })  {
  const profileId = profile?.profileId || undefined;
  const isDefault = profile?.isDefault ;
  let key = `${!isDefault ? profileId + "/" : ""}${folder ? folder +"/" : ""}${fileName}.${fileType}`;

      const res = await Storage.put(key, file, {
        level: level,
        contentType: `image/${fileType}`
      });


      if(res && level !=="public"){
        return updateProfilePhotoStatus(profileId, step, version, )
      }


  }