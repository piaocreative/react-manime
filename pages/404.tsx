import style from '@styles/error/error.module.css';
import { PrimaryButton } from 'components/basic/buttons';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Router from 'next/router';
import React from 'react';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';

const bubbleImageSrc = 'static/icons/lightpink-bubble.svg';

const ErrorPage = props => {
  const onBackClickHandler = ev => {
    ev.preventDefault();
    Router.push(pageLinks.Home.url);
  };

  React.useEffect(() => {
    log.error('[ErrorPage]', {
      url: window.location.pathname,
      statusCode: '404',
      ...props,
    });
  }, []);

  return (
    <div className={style.root}>
      <div className={style.container}>
        <img className={style.bubbleIcon} src={bubbleImageSrc} alt="manime-nail" />
        <div className={style.title}>
          <div className={style.orangeTitle}>OOPS ... 404 error</div>
          <div>NO MANIS HERE!</div>
        </div>
        <div className={style.description}>
          We can’t find the page you’re looking for. Try double checking the address that you’ve
          entered.
        </div>

        <PrimaryButton passedClass={style.actionButton} onClick={onBackClickHandler}>
          BACK TO HOME
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ManimeStandardContainer(ErrorPage);

export const getStaticProps = async () => await getGlobalProps();
