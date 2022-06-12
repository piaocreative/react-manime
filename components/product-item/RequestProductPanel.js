import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import { connect } from 'react-redux';
import { OutlinedDarkButton } from '../basic/buttons';
import ArrowIcon from '../icons/ArrowIcon2';
import style from '../../static/components/design/request-product-panel.module.css';
import { pageLinks } from '../../utils/links';
import { createWaitlistRequests } from 'api/product';

const prodIconPrefix = 'https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/';

const RequestProduct = ({ userData, productItemData, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState(userData?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('request-panel').className += ` ${style.move}`;
  }, [])

  const inputHandler = ev => {
    setEmail(ev.target.value);
  }
  
  const sendEmailHandler = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const { nailProductId, name: productName,  } = (productItemData || {});
      const userId = userData?.identityId || undefined;
      await createWaitlistRequests({nailProductId, productName, userId, email});
      setIsSuccess(true);
    } catch (err) {
      log.error(`[RequestProductPanel][sendEmailHandler] caught error ` + err, {err});
    }
    setLoading(false);
  };

  const moveToShop = () => {
    Router.push(pageLinks.SetupDesign.url);
  }

  return (
    <>
      <form className={style.container} onSubmit={sendEmailHandler} id='request-panel'>
          <img  
            className={style.archiveImage}
            src={productItemData.archivedImageUrl || `${prodIconPrefix}${productItemData.nailProductId}.svg`}
            alt='archive-product' />
        <div>
        {isSuccess ?
          <div className={style.textPanel}>
            <div className={style.title}>You’re on the list!</div>
            <div className={style.description}>We’ll let you know if this style comes back in stock!</div>
          </div>:
          <div className={style.textPanel}>
            <div className={style.title}>Do you want {productItemData.name} to come back?</div>
            <div className={style.description}>Enter your email and we’ll let you know if it comes back in stock! </div>
          </div>
        }
        </div>
        {!isSuccess &&
          <input
            autoFocus
            type='email'
            required
            placeholder='Email address*'
            className={style.inputField}
            value={email}
            onChange={inputHandler} />
        }
        {!isSuccess ?
          <OutlinedDarkButton passedClass={style.submitButton} type='submit' disabled={loading}>
            JOIN THE WAITLIST
          </OutlinedDarkButton>:
          <OutlinedDarkButton passedClass={classNames(style.submitButton, style.backToShop)} type='button' onClick={onClose}>
            BACK TO ARCHIVE
          </OutlinedDarkButton>
        }
        {isSuccess &&
          <div className={style.browseArchive} onClick={moveToShop}>
            GO TO SHOP
            <ArrowIcon className={style.arrowIcon} />
          </div>
        }
        <img
          className={style.closeIcon}
          src='../../static/icons/close-icon.svg'
          onClick={onClose}
          alt='close-icon' />
      </form>
      <div className={style.overlay} />
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(RequestProduct);

