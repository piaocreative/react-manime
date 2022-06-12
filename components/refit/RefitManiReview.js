import React from 'react';
import classNames from 'classnames';

import RefitHeader from './parts/RefitHeader';
import { DarkButton, OutlinedDarkButton } from '../basic/buttons';

import style from '../../static/components/refit/refit-mani-review.module.css';
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
  onEdit,
  onBack,
  onDone,
  isLoading
}) => {
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

        <div className={commonStyle.boldLabel}>
          {isManis ?
            'RIGHT HAND':
            'RIGHT FOOT'
          }
        </div>
        <div className={style.fingersLine}>
        {Array.from(Array(5).keys()).map(index => (
          <div key={index + 5} className={style.oneColumn}>
            <div className={style.whitePanel}>
              <img
                className={style.fingerIcon}
                src={isManis ? iconList[index].imgPath: iconList[index].imgPediPath}
                alt='finger-nail' />
              <div className={style.nailName}>{iconList[index].name}</div>
            </div>
            <OutlinedDarkButton passedClass={style.editButton} onClick={onEdit}>
              Edit
            </OutlinedDarkButton>
            {!!state[`f${index + 5}Length`] &&
              <div className={style.oneItem}>
                {state[`f${index + 5}Length`] < 0 ?
                  'shorter': 'longer' }
              </div>
            }
            {!!state[`f${index + 5}TipWidth`] &&
              <div className={style.oneItem}>
                {state[`f${index + 5}TipWidth`] < 0 ?
                  '- tip width': '+ tip width'
                }
              </div>
            }
            {!!state[`f${index + 5}BaseWidth`] &&
              <div className={style.oneItem}>
                {state[`f${index + 5}BaseWidth`] < 0 ?
                  '- base width': '+ base width'
                }
              </div>
            }
          </div>
        ))
        }
        </div>

        <div className={commonStyle.boldLabel}>
          {isManis ?
            'LEFT HAND':
            'LEFT FOOT'
          }
        </div>
        <div className={style.fingersLine}>
          {Array.from(Array(5).keys()).map(index => (
            <div key={index} className={style.oneColumn}>
              <div className={style.whitePanel}>
                <img
                  className={classNames(style.fingerIcon, style.leftHand)}
                  src={isManis ? iconList[4 - index].imgPath: iconList[4 - index].imgPediPath}
                  alt='finger-nail' />
                <div>{iconList[4 - index].name}</div>
              </div>
              <OutlinedDarkButton
                passedClass={style.editButton}
                onClick={onEdit}>
                Edit
              </OutlinedDarkButton>
              {!!state[`f${index}Length`] &&
                <div className={style.oneItem}>
                  {state[`f${index}Length`] < 0 ?
                    'shorter': 'longer' }
                </div>
              }
              {!!state[`f${index}TipWidth`] &&
                <div className={style.oneItem}>
                  {state[`f${index}TipWidth`] < 0 ?
                    '- tip width': '+ tip width'
                  }
                </div>
              }
              {!!state[`f${index}BaseWidth`] &&
                <div className={style.oneItem}>
                  {state[`f${index}BaseWidth`] < 0 ?
                    '- base width': '+ base width'
                  }
                </div>
              }
            </div>
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

    </>
  );
};

export default RefitManiReview;
