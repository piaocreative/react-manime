import { useState, useEffect } from 'react';
import PrimaryPromotionBar from 'components/promotion/PrimaryPromotionBar';
import SecondaryPromotionBar from 'components/promotion/SecondaryPromotionBar';

import log from 'utils/logging';

export default function PromotionBars({
  globalProps,
  primaryPromotionHeight,
  secondaryPromotionHeight,
  closePromotionHandler,
  closeSecondaryPromotionHandler,
}) {
  const promotionBar = globalProps?.promoBarList?.[0];

  if (!promotionBar) return null;

  return (
    <>
      <PrimaryPromotionBar
        primaryPromotionHeight={primaryPromotionHeight}
        onClose={closePromotionHandler}
        contents={promotionBar?.['primary']}
      />
      <SecondaryPromotionBar
        mt={`${primaryPromotionHeight}px`}
        height={secondaryPromotionHeight}
        contents={promotionBar?.['secondary']}
        onClose={closeSecondaryPromotionHandler}
      />
    </>
  );
}
