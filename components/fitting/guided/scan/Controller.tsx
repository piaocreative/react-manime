import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Camera from './Camera';
import Guidance from './Guidance'
import { StepSequence } from "types"
import log from 'utils/logging';
import Link from 'next/link'
import PopUp from './Camera/PopUp'
import { track, trackFunnelActionProjectFunnel } from '../../../../utils/track';
import NavigationBar from '../NavigationBar'
import style from 'static/components/fitting/guided/fingers.module.css';
import { GuidanceMeta, KeyedPhotoMeta, PhotoStatus } from '../config'


type Props = {
  imageProps?: ImageProps,
  stepSequence: StepSequence,
  photosMeta: KeyedPhotoMeta,
  photosMetaCallback: any,
  track: Function
};
type ImageProps = {
  quality, type, scale
}
const DEFAULT_IMAGE_PROPS: ImageProps = {
  quality: 1,
  type: 'jpeg',
  scale: .8
}
enum Orientation {
  UNDEFINED, PORTRAIT, LANDSCAPE
}

const PhotoGuide = ({ imageProps = DEFAULT_IMAGE_PROPS, stepSequence, photosMeta, photosMetaCallback, track }: Props) => {
  const cardRatio = 0.628;
  const [isMounted, setIsMounted] = useState(false);
  const [orientation, setOrientation] = useState<number>(Orientation.UNDEFINED);
  const [inReview, setInReview] = useState(false);
  const [stepIndex, setStepIndex] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0);
  const camera = useSelector((state : any)=>state.cameraData.camera)
  const router = useRouter();
  const [proTipState, setProTipState] = useState("closed");
  const camBodyRef = useRef(null);
  const stepParam = router.query.step as string[];
  let step = undefined;
  if (stepParam && stepParam.length == 3) {
    step = stepParam[2];
  }

  const { profileId, userId, isDefault: isDefaultProfile } = useSelector((state : any) => {
    const profile = state.profileData.profiles.find(
      (profile) => profile.profileType === 'Manis'
    );
    return { profileId: profile?.profileId, userId: profile?.userId, isDefault: profile?.isDefault }
  });

  function _track(message, data=undefined){
    track(`[ScanController]${message}`, data)
  }

  useEffect(() => {
    _track(`[mount] ${step}`);

    window.addEventListener('resize', handleResize);


    const root = router.asPath;
    
    if (!step) {
      let stepCount = 0;
      let thisStep = stepSequence.start

      while (thisStep) {

        stepCount++;
        thisStep = stepSequence.steps[thisStep].next
      }
      setStepIndex(0);
      setTotalSteps(stepCount)
      router.replace(
        {
          pathname: `${root}/${stepSequence.start}`,
        },
        {
          pathname: `${root}/${stepSequence.start}`,
        },
        { shallow: true }
      );
    } else {
    }

  }, []);


  useEffect(() => {
    if (step) {
      (async ()=>{
        setIsMounted(true);
        const stepIndex = getStepIndex(step)
        setStepIndex(stepIndex)

        _track('[stepChange] setting stepIndex', {step, stepIndex})
      })();
    }

    // this can happen if someone hits back, goes back to the instruction screen, 
    // then uses the forward button ... the "mount" would never happen in that situation
    if(totalSteps===0){
      
      let stepCount = 0;
      let thisStep = stepSequence.start

      let path = router.asPath;
      path = path.substring(0, path.indexOf("/scan") + 5)
      while (thisStep) {

        stepCount++;
        thisStep = stepSequence.steps[thisStep].next
      }
      _track('[stepChange] recalculate current finger', {stepCount, thisStep, path})
      setStepIndex(0);
      setTotalSteps(stepCount)
      
      // also if this has happened then the current "step" is wrong so need
      // to go back to the start
      router.replace(
        {
          pathname: `${path}/${stepSequence.start}`,
        },
        {
          pathname: `${path}/${stepSequence.start}`,
        },
        { shallow: true }
      );
    }
  }, [step]);

  useEffect(() => {
    if (isMounted &&  camera) {
      handleResize();
    }
  }, [isMounted, camera]);

  const appear = {

  }

  const handleResize = () => {
    if (typeof window !== 'undefined') {
      const width = window.screen.width
      const height = window.screen.height
      setOrientation(width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT)

    }
  };


  function getStepIndex(step: string) {
    let index = 0;
    let thisStep = stepSequence.start

    while (thisStep) {
      if (thisStep === step) {
        break;
      }
      index++;

      thisStep = stepSequence.steps[thisStep].next;
    }
    return index;
  }



  type PhotoCallbackInput = {
    success: boolean,
    keepOldPhoto: boolean,
    smallImage: any,
    largeImage?: any,
    version: number,
    type: string
  }

  async function photoCallback(input: PhotoCallbackInput) {
    if (input.success) {
      _track('[photoCallback] input success', input )
      input['next'] = stepSequence.steps[step].next


      const hasMore = stepSequence.steps[step].next ? true : false;
      input['hasMore'] = hasMore;
      if (!input.keepOldPhoto) {
        input['uploadImage'] = {
          step,
          profileId: (isDefaultProfile) ? undefined : profileId,
          userId,
          fileType: input.type,
          version: input.version
        }


        const largeImage = input.largeImage;
        delete input.largeImage;

        input['uploadImage'].largeImage = largeImage

      }
      photosMetaCallback(input)
      if (hasMore) {

        const root = router.asPath.substring(0, router.asPath.lastIndexOf('/'));
        router.push(
          {
            pathname: `${root}/${stepSequence.steps[step].next}`,
          },
          {
            pathname: `${root}/${stepSequence.steps[step].next}`,
          }
        );

      }

    } else {
      _track('[photoCallback] error with callback', input)
      log.error('[scan/Controller][photoCallback] photo capture failed ' , {input});
    }
  }

  const width = window.screen.width;
  const height = window.screen.height;

  let body = <></>

  if (isMounted && stepSequence && stepSequence.steps && step && stepSequence.steps[step]) {

    if(orientation == Orientation.LANDSCAPE){
      body= 
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'ceter', margin: 'auto'}}>
          <div style={{width: '60%', height: '30%'}}>
            Fit Flow 2.0 only works in Portrait mode. Please rotate your phone to continue using. 
          </div>
          
        </div>
    }
    else{

    // const popUp =  photosMeta[step].status === PhotoStatus.REJECTED
    body =
      <>
        <PopUp open={photosMeta[step].status === PhotoStatus.REJECTED} >

          <div style={{ overflow: 'hidden', height: '40vh', width: `calc(40vh * ${cardRatio})` }}>
            <img style={{ width: `calc(40vh * ${cardRatio})` }} src={photosMeta[step].url} />
          </div>
          <div style={{ flex: 1, width: `calc(40vh * ${cardRatio})` }}>
            The photo you uploaded could not be used, please try again.
          </div>
        </PopUp>
        <NavigationBar />
        {
          !stepSequence.meta.hideSteps &&

          <Guidance 
            currentStep={stepIndex} 
            totalSteps={totalSteps} 
            guidance={stepSequence.steps[step].meta.guidance} 
            proTipState={proTipState} 
            setProTipState={setProTipState} 
            inReview={inReview}/>

        }


        <div className={style.body} ref={camBodyRef}>
          <Camera
            directionsMeta={stepSequence.steps[step].meta['guidance'] as GuidanceMeta}
            height={height}
            width={width}
            photoCallback={photoCallback}
            photoMeta={photosMeta[step]}
            proTipState={proTipState}
            imageProps={imageProps}
            inReview={inReview}
            setInReview={setInReview}
          />
        </div>
      </>
    }

  }

  return (
    <div className={style.container}>
      {body}
    </div>
  );
};

export default PhotoGuide;

