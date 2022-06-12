import React, { useEffect, useState } from 'react';

declare var yotpo
const LandingGuaranteeSection = ({ isMobileView }) => {
  const [yotpoInitialized, setYotpoInitialized] = useState(false);
  useEffect(() => {
    if (!yotpoInitialized && typeof yotpo != 'undefined' && yotpo.initialized) {
      yotpo.refreshWidgets();
      setYotpoInitialized(true);
    }
  })
  return (
    <div style={{overflow: 'hidden'}}>
     <div className='yotpo yotpo-reviews-carousel'
       data-background-color='transparent'
       data-mode='top_rated'
       data-type='site'
       data-count='9'
       data-show-bottomline='1'
       data-autoplay-enabled='1'
       data-autoplay-speed='3000'
       data-show-navigation='1'>&nbsp;</div>
    </div>
  );
};

export default LandingGuaranteeSection;
