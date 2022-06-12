import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import {trackCheckout} from '../../../../utils/track'
import { DarkButton, WhiteButton } from '../../../basic/buttons';
import LoadingAnimation from '../../../LoadingAnimation';
import fingerText from '../fingerInfo';
import { pageLinks } from '../../../../utils/links';
import style from '../../../../static/components/fitting/mani/mobile/validation.module.css';

const Validation = ({ images, onGoFinger }) => {
  if (images.findIndex(img => img === '') >=0 ) {
    return (
      <div style={{height: 'calc(100vh - 100px)'}}>
        <LoadingAnimation isLoading={true} background='transparent' />
      </div>
    );
  }

  const submitHandler = () => {
    const { hasPedis, transitionTrigger } = Router.router.query;
    trackCheckout("[scanComplete]", {type: "pedi"})
    if (Router.router.query.returnUrl) {
      Router.push(Router.router.query.returnUrl as string);
    } else if (transitionTrigger === 'checkout' ) {
      Router.push(pageLinks.Checkout.url);
    } else if (transitionTrigger === 'redeem' ) {
      Router.push({
        pathname: pageLinks.GroupGiftRedeemShipping.url,
        query: {...Router.router.query}
      })
    } else {
      onGoFinger(6)();
  } 
  };
  


  return (
    <div className={style.container}>
      <div className={style.mainTitle}>LET'S GET MODELING!</div>
      <div className={style.mainDescription}>
        Double-check your fit photos - with card and toes visible - then hit submit! Your 3D modeled gels await!
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
        SUBMIT PEDI SCAN
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
