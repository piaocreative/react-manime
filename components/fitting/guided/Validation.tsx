import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import { connect } from 'react-redux';
import {pageLinks} from 'utils/links'
import { DarkButton, WhiteButton } from '../../basic/buttons';
import { getDefaultStepSequence, FitType, KeyedPhotoMeta } from './config';
import {GuidanceMeta} from './config'
import style from 'static/components/fitting/guided/validation.module.css';
import log from 'utils/logging';
import NavigationBar from './NavigationBar'

const Validation = ({
  currentPicsMeta,
  retakeCallback,
  doneCallback,
  showSkipButton,
  fitType,
}: {
  currentPicsMeta: KeyedPhotoMeta;
  retakeCallback: Function;
  doneCallback: Function;
  showSkipButton?: boolean;
  fitType: FitType;
}) => {
  const [images, setImages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (currentPicsMeta) {
      buildImages(currentPicsMeta);
    }
  }, [currentPicsMeta]);

  function buildImages(picsMeta) {}
  log.verbose('metadata is ', currentPicsMeta);
  const flattened = [];
  Object.keys(currentPicsMeta).forEach((key) => {
    const entry: any = { ...currentPicsMeta[key] };
    entry.fileName = key;
    flattened.push(entry);
  });
  const values = Object.values(flattened);
  const metaArray = values.sort(
    (left, right) => left['order'] - right['order']
  );
  log.verbose('built the array', metaArray);

  const submitHandler = () => {
    /*    const { hasPedis, transitionTrigger } = Router.router.query;
    if (Router.router.query.returnUrl) {
      Router.push(Router.router.query.returnUrl);
    } else if (transitionTrigger !== 'checkout' || hasPedis === 'true') {
      onGoFinger(6)();
    } else {
      Router.push(pageLinks.Checkout.url);
    }*/
  };


  const defaultSteps = getDefaultStepSequence(fitType);

  return (
    <div className={style.container}>

       <div className={style.mainTitle} >Review all pictures</div>
      <div className={style.mainDescription}>
        Take clear, well-lit pictures for an accurate custom-fit.
      </div>

        {metaArray.map((meta, index) => (
        <div key={index} className={style.oneItem}>
        <div className={style.subTitle}>{defaultSteps.steps[meta.fileName].meta.guidance.name} </div>
        <div className={style.imagePanel}>
          <div className={style.nailPanel}>
            <div className={style.tipStyle}>Example</div>
            <img className={style.nailStyle} src={defaultSteps.steps[meta.fileName].meta.guidance.examples.image} alt='nail' />
          </div>
          <div className={style.nailPanel}>
            <div className={style.tipStyle}>Your Pic</div>
            <img className={style.nailStyle} src={meta['url']} alt='nail' />
          </div>
        </div>
        <WhiteButton isSmall passedClass={style.retakeButton} onClick={()=>retakeCallback(meta.fileName)}>
          Retry
        </WhiteButton>

      </div>

        
        ))}


        <DarkButton passedClass={style.submitButton} onClick={doneCallback}>
          Done
        </DarkButton>
        {
          showSkipButton && 

          <DarkButton passedClass={style.submitButton} onClick={()=>router.push(pageLinks.SetupDesign.url)}>
          Skip
        </DarkButton>
          
        }

    </div>
  );
};



export default Validation;
