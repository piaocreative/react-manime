import React from 'react';
import Router from 'next/router';
import { DarkButton } from '../basic/buttons';
import { pageLinks } from '../../utils/links';
import style from '../../static/components/landing/landing-glamorous-section.module.css';

class LandingIntroSection extends React.Component <any, any>{
  clickHandler = () => {
    this.props.trackFunnelActionProjectFunnel('A. Landing Page - Check Out Designs');
    Router.push(pageLinks.SetupDesign.url);
  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.imagePanel} />
        <div className={style.textPanel}>
          <div className={style.title}>
            GLAMOROUS <br /> DESIGNER NAILS
          </div>
          <div className={style.description}>
            We created a platform for your favorite designers to share their nail art with the world. That famous artist living 9,000 miles away? Yup, you can wear their designs.
          </div>
          <DarkButton passedClass={style.actionButton} onClick={this.clickHandler}>CHECK OUT DESIGNS</DarkButton>
        </div>
      </div>
    );
  }
}

export default LandingIntroSection;
