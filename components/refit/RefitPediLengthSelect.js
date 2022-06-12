import React, { useState } from 'react';
import classNames from 'classnames';
import { DarkButton, WhiteButton } from '../basic/buttons';
import DialogWrapper from '../basic/dialog';
import AdjustLengthDialog from './parts/AdjustLengthDialog';

import RefitHeader from './parts/RefitHeader';
import { toenailImageSrcList } from '../../constants';

import style from '../../static/components/refit/refit-mani-length-select.module.css';
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

  const isReviewed = [...Array(10).keys()].find(index => state[`f${index}Length`]) >= 0;

  return (
    <>
      <RefitHeader
        title={'PEDI FIT IMPROVEMENT'}
        showLengthLogo
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
                src='/static/images/refit/left-pedi-glow.gif'
                style={{position: 'absolute', right: -104, top: 4, height: 151, transform: 'scaleX(-1)'}}
                alt='anim' />
              }
              {
                toenailImageSrcList.slice(5, 10).map((item, index) => (
                  (!!state[`f${5 + index}Length`]) &&
                  <img src={item.path}
                    key={index}
                    alt='toe-nail'
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
                src='/static/images/refit/right-foot.svg'
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
                <area shape='circle' coords='82,15,16' alt='right-pinky' href='#' onClick={() => {log.info('9 clikced');onSelectFinger(9);}} />
                <area shape='circle' coords='53,32,16' alt='right-ring' href='#' onClick={() => {log.info('8 clikced');onSelectFinger(8);}} />
                <area shape='circle' coords='36,52,16' alt='right-middle' href='#' onClick={() => {log.info('7 clikced');onSelectFinger(7);}} />
                <area shape='circle' coords='22,74,16' alt='right-index' href='#' onClick={() => {log.info('6 clikced');onSelectFinger(6);}} />
                <area shape='circle' coords='21,115,24' alt='right-thumb' href='#' onClick={() => {log.info('5 clikced');onSelectFinger(5)}} />
              </map>
            </div>
          </div>
          <div className={classNames(style.imagePanel, style.alignLeft)}>
            <div className={style.handCanvas}>
              {!isReviewed &&
              <img
                src='/static/images/refit/left-pedi-glow.gif'
                style={{position: 'absolute', left: -104, top: 4, height: 151}}
                alt='anim' />
              }
              {
                toenailImageSrcList.slice(0, 5).map((item, index) => (
                  (!!state[`f${index}Length`]) &&
                  <img src={item.path}
                    key={index + 10}
                    alt='toe-nail'
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: item.x,
                      top: item.y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      // visibility: reviewedFingerList[index] ? 'visible' : 'hidden'
                    }}
                    onClick={() => onSelectFinger(index)} />
                ))
              }  
              <img
                src='/static/images/refit/left-foot.svg'
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
                <area shape='circle' coords='236,36,16' alt='left-ring' href='#' onClick={() => {log.info('1 clikced');onSelectFinger(1)}} />
                <area shape='circle' coords='258,60,14' alt='left-middle' href='#' onClick={() => {log.info('2 clikced');onSelectFinger(2);}} />
                <area shape='circle' coords='265,74,16' alt='left-index' href='#' onClick={() => {log.info('3 clikced'); onSelectFinger(3);}} />
                <area shape='circle' coords='265,115,24' alt='left-thumb' href='#' onClick={() => {log.info('4 clikced');onSelectFinger(4);}} />
              </map>
            </div>
          </div>
        </div>
        <div className={style.buttonLine}>
          <DarkButton
            disabled={!isReviewed}
            passedClass={style.actionButton}
            onClick={onConfirm}>
            CONFIRM LENGTH ADJUSTMENT
          </DarkButton>
        </div>
        {selectedIndex >= 0 &&
          <DialogWrapper onClose={onClose}>
            <AdjustLengthDialog
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
