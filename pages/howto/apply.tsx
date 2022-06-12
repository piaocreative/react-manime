import React, { useEffect } from 'react';
import Router from 'next/router';

import { pageLinks } from '../../utils/links';

const RedirectHowToApply = () => {
  useEffect(() => {
    Router.push(pageLinks.HowToApply.url);
  }, []);

  return null;
};

async function getInitialProps({res}) {
  if (res) {
    res.writeHead(301, { Location: pageLinks.HowToApply.url });
    res.end();
  } else {
    Router.replace(pageLinks.HowToApply.url);
  }
}

RedirectHowToApply.getInitialProps = getInitialProps

export default RedirectHowToApply