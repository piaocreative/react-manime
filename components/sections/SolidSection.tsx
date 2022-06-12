import React, { memo } from 'react';
import { SolidThinHeader } from '../design/Common';
import SolidBubblesPanel from '../design/byn/SolidBubblesPanel';

const SolidSection = (props) => {
  const { isMobileView, isPedis } = props;

  return (
    <>
      <SolidThinHeader
        title='Solid Colors'
        description="Our favorite solid colors. You can't go wrong." />
      <SolidBubblesPanel isMobileView={isMobileView} isPedis={isPedis} />
    </>
  );
};

export default memo(SolidSection);