import React, { useEffect } from 'react';
import Router from 'next/router';

import { pageLinks } from '../../utils/links';

const RedirectHowItWorks = () => {
  useEffect(() => {
    Router.push(pageLinks.HowItWorks.url);
  }, []);

  return null;
};

async function getInitialProps({res}) {
  if (res) {
    res.writeHead(301, { Location: pageLinks.HowItWorks.url });
    res.end();
  } else {
    Router.replace(pageLinks.HowItWorks.url);
  }
}

RedirectHowItWorks.getInitialProps = getInitialProps

export default RedirectHowItWorks