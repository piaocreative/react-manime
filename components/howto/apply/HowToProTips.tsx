import React from 'react';
import classNames from 'classnames';
import style from '../../../static/components/howto/apply/howto-protips.module.css';

const tipList = [
  {imgPath: 'howto-avoid-oils.jpg', title: 'AVOID OILS', description: 'Wash the oils off your nails before application'},
  {imgPath: 'howto-mind-gap.jpg', title: 'MIND THE GAP', description: 'Leave a tiny gap at your cuticle.'},
  {imgPath: 'howto-press-fold.jpg', title: 'PRESS, SMOOTH, AND FOLD', description: 'Fold the excess over the tip of your nail.'},
  {imgPath: 'howto-file-downward.jpg', title: 'FILE DOWNWARD', description: 'Firmly in one direction (or clip the excess with a nail clipper)'},
];

const HowToProTips = () => {

  return (
    <div className={style.container}>
      <div className={style.title}>
        PROTIPS
      </div>
      {tipList.map((tipInfo, index) => (
        <div key={index} className={style.tipInfo}>
          <img className={style.tipImage} src={`/static/images/howto/${tipInfo.imgPath}`} alt={tipInfo.title} />
          <div className={style.tipTitle}>{tipInfo.title}</div>
          <div className={classNames(style.tipDescription, {
            [style.tipDescription0]: index === 0,
            [style.tipDescription1]: index === 1,
            [style.tipDescription2]: index === 2,
            [style.tipDescription3]: index === 3,
          })}>
            {tipInfo.description}
          </div>
        </div>
      ))}
    </div>
  );

};

export default HowToProTips;