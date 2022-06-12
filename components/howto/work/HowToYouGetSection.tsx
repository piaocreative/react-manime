
import React from 'react';
import style from '../../../static/components/howto/work/howto-you-get-section.module.css';

const labelList = [
  'YOUR GEL MANI',
  'PREP PAD',
  'NAIL FILE',
];

const HowToYouGetSection = () => {
  return (
    <div className={style.container}>
      <div className={style.title}>WHAT YOU GET</div>
      <div className={style.imgContainer} />
      <div className={style.labelContainer}>
      {labelList.map((label, index) => (
        <div className={style.labelLine} key={index}>
          <div className={style.labelOrder}>{index + 1}</div>
          <div className={style.label}>{label}</div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default HowToYouGetSection;