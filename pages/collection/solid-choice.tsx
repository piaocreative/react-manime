import React, { useEffect } from 'react';
import Router from 'next/router';

import { pageLinks } from '../../utils/links';

const RedirectAboutUs = () => {
  useEffect(() => {
    Router.push(pageLinks.Collection['Solid Colors'].url);
  }, []);

  return null;
};

async function getInitialProps({res}) {
  if (res) {
    res.writeHead(301, { Location: pageLinks.Collection['Solid Colors'].url });
    res.end();
  } else {
    Router.replace(pageLinks.Collection['Solid Colors'].url);
  }
}

RedirectAboutUs.getInitialProps = getInitialProps

export default RedirectAboutUs;