import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { PrimaryButton } from '../basic/buttons';
import { pageLinks } from '../../utils/links';
import style from '../../static/components/landing/landing-mani-thanks.module.css';

const bubbleImgSrc = '../../static/icons/whitebubble.svg';

class LandingManiThanksDialog extends Component<any, any> {

  navToShopHandler = () => {
    Router.push(pageLinks.SetupDesign.url);
  }

  render () {
    const { onClose } = this.props;
    return (
      <Fragment>
        <div className={style.container}>
          <div className={style.content}
            // onClick={ev => {ev.stopPropagation()}}
          >
              <div className={style.title}>
                MANI THANKS TO <span className={style.titleSubfix}>YOU!</span>
              </div>
              <div className={style.description}>
                Free Mighty Hand Cream <br /> with any order
              </div>
              <PrimaryButton
                isSmall
                onClick={this.navToShopHandler}>
                SHOP HERE
              </PrimaryButton>
              <div
                className={style.closeButton}
                onClick={onClose}>
                ×
              </div>
          </div>
        </div>
        <div
          className={style.overlay}
          onClick={onClose} />
      </Fragment>
    );
  }
}

export default LandingManiThanksDialog;