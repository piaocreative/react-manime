import React from 'react';
import classNames from 'classnames';
import { PrimaryButton } from '../basic/buttons';

import style from '../../static/components/cart/redeem-manimoney.module.css';

const RedeemManiMoney = ({ isAuth, redeemed=undefined, credits, toggleRedeem=undefined, text='REDEEM', hideButton }) => {
  const creditValue = parseFloat(credits || 0);
  const isHidden = !redeemed && creditValue <= 0;

  return (
    <div>
      {isAuth ? 
        <div className={classNames(style.redeemLine)}>
          <img src='/static/icons/dollar-bubble.svg' alt='dollar' className={style.dollarIcon} />
          <div className={style.creditLabel}>
            {redeemed ?
              <span className={style.creditsText}>Your ManiMoney has successfully redeemed.</span>:
              <span className={style.creditsText}>Redeem your ${credits.toFixed(2)} of ManiMoney {hideButton && `at checkout`}</span>
            }
          </div>
          {!(hideButton || isHidden) &&
          <PrimaryButton passedClass={style.redeemButton} onClick={toggleRedeem}>
            {text}
          </PrimaryButton>
          }
        </div>
        : <p className={style.redeemDuringCheckout}>Redeem your ManiMoney during checkout</p>
      }
    </div>
  );
};

export default RedeemManiMoney;
