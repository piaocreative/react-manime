import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { howToList } from './HowToApplyVideoList';
import { getDimensions } from '../../../utils/scroll';
import style from './css/how-to-apply-fixed-header.module.css';

const iconPath = '/static/icons/how-to-apply/'

const HowToApplyFixedHeader = ({ activeSectionIndex = 0, moveToSectionHandler }) => {
  const [headerBottom, setHeaderBottom] = useState(0);
  
  useEffect(() => {
    const scrollHandler = () => {
      const header = document.getElementById('header');
      const { offsetBottom: headerBottom } = getDimensions(header);
      setHeaderBottom(headerBottom);
    };

    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  }, []);

  if (activeSectionIndex >= howToList.length) {
    return null;
  }

  return (
    <div className={style.container} style={{top: headerBottom || undefined}}>
    {howToList.map((howToData, index) => (
      <div key={index} onClick={moveToSectionHandler(index)}>
        <img
          className={style.stepIcon}
          src={`${iconPath}step-${index + 1}-${activeSectionIndex===index ? '': 'in'}active.svg`}
          alt='step-icon' />
        <div className={classNames(style.stepName, activeSectionIndex === index && style.activeStepName)}>
          {howToData.stepName}
        </div>
        <div className={classNames(style.shortName, activeSectionIndex === index && style.activeShortName)}>{howToData.shortName}</div>
      </div>
    ))}
    </div>
  );
};

export default HowToApplyFixedHeader;