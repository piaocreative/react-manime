import { useEffect } from 'react';
import Router from 'next/router';
import { pageLinks } from '../../utils/links';

const Design = () => {
  useEffect(() => {
    Router.push(pageLinks.SetupDesign.url);
  }, []);
  
  return null;
}

export default Design;