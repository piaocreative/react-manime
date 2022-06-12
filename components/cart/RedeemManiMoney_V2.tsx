import React from 'react';
import classNames from 'classnames';
import { PrimaryButton } from '../basic/buttons';

import style from '../../static/components/cart/redeem-manimoney-v2.module.css';

const RedeemManiMoney = ({ isAuth, redeemed=undefined, credits, creditsToRedeem=0, toggleRedeem=undefined, text='Redeem', hideButton }) => {
  const creditValue = parseFloat(credits || 0);
  const isHidden = !redeemed && creditValue <= 0;

  return (
    <div>
      {isAuth ? 
        <div className={style.redeemLine}>
          <img src='/static/icons/orange-dollar-bubble.svg' alt='dollar' className={style.dollarIcon} />
          <div className={style.creditLabel}>
            {redeemed ?
              <span className={style.creditsText}>${creditsToRedeem.toFixed(2)} ManiMoney used</span> :
              <span className={style.creditsText}>Use ${credits.toFixed(2)} of ManiMoney {hideButton && `at checkout`}</span>
            }
          </div>
          {!(hideButton || isHidden) &&
          <div className={style.buttonWrapper}>
            <PrimaryButton passedClass={classNames(style.redeemButton, redeemed && style.undoButton)} onClick={toggleRedeem}>
              {text}
            </PrimaryButton>
          </div>
          }
        </div>
        : <p className={style.redeemDuringCheckout}>Redeem your ManiMoney during checkout</p>
      }
    </div>
  );
};

export default RedeemManiMoney;
