import React, { useState, useEffect } from 'react';
import InputEmail from './InputEmail';
import JoinSuccess from './JoinSuccess';
import style from './css/halloween-join-popup.module.css';

import log from '../../../../utils/logging'

import {Product, KeyValue, WaitListContent} from '../../../../types'


type JoinWaitListProps = {
  opened: boolean,
  onClose: any,
  isMobileView: boolean,
  productId: string,
  product?: Product,
  globalProps: any,
}

const JoinWaitListPopup = ({ opened, onClose, isMobileView, productId, product, globalProps} : JoinWaitListProps) => {
  log.verbose('JoinWaitListPopUp, what is the product?', {product})
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [displayed, setDisplay] = useState(false);

  const [waitListContent, setWaitListContent] = useState<WaitListContent>()
  const allWaitList = globalProps.waitList;

  log.verbose('JoinWaitListPopUp, what is the waitLists?', waitListContent)

  async function loadWaitListContent(){
    try{

      let waitList = allWaitList[product?.extraFields?.waitListTemplate] || allWaitList["Default"]

      setWaitListContent(waitList)

    }catch(err){
      log.error('couldnt get the wait lists ', err)
    }

  }
  useEffect(() => {
    setDisplay(true);
    loadWaitListContent();
  }, []);

  useEffect(() => {
    if (waitListContent && opened) {
      document.getElementById('join-waitlist-popup').className += ` ${style.move}`;
    }
  }, [opened, waitListContent])

  if (!opened) {
    return null;
  }
  const backgroundImage = waitListContent?.modalImage && {backgroundImage: `url(${waitListContent?.modalImage})`}



  return (
  <>
  {displayed && <div className={style.overlay} />}
  { waitListContent && <div className={style.container} id='join-waitlist-popup' style={backgroundImage}>
    <img
      className={style.closeButton}
      src={"/static/icons/close-dark-icon.svg"}
      onClick={onClose}
      alt='close' />
    {isSubscribed ?
      <JoinSuccess onClose={onClose} copy={waitListContent?.confirmationBody} header={waitListContent?.confirmationHeader}  primaryColor={waitListContent?.primaryColor} secondaryColor={waitListContent?.secondaryColor}/> :
      <InputEmail emailTemplate={waitListContent?.emailTemplate} copy={waitListContent?.modalBody} header={waitListContent?.modalHeader} setIsSubscribed={setIsSubscribed} primaryColor={waitListContent?.primaryColor} secondaryColor={waitListContent?.secondaryColor} />
    }
  </div>
  }
  </>
  );
};

export default JoinWaitListPopup;
