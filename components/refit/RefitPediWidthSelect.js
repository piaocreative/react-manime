import React, { useState } from 'react';
import classNames from 'classnames';
import { DarkButton, WhiteButton } from '../basic/buttons';
import DialogWrapper from '../basic/dialog';
import AdjustWidthDialog from './parts/AdjustWidthDialog';
import RefitHeader from './parts/RefitHeader';

import { toenailImageSrcList } from '../../constants';

import style from '../../static/components/refit/refit-pedi-width-select.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';
import log from '../../utils/logging'
const RefitPediLengthSelect = ({ state, setState, onBack, onConfirm }) => {

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSelectFinger = index => {
    setSelectedIndex(index);
  };

  const onClose = () => {
    setSelectedIndex(-1);
  };

  const ajustAllHandler = () => {
    setSelectedIndex(10);
  };

  const isReviewed = [...Array(10).keys()].find(index => (state[`f${index}TipWidth`] || state[`f${index}BaseWidth`] || state[`f${index}Comment`])) >= 0;

  return (
    <>
      <RefitHeader
        title={'PEDI FIT IMPROVEMENT'}
        showWidthLogo
        onBack={onBack} />
      <div className={style.container}>
        <div className={commonStyle.description}>
          Select one by one the nails <br /> you want to adjust <br /> OR 
        </div>
        <WhiteButton
          isSmall
          passedClass={style.adjustAllButton}
          onClick={ajustAllHandler}>
          Adjust all nails at once
        </WhiteButton>
        <div className={style.imageContainer}>
          <div className={classNames(style.imagePanel, style.alignRight)}>
            <div className={classNames(style.handCanvas, style.rightHandCanvas)}>
              {!isReviewed &&
              <img
                src='/static/images/refit/left-pedi-glow.gif'
                style={{position: 'absolute', right: -104, top: 4, height: 151, transform: 'scaleX(-1)'}}
                alt='anim' />
              }
              {
                toenailImageSrcList.slice(5, 10).map((item, index) => (
                  (!!state[`f${5 + index}BaseWidth`] || !!state[`f${5 + index}TipWidth`]) &&
                  <img src={item.path}
                    key={index}
                    alt='finger-nail'
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: item.x - 205,
                      top: item.y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => onSelectFinger(5 + index)} />
                ))
              }  
              <img
                src='/static/images/refit/right-foot-width.svg'
                style={{
                  position: 'absolute',
                  zIndex: 9,
                  right: -100,
                  top: 0,
                }}
                width='300'
                height='159'
                useMap='#rightmap'
                alt='some-right' />
              <map name='rightmap'>
                <area shape='circle' coords='82,16,14' alt='right-pinky' href='#' onClick={() => {log.info('9 clikced');onSelectFinger(9);}} />
                <area shape='circle' coords='53,32,14' alt='right-ring' href='#' onClick={() => {log.info('8 clikced');onSelectFinger(8);}} />
                <area shape='circle' coords='36,54,13' alt='right-middle' href='#' onClick={() => {log.info('7 clikced');onSelectFinger(7);}} />
                <area shape='circle' coords='22,80,14' alt='right-index' href='#' onClick={() => {log.info('6 clikced');onSelectFinger(6);}} />
                <area shape='circle' coords='21,121,21' alt='right-thumb' href='#' onClick={() => {log.info('5 clikced');onSelectFinger(5)}} />
              </map>
            </div>
          </div>
          <div className={classNames(style.imagePanel, style.alignLeft)}>
            <div className={classNames(style.handCanvas, style.leftHandCanvas)}>
              {!isReviewed &&
              <img
                src='/static/images/refit/left-pedi-glow.gif'
                style={{position: 'absolute', left: -104, top: 4, height: 151}}
                alt='anim' />
              }
              {
                toenailImageSrcList.slice(0, 5).map((item, index) => (
                  (!!state[`f${index}BaseWidth`] || !!state[`f${index}TipWidth`]) &&
                  <img src={item.path}
                    key={index + 10}
                    alt='finger-nail'
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: item.x,
                      top: item.y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => onSelectFinger(index)} />
                ))
              }
              <img
                src='/static/images/refit/left-foot-width.svg'
                style={{
                  position: 'absolute',
                  zIndex: 9,
                  left: -100,
                  top: 0,
                }}
                width='300'
                height='159'
                useMap='#leftmap'
                alt='some-left' />
              <map name='leftmap'>
                <area shape='circle' coords='203,15,16' alt='left-pinky' href='#' onClick={() => {log.info('0 clikced');onSelectFinger(0);}} />
                <area shape='circle' coords='239,38,14' alt='left-ring' href='#' onClick={() => {log.info('1 clikced');onSelectFinger(1)}} />
                <area shape='circle' coords='252,52,14' alt='left-middle' href='#' onClick={() => {log.info('2 clikced');onSelectFinger(2);}} />
                <area shape='circle' coords='277,79,13' alt='left-index' href='#' onClick={() => {log.info('3 clikced'); onSelectFinger(3);}} />
                <area shape='circle' coords='273,121,21' alt='left-thumb' href='#' onClick={() => {log.info('4 clikced');onSelectFinger(4);}} />
              </map>
            </div>
          </div>
        </div>
        <div className={style.buttonLine}>
          <DarkButton
            disabled={!isReviewed}
            passedClass={style.actionButton}
            onClick={onConfirm}>
            CONFIRM WIDTH ADJUSTMENT
          </DarkButton>
        </div>
        {selectedIndex >= 0 &&
        <DialogWrapper onClose={onClose}>
          <AdjustWidthDialog
            state={state}
            setState={setState}
            selectedIndex={selectedIndex}
            onClose={onClose}/>
        </DialogWrapper>
        }
      </div>
    </>
  );
};

export default RefitPediLengthSelect;
