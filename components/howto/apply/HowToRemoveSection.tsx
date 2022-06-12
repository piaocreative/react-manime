import React, { forwardRef } from 'react';
import HowToApplyVideoSection from '../../../components/howto/apply/HowToApplyVideoSection';

import style from './css/how-to-apply-video-list.module.css';

const howToRemoveData = 
  {
    stepName: 'Removal',
    shortName: '',
    fullName: 'How to remove',
    note: 'Simply peel them off whenever you’re ready!',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-remove-new.mp4?v=1610132247',
    iconUrl: '/static/icons/how-to-apply/step-1-active.svg',
    descriptions: [
      {
        checked: true,
        jsx: <>For extra gentle removal,  soak your hands or feet in warm water or apply lotion along the edges of the gels.</>
      },
      {
        checked: true,
        jsx: <>If you've used a base coat underneath your gels, remove any remaining residue with nail polish remover.</>,
      },
    ]
  };

const HowToRemoveSection = forwardRef((props, ref) => {
  return (
    <div className={style.container}>
      <HowToApplyVideoSection
        ref={ref}
        data={howToRemoveData}
        reverse={false} />
    </div>
  );
});

export default HowToRemoveSection;