import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React from 'react';
import Router from 'next/router';
import { PrimaryButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import style from '@styles/error/error.module.css';
import log from 'utils/logging'
import {track} from 'utils/track'
const bubbleImageSrc = 'static/icons/lightpink-bubble.svg';


export const ErrorPage = ({url=undefined, statusCode=404, globalProps, ...rest}) => {
  const onBackClickHandler = ev => {
    ev.preventDefault();
    Router.push(pageLinks.Home.url);
  }
  let _statusCode = statusCode ? statusCode : '500 (clientside)'

  React.useEffect(()=>{

    track("[ErrorPage]", {
      url: window.location.pathname, 
      statusCode: _statusCode,
      ...rest
    })
  },[])

  return (
    
    <div className={style.root}>
      <div className={style.container}>
        <img
          className={style.bubbleIcon}
          src={bubbleImageSrc} alt='manime-nail' />
        <div className={style.title}>
          <div className={style.orangeTitle}>OOPS ...</div>
          <div>NO MANIS HERE!</div>
        </div>
        <div className={style.description}>
          We can’t find the page you’re looking for.
          Try double checking the address that you’ve entered.
        </div>

        <PrimaryButton
          passedClass={style.actionButton}
          onClick={onBackClickHandler}>
          BACK TO HOME
        </PrimaryButton>
      </div>
    </div>

    
  );
}


const _Error = ManimeStandardContainer(ErrorPage);
_Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  const globalProps = await getGlobalProps()

  return { statusCode, globalProps: globalProps.props }
}
export default _Error
