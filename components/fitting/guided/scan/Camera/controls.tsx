import React, { useState } from 'react';
import style from 'static/components/fitting/guided/controls.module.css';
import sharedStyle from '@styles/fitting/guided/fingers.module.css';
import { motion, useMotionValue, useTransform, useCycle } from 'framer-motion';
import { GuidanceMeta } from '../../config';
import { PrimaryButton, DarkButton } from 'components/basic/buttons';
import CheckIcon from 'components/icons/howto/CheckIcon';
import CameraButton from 'static/icons/camera-button'
const MAX_WIDTH = '325px';
const MAX_HEIGHT = '150px';
const MAX_BORDER = '10px';

const MIN_WIDTH = '80px';
const MIN_HEIGHT = '80px';
const MIN_BORDER = '40px';

type CameraControlProps = {
  inReview: boolean;
  preparePhoto: any;
  keepPhoto: any;
  reviewImage;
  guidance: GuidanceMeta;
  cardRatio: number,
  showCameraButton: boolean
};
export default function CameraControls({
  inReview,
  preparePhoto,
  keepPhoto,
  reviewImage,
  guidance,
  cardRatio,
  showCameraButton
}: CameraControlProps) {
  const reviewVariants = {
    open: {
      height: `auto`,
      transition: {
        duration: 0.6,
        ease: 'easeIn',
        type: 'spring',
        delay: .3
      },
    },
    closed: {
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const cameraVariants = {
    show: {
      opacity: 0,
      transition: {
        duration: .3,
        ease: 'easeInOut',
        delay: inReview ? .2 : 0
      },
      transitionEnd: {
        display: 'none'
      }
      
    },
    hide: {
      opacity: 1,
      display: 'flex',
      transition: {
        duration: .3,

        ease: 'easeInOut',
        delay: inReview ? .2 : 0
      },
    }
  }

  return (
    <div
      className={style.controlContainer}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          opacity: 1,
          justifyContent: 'center',
          marginBottom: '8vh',

        }}
        variants={cameraVariants}
        animate={showCameraButton ? "show" : "hide" }
        whileTap={{ scale: 0.8 }}
        onTap={(event,info)=>{

            preparePhoto();

        }}
      >
      <CameraButton />

      </motion.div>
      <motion.div
        animate={inReview ? 'open' : 'closed'}
        variants={reviewVariants}
        className={style.proTipVideo}
      >
        <div style={{paddingTop: '15px'}}>
          {guidance.reviewHeader.replace('%name%', guidance.name?.toUpperCase())}.
        </div>
        <div className={style.proTipSection}>

          {
            guidance.reviewQuestions?.map((question, index) => {
              return (
                <div className={`${sharedStyle.proTipRow} ${style.proTipRow}`} key={index}>
                <CheckIcon color={'#69b297'}
                  className={`${sharedStyle.checkIcon}`}
                />
                {question}
              </div>
              )
            })
          }


        </div>
        <div className={style.actionLine} onClick={ev => ev.preventDefault()}>

            <PrimaryButton passedClass={style.retakeButton} onClick={preparePhoto}>
              Retry
          </PrimaryButton>
            <DarkButton
              passedClass={style.continueButton}
              onClick={keepPhoto}>
              Nailed It
          </DarkButton>

        </div>
      </motion.div>
    </div>
  );
}

/**
 *
 *

 */
