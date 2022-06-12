import React, { useEffect, useState } from 'react';
declare var yotpo
const LandingYotpoGallerySection = () => {
  const [yotpoInitialized, setYotpoInitialized] = useState(false);
  useEffect(() => {
    if (!yotpoInitialized && typeof yotpo != 'undefined' && yotpo.initialized) {
      yotpo.refreshWidgets();
      setYotpoInitialized(true);
    }
  })
  return (
    <div
      className="yotpo yotpo-pictures-widget"
      data-gallery-id="5e7bb76eab06dd20b471d509">
    </div>
  );
};

export default LandingYotpoGallerySection;
