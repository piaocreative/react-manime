import React from 'react';
import classNames from 'classnames';
import { DarkButton } from '../basic/buttons';

import BubbleRating from './parts/BubbleRating';
import RefitHeader from './parts/RefitHeader';

import style from '../../static/components/refit/refit-start-mani.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const RefitManiStart = ({ state, setState, onBack, onNext }) => {

  const changeRatingHandler = value => {
    setState(prevState => ({...prevState, responseOverallRating: value}));
  };

  const isManis = state.profileType === 'Manis';

  return (
    <>
      <RefitHeader
        title={isManis ? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'} />
      <div className={style.container}>
        <div className={commonStyle.title}>
          YOUR FEEDBACK WILL <br />HELP US IMPROVE YOUR<br /> NAIL 3D MODEL
        </div>

        {/* <div className={style.fingerImage} /> */}
        <img
          className={style.fingerImage}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/refit-all.gif?v=1597584550' />

        <div className={classNames(commonStyle.description, style.fitQuestion)}>RATE YOUR FIT</div>
        <div className={commonStyle.description}>Use drops to rate.</div>
        <BubbleRating
          ratingValue={state.responseOverallRating || 0}
          onChange={changeRatingHandler}
          />
        <div className={classNames(style.ratingLabel, state.responseOverallRating && style.visible)}>
        {state.responseOverallRating ? (
          state.responseOverallRating <= 1 ?
          <><br />Oh no! Let’s fix it right now.</> :
        state.responseOverallRating <= 3 ?
          <><br />It should definitely fit you better, let’s fix it!</> :
        state.responseOverallRating <= 4 ?
          <><br />Need a small improvement? We can fix that!</>:
        state.responseOverallRating >= 5 ?
          (<>Awesome! <br />All your future orders will include this same fit. <br />You can change it anytime in your ManiMe Account.</>):
          (<>Awesome! <br />Let us know if there’s anything we can improve.</>)
        ):
          <><br />Use drops to rate your fit.</>
        }
          
        </div>
        <div className={style.buttonLine}>
          <DarkButton
            passedClass={style.actionButton}
            disabled={!state.responseOverallRating}
            onClick={onNext}>
            {state.responseOverallRating === 5 ?
              'Submit Fit Rating':
              'Start Resizing'
            }
          </DarkButton>
        </div>
      </div>
    </>
  );
};

export default RefitManiStart;
