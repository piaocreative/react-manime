import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import {trackCheckout} from '../../../../utils/track'
import { DarkButton, WhiteButton } from '../../../basic/buttons';
import LoadingAnimation from '../../../LoadingAnimation';
import fingerText from '../fingerInfo';
import { pageLinks } from '../../../../utils/links';
import style from '../../../../static/components/fitting/mani/mobile/validation.module.css';
import log from '../../../../utils/logging'

const Validation = ({ images, onGoFinger }) => {
  if (images.findIndex(img => img === '') >=0 ) {
    log.info('render loading on validation');
    
    return (
      <div style={{height: 'calc(100vh - 100px)'}}>
        <LoadingAnimation isLoading={true} background='transparent' />
      </div>
    );
  }

  const submitHandler = () => {
    const { hasPedis, transitionTrigger } = Router.router.query;
    trackCheckout("[scanComplete]", {type: "mani"})
    if (Router.router.query.returnUrl) {
      Router.push(Router.router.query.returnUrl as string);
    } else if (transitionTrigger !== 'checkout' || hasPedis === 'true') {
      onGoFinger(6)();
    } else {
      Router.push(pageLinks.Checkout.url);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.mainTitle}>LET'S GET MODELING!</div>
      <div className={style.mainDescription}>
        Double-check your fit photos - with card and fingers visible - then hit submit! Your 3D modeled gels await!
      </div>
      {images.map((img, index) => (
        <div key={index} className={style.oneItem}>
          <img className={style.nailStyle} src={img} alt='nail' />
          <div className={style.fingerTitle}>{fingerText[index].title}</div>
          <WhiteButton isSmall passedClass={style.retakeButton} onClick={onGoFinger(index)}>
            RETAKE
          </WhiteButton>
        </div>
      ))
      }
      <DarkButton passedClass={style.submitButton} onClick={submitHandler}>
        SUBMIT MANI SCAN
      </DarkButton>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

const _Validation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Validation);

export default _Validation;