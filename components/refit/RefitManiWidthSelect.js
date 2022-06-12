import React, { useState } from 'react';
import classNames from 'classnames';
import { DarkButton, WhiteButton } from '../basic/buttons';
import DialogWrapper from '../basic/dialog';
import AdjustWidthDialog from './parts/AdjustWidthDialog';
import RefitHeader from './parts/RefitHeader';

import { nailImageSrcList } from '../../constants';

import style from '../../static/components/refit/refit-mani-width-select.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';
import log from '../../utils/logging'
const RefitManiWidthSelect = ({ state, setState, onBack, onConfirm }) => {

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
        title={'MANI FIT IMPROVEMENT'}
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
            <div className={style.handCanvas}>
              {!isReviewed &&
                <img
                  src='/static/icons/feedback/left-hand-850.gif'
                  style={{position: 'absolute', right: 0, top: 0, width: 211, height: 162, transform: 'scaleX(-1)'}}
                  alt='anim' />
              }
              {
                nailImageSrcList.slice(5, 10).map((item, index) => (
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
                src='/static/images/refit/right-hand-width.svg'
                style={{
                  position: 'absolute',
                  zIndex: 9,
                  right: -46,
                  top: 0,
                }}
                width='251'
                height='159'
                useMap='#rightmap'
                alt='some-right' />
              <map name='rightmap'>
                <area shape='circle' coords='64,22,16' alt='right-pinky' href='#' onClick={() => {log.info('9 clikced');onSelectFinger(9);}} />
                <area shape='circle' coords='30,48,16' alt='right-ring' href='#' onClick={() => {log.info('8 clikced');onSelectFinger(8);}} />
                <area shape='circle' coords='12,74,16' alt='right-middle' href='#' onClick={() => {log.info('7 clikced');onSelectFinger(7);}} />
                <area shape='circle' coords='25,103,16' alt='right-index' href='#' onClick={() => {log.info('6 clikced');onSelectFinger(6);}} />
                <area shape='circle' coords='91,150,16' alt='right-thumb' href='#' onClick={() => {log.info('5 clikced');onSelectFinger(5)}} />
              </map>
            </div>
          </div>
          <div className={classNames(style.imagePanel, style.alignLeft)}>
            <div className={style.handCanvas}>
              {!isReviewed &&
                <img
                  src='/static/icons/feedback/left-hand-850.gif'
                  style={{position: 'absolute', left: 0, top: 0, width: 208, height: 163}}
                  alt='anim' />
              }
              {
                nailImageSrcList.slice(0, 5).map((item, index) => (
                  (!!state[`f${index}BaseWidth`] || !!state[`f${index}TipWidth`]) &&
                  <img src={item.path}
                    key={index + 10}
                    alt='finger-nail'
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: item.x + 2,
                      top: item.y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => onSelectFinger(index)} />
                ))
              }
              <img
                src='/static/images/refit/left-hand-width.svg'
                style={{
                  position: 'absolute',
                  zIndex: 9,
                  left: -46,
                  top: 0,
                }}
                width='251'
                height='159'
                useMap='#leftmap'
                alt='some-left' />
              <map name='leftmap'>
                <area shape='circle' coords='182,22,16' alt='left-pinky' href='#' onClick={() => {log.info('0 clikced');onSelectFinger(0);}} />
                <area shape='circle' coords='212,48,16' alt='left-ring' href='#' onClick={() => {log.info('1 clikced');onSelectFinger(1)}} />
                <area shape='circle' coords='233,74,16' alt='left-middle' href='#' onClick={() => {log.info('2 clikced');onSelectFinger(2);}} />
                <area shape='circle' coords='211,105,16' alt='left-index' href='#' onClick={() => {log.info('3 clikced'); onSelectFinger(3);}} />
                <area shape='circle' coords='155,149,16' alt='left-thumb' href='#' onClick={() => {log.info('4 clikced');onSelectFinger(4);}} />
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

export default RefitManiWidthSelect;
