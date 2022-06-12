import React, { useEffect } from 'react';
import Router from 'next/router';
import { pageLinks } from '../../utils/links';

const HowTo = () => {
  useEffect(() => {
    Router.push(pageLinks.HowToApply.url);
  }, []);
  return null;
};

export default HowTo