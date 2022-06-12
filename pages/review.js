import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import React, { useEffect, useState } from 'react';

const YotpoReview = () => {
  const [yotpoInitialized, setYotpoInitialized] = useState(false);
  useEffect(() => {
    if (!yotpoInitialized && typeof yotpo != 'undefined' && yotpo.initialized) {
      yotpo.refreshWidgets();
      setYotpoInitialized(true);
    }
  });

  return <div id="yotpo-testimonials-custom-tab"></div>;
};

export default ManimeStandardContainer(YotpoReview);
export const getStaticProps = async () => await getGlobalProps();
