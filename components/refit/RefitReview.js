import React, { useState } from 'react';
import classNames from 'classnames';

import RefitHeader from './parts/RefitHeader';
import DialogWrapper from '../basic/dialog';
import AdjustLengthDialog from './parts/AdjustLengthDialog';
import AdjustWidthDialog from './parts/AdjustWidthDialog';
import { DarkButton } from '../basic/buttons';

import style from '../../static/components/refit/refit-review.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const iconList = [
  { // 5
    name: 'Thumb',
    imgPath: '/static/images/refit/refit-right-thumb.svg',
    imgPediPath: '/static/images/refit/refit-right-thumb-pedi.svg',
  },
  { // 6
    name: 'Index',
    imgPath: '/static/images/refit/refit-right-index.svg',
    imgPediPath: '/static/images/refit/refit-right-index-pedi.svg',
  },
  { // 7
    name: 'Middle',
    imgPath: '/static/images/refit/refit-right-middle.svg',
    imgPediPath: '/static/images/refit/refit-right-middle-pedi.svg',
  },
  { // 8
    name: 'Ring',
    imgPath: '/static/images/refit/refit-right-ring.svg',
    imgPediPath: '/static/images/refit/refit-right-ring-pedi.svg',
  },
  { // 9
    name: 'Pinky',
    imgPath: '/static/images/refit/refit-right-pinky.svg',
    imgPediPath: '/static/images/refit/refit-right-pinky-pedi.svg',
  },
];

const RefitManiReview = ({
  state,
  setState,
  onBack,
  onDone,
  isLoading
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [lengthSelected, setLengthSelected] = useState(true);

  const editLengthHandler = index => () => {
    setSelectedIndex(index);
    setLengthSelected(true);
  };

  const editWidthHandler = index => () => {
    setSelectedIndex(index);
    setLengthSelected(false);
  }

  const onClose = () => {
    setSelectedIndex(-1);
  };

  const isManis = state.profileType === 'Manis';

  return (
    <>
      <RefitHeader
        title={isManis ? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'}
        onBack={onBack} />
      <div className={style.container}>
        <div className={classNames(commonStyle.title, style.titleMargin)}>
          AWESOME, DOES <br />
          THIS LOOK RIGHT?
        </div>


        <div className={style.titleLine}>
          <span>
            {isManis ?
              'LEFT HAND RESIZE':
              'LEFT FOOT RESIZE'
            }
          </span>
        </div>
        <div className={style.fingersLine}>
          {Array.from(Array(5).keys()).reverse().map(index => (
            <div key={index} className={style.oneColumn}>
              <div className={style.whitePanel}>
                <img
                  className={classNames(style.fingerIcon, style.leftHand)}
                  src={isManis ? iconList[4 - index].imgPath: iconList[4 - index].imgPediPath}
                  alt='finger-nail' />
                <div className={style.nailName}>{`L ${iconList[4 - index].name}`}</div>
              </div>
              <div className={style.reviewLine}>
                <div className={classNames(style.oneItem, !state[`f${index}Length`] && style.blur)}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index}Length`] ? '=': state[`f${index}Length`] > 0 ? '+': '‒'}
                  </div>
                  Length
                </div>
                <div className={style.editButton} onClick={editLengthHandler(index)}>
                  edit
                </div>
              </div>
              <div className={style.reviewLine}>
                <div className={classNames(style.oneItem, !state[`f${index}TipWidth`] && style.blur)}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index}TipWidth`] ? '=': state[`f${index}TipWidth`] > 0 ? '+': '‒'}
                  </div>
                  Tip width
                </div>
                <div className={classNames(style.oneItem, !state[`f${index}BaseWidth`] && style.blur )}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index}BaseWidth`] ? '=': state[`f${index}BaseWidth`] > 0 ? '+': '‒'}
                  </div>
                  Base width
                </div>
                <div className={style.editButton} onClick={editWidthHandler(index)}>
                  edit
                </div>
              </div>
            </div>
          ))
          }
          </div>
        
        <div className={style.titleLine}>
          <span>
          {isManis ?
            'RIGHT HAND RESIZE':
            'RIGHT FOOT RESIZE'
          }
          </span>
        </div>
        <div className={style.fingersLine}>
        {Array.from(Array(5).keys()).map(index => (
          <>
            <div key={index} className={style.oneColumn}>
              <div className={style.whitePanel}>
                <img
                  className={style.fingerIcon}
                  src={isManis ? iconList[index].imgPath: iconList[index].imgPediPath}
                  alt='finger-nail' />
                <div className={style.nailName}>{`R ${iconList[index].name}`}</div>
              </div>
              <div className={style.reviewLine}>
                <div className={classNames(style.oneItem, !state[`f${index + 5}Length`] && style.blur)}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index + 5}Length`]? '=': state[`f${index + 5}Length`] > 0 ? '+': '‒'}
                  </div>
                  Length
                </div>
                <div className={style.editButton} onClick={editLengthHandler(index + 5)}>
                  edit
                </div>
              </div>
              <div className={style.reviewLine}>
                <div className={classNames(style.oneItem, !state[`f${index + 5}TipWidth`] && style.blur)}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index + 5}TipWidth`]? '=': state[`f${index + 5}TipWidth`] > 0 ? '+': '‒'}
                  </div>
                  Tip width
                </div>
                <div className={classNames(style.oneItem, !state[`f${index + 5}BaseWidth`] && style.blur)}>
                  <div className={style.reviewCircle}>
                    {!state[`f${index + 5}BaseWidth`] ? '=': state[`f${index + 5}BaseWidth`] > 0 ? '+': '‒'}
                  </div>
                  Base width
                </div>
                <div className={style.editButton} onClick={editWidthHandler(index + 5)}>
                  edit
                </div>
              </div>
            </div>
          </>
        ))
        }
        </div>

        <div className={style.buttonLine}>
          <DarkButton
            disabled={isLoading}
            passedClass={style.actionButton}
            onClick={onDone}>
            DONE
          </DarkButton>
        </div>
      </div>
      {selectedIndex >= 0 &&
        <DialogWrapper onClose={onClose}>
        {lengthSelected ?
          <AdjustLengthDialog
            state={state}
            setState={setState}
            selectedIndex={selectedIndex}
            onClose={onClose}/>:
          <AdjustWidthDialog
            state={state}
            setState={setState}
            selectedIndex={selectedIndex}
            onClose={onClose}/>
        }
        </DialogWrapper>
        }
    </>
  );
};

export default RefitManiReview;
