import React from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { DarkButton } from '../basic/buttons';
import style from '../../static/components/landing/landing-onthego.module.css';
import buttonStyle from '../../static/components/landing/landing.module.css';
import { pageLinks } from '../../utils/links';

const LandingOnTheGoSection = () => {
  const navToGalleryHandler = () => {
    Router.push(pageLinks.SetupDesign.url);
  };

  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <div className={style.title}>
          STICK ON GELS <br /> ON-THE-GO
        </div>
        <div className={style.description}>
          Beautiful nails without spending <br /> precious time at the salon? (Previously) unheard of. <br /><br />
          Now, whether you’re home or on-the-go, getting a mani has never been faster or more convenient.
        </div>
        <Link href={pageLinks.SetupDesign.url}>
          <a>
            <DarkButton
              passedClass={buttonStyle.getSetButton}>
              SEE HOW IT LOOKS
            </DarkButton>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default LandingOnTheGoSection;
