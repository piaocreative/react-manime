import { getFittingImageUrl, listFittingKeys } from 'utils/profileData';
import {
  FitType, 
  getDefaultPhotosMeta, 
  getDefaultStepSequence,
  getDefaultStepsKeys,
  KeyedPhotoMeta,
  PhotoStatus,
} from 'components/fitting/guided/config';

import log from 'utils/logging';
import { StepSequence } from 'types';



export async function buildPhotosMeta(
  fitType=FitType.MANIS,
  fitProfiles: any[],
) : Promise<KeyedPhotoMeta> {

  const fitProfile = fitProfiles?.filter(profile=>profile.profileType===fitType)?.[0]
  const photosMeta = getDefaultPhotosMeta(fitType)
  const stepList =  getDefaultStepsKeys(fitType)

  if(!fitProfile){
    // could create a fit proflie here if we wanted ... maybe we should as an escape hatch?
    return photosMeta;
  }

    // NOTE: display images if in availableSteps and status in rds is valid, otherwise don't display
    // get keys and version from S3
    const directoryListing = await listFittingKeys(
      fitProfile.isDefault ? undefined : fitProfile.profileId
    );
  
    if(directoryListing.length==0){
      return {...photosMeta}
    }
  
    directoryListing.map((key: any) => {
      stepList.forEach((step) => {
        if (key.includes(step)) {
          extractHighestVersion(step, photosMeta[step], key);
        }
      });
    });
  
  // get approval status from db
  const promises = [];
  stepList.forEach(step=>{
    const photoMeta = photosMeta[step]
    const statusKey = `status${step[0].toUpperCase()}${step.substring(1)}`
    const versionKey = `version${step[0].toUpperCase()}${step.substring(1)}`

    
    
    // if version is not 0 then there is something uploaded
    if(photoMeta.version !==0){
      promises.push( getFittingImageUrl(photoMeta.key).then((result) => {
      //  log.verbose("result url is " + result)
        return {url: result, key: step}

      }).catch(error =>{
        log.error("[guided/utils][buildPhotoMeta] could not get url for the key " + error, {photoMeta, error})
      }));
      // if the photo is invalid
      if(!fitProfile[statusKey]){
        photoMeta.status = PhotoStatus.REJECTED
      }else{
        photoMeta.status = PhotoStatus.APPROVED
      }
    }
  })

  const results = await Promise.all(promises);
  results.forEach(result=>{
    photosMeta[result.key].url = result.url
  })

  log.verbose('extracted files is ', photosMeta);
  
  return photosMeta;
}

export  function buildStepSequence(fitType= FitType.MANIS, photosMeta: KeyedPhotoMeta) : StepSequence{

  let  stepSequence = getDefaultStepSequence(fitType)

  let step = stepSequence.start;
  let originalStart = step
  while(stepSequence.steps[step]){
    const nextStep = stepSequence.steps[step].next
    const prevStep = stepSequence.steps[step].previous

    if(photosMeta[step].status !== PhotoStatus.NEW){
      stepSequence.steps[step].meta.guidance.description =''
    }

    if(photosMeta[step].status === PhotoStatus.REJECTED){

      stepSequence.steps[step].meta.guidance.description ='Retake your'
      
    } else if(!(photosMeta[step].status===PhotoStatus.NEW || photosMeta[step].status === PhotoStatus.REJECTED)){
      if(step === originalStart){
        stepSequence.start = nextStep;
        originalStart = nextStep
      }
      

      delete stepSequence.steps[step]
      if(prevStep){
        stepSequence.steps[prevStep].next = nextStep;
      }
      
      nextStep && (stepSequence.steps[nextStep].previous = prevStep);
    }
    step = nextStep
    
  }

  if(stepSequence.steps[stepSequence.start]){
    stepSequence.steps[stepSequence.start].previous = undefined;
  }

  return stepSequence
}

function extractHighestVersion(fileName, fingerMeta, key) {
  const re = new RegExp(`(${fileName})(\\.(\\d+))?\\.[(jpeg)|(png)|(jpg)|(bmp)]`);
  const match = key.match(re);
  if (match) {
    const parsed = Number.parseInt(match[3])
    const thisVersion = isNaN(parsed) ?  1 : parsed;
    fingerMeta.status = PhotoStatus.PENDING
    if (fingerMeta.version <= thisVersion) {
      fingerMeta.version = thisVersion;
      fingerMeta.key = key;
    }
  }
}