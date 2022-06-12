import { builder, BuilderComponent } from '@builder.io/react';
import Link from 'next/link';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SET_KEY_VALUE,  } from 'actions';
import { SetCart } from 'actions/cart'

import { updateUserColumn } from 'api/user';

import { PrimaryButton } from 'components/basic/buttons';
import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';

import constants from 'constants/index';

import { BUILDER_API_KEY } from 'lib/builder';

import checkMobile from 'utils/checkMobile';
import { pageLinks } from 'utils/links';
import log from 'utils/logging'
import { trackFunnelActionProjectFunnel, trackCheckout } from 'utils/track';
import toggleLoading from 'utils/toggleLoading';

import style from 'static/components/setup/congratulation.module.css';

builder.init(BUILDER_API_KEY)
 
const nextIcon1 = '../../static/icons/next1.svg';
const nextIcon2 = '../../static/icons/next2.svg';
const nextIcon3 = '../../static/icons/next3.svg';
const whiteBubble ='../../static/icons/whitebubble.svg';
const applyManiImage = '../../static/icons/howto-uniquenail.svg'

class ConfirmationPage extends Component <any, any>{
  componentDidMount() {    
    const defaultCheckout = {
      id: undefined
    };

    if (window['dataLayer']) {
      window['dataLayer'].push({ event: 'purchaseComplete' });
    }

    const checkout = this.props.mainCartData?.cart
    toggleLoading(false);
    trackCheckout("[confirmation]")
    trackFunnelActionProjectFunnel('Purchase Complete', {checkout, isMobile: checkMobile()});

    updateUserColumn(this.props.userData.identityId, 'checkoutId', '');
    this.props.dispatchSetKeyValue('checkoutId', '');
    this.props.dispatchSetKeyValue('checkout', null);
    this.props.dispatchSetCheckout(defaultCheckout);

  }

  watchHandler = () => {
    window.open('https://www.youtube.com/channel/UCM22Scfu3vD784GPIltaTXw', '_blank');
  }

  checkMobile = () => {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) return true;
    return false;
  }

  render () {
    const topHeader = (
      <div className={style.topHeader}>
        THANK YOU! <div className={style.onlyMobile} /> YOUR ORDER HAS BEEN CONFIRMED
      </div>
    );

    const section1 = (
      <div className={style.section1}>
        <div className={style.bubbleBack}>
          <img className={style.whiteBubble} src={whiteBubble} alt='back' />
          <div className={style.bubbleText}>
            <div>WHAT</div>
            <div>COMES</div>
            <div>NEXT?</div>
          </div>
        </div>
        <div className={style.itemContainer}>
          <div className={style.lineWithImage}>
            <div className={style.line} />
            <img className={style.circleImage} src={nextIcon1} alt='take-photo' />
          </div>
          <div className={style.description}>
            We use the photos you took to create a 3D model of your nails.
          </div>
        </div>
        <div className={style.itemContainer}>
          <div className={style.lineWithImage}>
            <div className={style.line} />
            <img className={style.circleImage} src={nextIcon2} alt='take-photo' />
          </div>
          <div className={style.description}>
            Our fancy laser cuts your gels to fit your unique nails.
          </div>
        </div>
        <div className={style.itemContainer}>
          <div className={style.lineWithImage}>
            <div className={style.line} />
            <img className={style.circleImage} src={nextIcon3} alt='take-photo' />
          </div>
          <div className={style.description}>
            Shipping: 4-7 business days.
          </div>
        </div>
      </div>
    );

    const section2 = (
      <div className={style.section2}>
        <div className={style.sectionTitle2}>APPLYING YOUR MANI</div>
        <div className={style.halfLeft}>
          <img src={applyManiImage} alt='applying-mani' />
        </div>
        <div className={style.halfRight}>
          <div>
            <div className={style.oneLine}>
              <div className={style.numbering}>1</div>
              <div className={style.note}>Peel from the top.</div>
            </div>
            <div className={style.oneLine}>
              <div className={style.numbering}>2</div>
              <div className={style.note}>Press down from the <br />bottom to the top.</div>
            </div>
            <div className={style.oneLine}>
              <div className={style.numbering}>3</div>
              <div className={style.note}>File the excess.</div>
            </div>
          </div>
        </div>
      </div>
    );
    
    const url = pageLinks.pageLinks 
      ? pageLinks.pageLinks.Profile.Orders.url
      : pageLinks.Profile.Orders.url;

    const section4 = (
      <div className={style.section4}>
        We custom-make your mani - if your fit isn’t quite right, we will happily adjust it! <br />
        Review your fit on your
        <Link href={url}>
          <a className={style.accountPageLink}>account page</a>
        </Link>
        or reach out to <a className={style.emailLink} target="_blank" href="mailto:care@manime.co">care@manime.co</a>
      </div>
    );

    const section3 = (
      <div className={style.section3}>
        <div className={style.sectionTitle3}>CHECK HOW TO APPLY MANIME</div>
        <PrimaryButton onClick={this.watchHandler}>WATCH OUR HOW TO VIDEOS</PrimaryButton>
      </div>
    );

    return (
      
      <div>
        {topHeader}
        <BuilderComponent model="page" content={JSON.parse(this.props.builderPage)} />
        {section1}
        {section2}
        {section4}
        {section3}
      </div>        
      

    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps, 
  userData: state.userData
});

const mapDispatchToProps = dispatch => ({
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
  dispatchSetCheckout: checkout => dispatch(SetCart(checkout)),
});

const _Confirmation = ManimeStandardContainer(connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationPage));

export const getStaticProps = async ({ res, req }) => {

  const builderPage = await builder.get('page', { 
    req, res, url: '/setup/confirmation' 
  });

  const globalProps = await getGlobalProps({ 
    propsToMerge: { 
      builderPage: JSON.stringify(builderPage) 
    }
  });

  return globalProps;
}

export default _Confirmation
