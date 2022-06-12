import React, { useState } from 'react';
// import Box from './styled/Box'
import constants from '../constants';
import style from 'static/components/Steps/mobile/index.module.css';
import { motion, useMotionValue, useTransform, useCycle } from 'framer-motion';

const TOTAL_STEPS = constants.totalSteps;

const CustomStepper = ({ currentStep = 0, totalSteps = TOTAL_STEPS }) => {
  if (currentStep < 0) {
    return null;
  }
  const [renderedStep, setRenderedStep] = useState(currentStep);
  const percent = Number((currentStep / (totalSteps - 1)) * 100);
  const duration = 1.2;
  const slide = {
    x: [
      (renderedStep / (totalSteps - 1)) * 30,
      (currentStep / (totalSteps - 1)) * 30,
    ],
  };

  return (
    <div className={style.root} style={{}}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
        <motion.div
          className={style.stepBarComplete}
          animate={{ width: `${percent}%` }}
          transition={{ duration }}
        />


      <div
        className={style.dropGroup}

      >
        <img
          className={style.waterDrop}
          src="/static/icons/color-water-drop.svg"
        />
        <div className={style.label}>{currentStep + 1}</div>
      </div>
      <div className={style.stepBarRemaining} />
      </div>
    </div>
  );
};

export default CustomStepper;
