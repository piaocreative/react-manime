import { builder, BuilderComponent } from '@builder.io/react';
import React from 'react';
import Router from 'next/router';
import RefitHeader from './parts/RefitHeader';
import { DarkButton, OutlinedDarkButton } from '../basic/buttons';
import { pageLinks } from '../../utils/links';

import style from '../../static/components/refit/refit-confirm.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const RefitConfirm = ({ state, onBack, onSwitchType, builderContent }) => {
  const isManis = state.profileType === 'Manis';
  const addedCredits = state.addedCredits;

  const moveToShop = () => {
    Router.push(pageLinks.SetupDesign.url);
  };

  return (
    <>
      <RefitHeader
        title={isManis? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'}
      />
      <BuilderComponent model="page" content={builderContent} />
      <div className={style.container}>
        <div className={commonStyle.title}>
          THANKS FOR RATING <br /> YOUR {isManis? 'MANI': 'PEDI'} FIT <br />
        </div>
        <div className={commonStyle.description}>
          {addedCredits !== 5 && 
            <>With your feedback, your fit will be improved! <br /> <br /></>
          }
          {addedCredits ?
            <>
              You just got <span style={{fontFamily: 'avenirHeavy'}}>${addedCredits} of ManiMoney</span> added to <br />
              your account. You can now order and try <br />
              your improved fit.
            </>:
            <>
              You can already order again and try your improved fit.
            </>
          }

        </div>
        {isManis?
          <video width="100%" autoPlay loop muted playsInline
            className={style.productImg}>
            <source
              className={style.productImg}
              src='https://d1b527uqd0dzcu.cloudfront.net/web/videos/refit-confirmation.mp4' type="video/mp4"/>
            Your browser does not support the video tag.
          </video>:
          <img
            className={style.productImg}
            src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/pedi-refit-confirmation.svg?v=1608211356'
            alt='pedi-confirm' />
        }

        {/* <div className={commonStyle.description}>On your next order we will <br /> adjust your fit.</div> */}
        {addedCredits && !(Router.router.query.profileType)?
          <OutlinedDarkButton
            passedClass={style.outlinedButton}
            onClick={onSwitchType}>
            {isManis ?
              'NEED TO REFIT MY PEDI TOO':
              'NEED TO REFIT MY MANI TOO'
            }
          </OutlinedDarkButton>
          : null
        }
        <div className={style.whitePanel}>
          <div className={style.grayPanel}>
            <div className={commonStyle.description}>
              Questions? Reach out to our care team
            </div>

            <div className={style.oneLine}>
              <div>
                <svg width="14.326" height="14.327" viewBox="0 0 14.326 14.327" style={{marginRight: '16px'}}>
                  <g transform="translate(14.077 0.25) rotate(90)">
                    <path d="M.65,6.5a.65.65,0,1,1,.65-.651A.651.651,0,0,1,.65,6.5Zm0-2.6a.651.651,0,1,1,.65-.652A.652.652,0,0,1,.65,3.9Zm0-2.6A.651.651,0,1,1,1.3.652.651.651,0,0,1,.65,1.3Z" transform="translate(6.259 3.656)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                    <path d="M0,6.658a6.661,6.661,0,0,0,9.974,5.776l2.664.858a.52.52,0,0,0,.654-.656l-.858-2.664A6.659,6.659,0,1,0,0,6.658Z" transform="translate(0.25 0.251)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                  </g>
                </svg>
                (213) 340 - 0364
              </div>
              <a className={style.emailStyle} href={'mailto:care@manime.co'}>
                <svg width="14.648" height="11.762" viewBox="0 0 14.648 11.762" style={{marginRight: '12px'}}>
                  <g transform="translate(14.439 0.2) rotate(90)">
                    <path d="M0,.684v12.28a.693.693,0,0,0,.7.684h9.358a.693.693,0,0,0,.7-.684V.684a.693.693,0,0,0-.7-.684H.7A.693.693,0,0,0,0,.684Z" transform="translate(0.3 0.291)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                    <path d="M0,0,5.486,6.092a.734.734,0,0,1,0,.987L0,13.174" transform="translate(0.472 0.528)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                    <path d="M0,0,4.392,4.877" transform="translate(6.402 8.914)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                    <path d="M0,4.879,4.392,0" transform="translate(6.453 0.478)" fill="none" stroke="#2C4349" strokeMiterlimit="10" strokeWidth="1"/>
                  </g>
                </svg>
                {'care@manime.co'}
              </a>
            </div>

          </div>
        </div>
        <div className={style.buttonLine}>
          <DarkButton
            passedClass={style.actionButton}
            onClick={moveToShop}>
            EXPLORE OUR DESIGNS
          </DarkButton>
        </div>
      </div>

    </>
  );
};

export default RefitConfirm;
