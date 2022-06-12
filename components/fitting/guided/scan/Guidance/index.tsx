import React, { useState, useRef, useEffect } from 'react';
// import Box from './styled/Box'
import constants from 'constants/index';
import style from '@styles/fitting/guided/guidance.module.css';
import sharedStyle from '@styles/fitting/guided/fingers.module.css';
import { motion, useMotionValue, useTransform, useCycle } from 'framer-motion';
import { GuidanceMeta } from '../../config'
import CheckIcon from 'components/icons/howto/CheckIcon';

const TOTAL_STEPS = constants.totalSteps;

type Props = {
  currentStep: number,
  totalSteps: number,
  guidance: GuidanceMeta,
  proTipState: string,
  inReview: boolean,
  setProTipState: Function
}
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const CustomStepper = ({ 
  currentStep = 0, 
  totalSteps = TOTAL_STEPS, 
  guidance = {} as GuidanceMeta,
  proTipState,
  setProTipState,
  inReview
}: Props) => {
  if (currentStep < 0) {
    return null;
  }
  const [renderedStep, setRenderedStep] = useState(currentStep);
  const previousStep = usePrevious(currentStep);
  
  const percent = Number((currentStep + 1) / totalSteps * 100);
  const duration = 1.2;
  const slide = {
    x: [
      (renderedStep / (totalSteps)) * 30,
      (currentStep / (totalSteps)) * 30,
    ],
  };

  useEffect(() => {
    const _prevStep = previousStep || 0
    if (!previousStep || _prevStep < currentStep) {
      setProTipState("open");
      setTimeout(() => {
        setProTipState("closed")
      }, 5000);
    }
  }, [currentStep]);


  const proTipContainer = {
    open: {
      height: 'auto',
      transition: {
        duration: .4,
        ease: 'easeInOut',
      }
    },
    closed: {
      height: '0px',
      transition: {
        duration: .4,
        ease: 'easeInOut'
      }
    },
  }
  const guidanceContainer =  {
    hidden: {
      opacity: 0,
      transition: {
        duration: .4,
        ease: 'easeInOut',
      },
      onTranstionEnd: {
        display: 'none'
      }
    },
    visible: {
      opacity: 1,
      transition: {
        display: 'flex',
        duration: .4,
        ease: 'easeInOut',
      }
    }
  }

  function toggleOpen() {
    if (proTipState === 'open') {
      setProTipState('closed')
    } else {
      setProTipState('open')
    }
  }

  return (
    <div className={style.root}>
      <motion.div 
        className={style.container} 
        onClick={toggleOpen} 
        variants={guidanceContainer}
        animate={inReview ? 'hidden' : 'visible'}
        
        >

        <div className={style.shadowContainer}>
          <div className={style.stepBarContainer}>



            <div className={style.stepBar} >
              <motion.div
                className={style.complete}
                animate={{ width: `${percent}%` }}
                transition={{ duration }}
              />

            </div>
            <div className={style.stepIndex}> {currentStep + 1} / {totalSteps} </div>
          </div>
          <div className={style.summary}>
            <div
              className={style.dropGroup}

            >
              <img
                className={style.waterDrop}
                src="/static/icons/color-water-drop.svg"
              />
              <div className={style.label}>{currentStep + 1}</div>
            </div>
            <div className={style.description}>
              {guidance.description}{' '}
              <span className={style.bold}>
                {guidance.name}
              </span>
            </div>
            <img src={guidance.examples.image} className={style.exampleImage} />
            <img src={'/static/icons/info.svg'} className={style.infoIcon}/>
          </div>
          <div className={`${sharedStyle.proTips} ${style.proTips}`}>Pro Tips</div>
            <div className={style.proTipsContainer}>


              {
                guidance?.proTips?.map((tip, index) => {
                  return (
                    <div className={`${sharedStyle.proTipRow}`} key={index}>
                      <CheckIcon color={'#69b297'}
                        className={`${sharedStyle.checkIcon} ${style.checkIcon}`}
                      />
                      {tip}
                    </div>
                  )
                })
              }
            </div>
          <motion.div
            variants={proTipContainer}
            transition={{ duration }}
            style={{ overflow: 'hidden' }}
            animate={proTipState}
          >

            <img src={guidance.examples.gif} id="guidanceVideo" style={{ objectFit: 'cover', objectPosition: 'center top', width: '100%', marginBottom: '-10px', height: 'auto',  maxHeight: '45vh'}} />

          </motion.div>

        </div>
        {
          proTipState==='open' &&
          <div style={{ textAlign: 'center', color: 'white', fontFamily: 'AvenirBook', fontSize: '18px', textTransform: 'uppercase', marginTop: '15px'}}>
            Got it
            </div>
        }
      </motion.div>

    </div>
  );
};

export default CustomStepper;
