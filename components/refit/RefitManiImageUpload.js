import React from 'react';
import classNames from 'classnames';
import RefitHeader from './parts/RefitHeader';

import { DarkButton } from '../basic/buttons';

import style from '../../static/components/refit/refit-mani-image-upload.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const labelList = [
  {
    label: 'FRONTAL PIC',
    text: 'Take a frontal photo of your left hand with the gels on.'
  },
  {
    label: 'SIDE LEFT PIC',
    text: 'Take a left side photo of your left hand with the gels on.'
  },
  {
    label: 'SIDE RIGHT PIC',
    text: 'Take a right side photo of your left hand with the gels on.'
  },
  {
    label: 'FRONTAL PIC',
    text: 'Now a frontal one of your right hand with the gels on.'
  },
  {
    label: 'SIDE LEFT PIC',
    text: 'Let’s see that right side view of your right hand.'
  },
  {
    label: 'SIDE RIGHT PIC',
    text: 'Last but not least, show us the left side of your right hand.'
  },
];

const RefitManiImageUpload = ({
  onPicture,
  state,
  onBack,
  onNext
}) => {

  const isManis = state.profileType === 'Manis';

  const renderLines = (arr) => (
    arr.map(index => (
      <div key={index} className={style.oneLine}>
        <img
          src={`https://d1b527uqd0dzcu.cloudfront.net/web/refit/${isManis ? 'hand': 'foot'}${index % 3}.jpg`}
          className={classNames(style.leftImg, index >= 3 && style.flip )}
          alt='upload-helper' />
        <div className={style.leftImg}>
        {state[`image${index}UriValue`] ?
          <img
            className={style.labelPanel}
            src={state[`image${index}UriValue`]}
            alt='refit-uploaded' />:
          <div className={style.labelPanel}>
            <div className={style.bold}>
              {`${index < 3 ? 'LEFT': 'RIGHT'} ${isManis ? 'HAND': 'FOOT'}`}
              <br />
              {labelList[index].label}
            </div>
            <div className={style.uploadLabel}>
              {isManis? labelList[index].text: labelList[index].text.replace('hand', 'foot')}
            </div>
          </div>
        }
        <div className={style.buttonPanel} onClick={onPicture(index)}>
          {state[`image${index}UriValue`] ? 'Retake picture': 'Take picture'}
          <img src='/static/icons/camera-upload2.svg'
            className={style.cameraIcon}
            alt='camera-icon' />
        </div>
        </div>
      </div>
    ))
  );
  return (
    <>
      <RefitHeader
        title={isManis? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'}
        onBack={onBack} />
      <div className={style.container}>
        <div className={commonStyle.title}>SHOW US YOUR <br /> CURRENT FIT!</div>
        <div className={commonStyle.description}>
          Our 3D modeling experts’ resize work will <br /> be much easier with your pics.
        </div>
        <div className={classNames(commonStyle.boldLabel, style.leftLabel)}>
          {isManis? 'LEFT HAND': 'LEFT FOOT'}
        </div>

        <div className={style.imgPanel}>
          {renderLines([0,1,2])}
          <div className={commonStyle.boldLabel}>
            {isManis? 'RIGHT HAND': 'RIGHT FOOT'}
          </div>
          {renderLines([3,4,5])}
        </div>

        {/*
        <div className={commonStyle.boldLabel}>
          VIDEO
        </div> */}
        {/* If you prefer, let’s shoot a video of how your manis look */}

        <div className={style.buttonLine}>
          <DarkButton
            passedClass={style.actionButton}
            onClick={onNext}>
            REVIEW RESIZE
          </DarkButton>
        </div>
      </div>

    </>
  );
};

export default RefitManiImageUpload;
