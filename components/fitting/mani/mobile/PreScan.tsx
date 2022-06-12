import React from 'react';
import {useRouter} from 'next/router';
import { OutlinedDarkButton, DarkButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import style from '@styles/fitting/mani/mobile/prescan.module.css';

const PreScan = ({ nextButton}) => {
  const router = useRouter();
  const moveToShopHandler = () => {
    if (router.query.returnUrl) {
      router.push(router.query.returnUrl as string);
    } else {
      router.push(pageLinks.SetupDesign.url);
    }
  };

  const required = router.query?.required  === 'true';

  return (
    <div className={style.container}>
      <div className={style.contentContainer}>
        <div className={style.titleContainer}>
          LET’S GET <br /> CUSTOMIZED!
        </div>

        <img
          className={style.fingerImage}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/prescan-poor-fit.svg?v=1602855395'
          alt='pre-scan' />

        <div className={style.subTitle}>
          Your nail size is unique.
        </div>
        <div className={style.description}>
          You’re 5 photos away from gels made just for you. It will take 2 minutes.
          We will 3D model your nails.
        </div>
        <div className={style.buttonLine}>
          <DarkButton
            onClick={nextButton}>
            LET’S GET STARTED
          </DarkButton>
          {(!required) &&
            <OutlinedDarkButton
              onClick={moveToShopHandler}>
              MAYBE LATER
            </OutlinedDarkButton>
          }
        </div>
      </div>
    </div>
  );
}

export default PreScan;