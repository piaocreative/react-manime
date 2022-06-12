import React from 'react';
import HowToApplySection from './HowToApplySection';
import youtubeLinks from '../../../utils/youtubeLinks';
import style from '../../../static/components/howto/apply/howto-apply-steps.module.css';

// TODO CHANGE LINKS
const applyStepList = [
  {
    title: 'PREP YOUR NAILS OIL IS THE ENEMY!',
    videoLink: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/clean.mp4',
    linkLabel: 'watch How to Prep video',
    link: youtubeLinks.HowToPrep,
    descriptions: [
      {
        checked: true,
        text: 'Wash thoroughly with soap and water, then clean your nails with the prep pad.'
      },
      {
        checked: false,
        text: 'Avoid using cuticle oil or lotion prior to application.'
      },
    ]
  },
  {
    title: 'APPLY YOUR MANI',
    videoLink: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/apply.mp4',
    linkLabel: 'watch How to Apply video',
    link: youtubeLinks.HowToApply,
    descriptions: [
      {
        checked: true,
        text: 'Leave a tiny gap between your cuticle and the mani.'
      },
      {
        checked: true,
        text: 'Press and smooth the mani, folding the excess over the tip of your nail.'
      },
    ]
  },
  {
    title: 'FILE THE EXCESS',
    videoLink: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/file.mp4',
    linkLabel: 'watch How to File video',
    link: youtubeLinks.HowToFile,
    descriptions: [
      {
        checked: true,
        text: 'Hold Vertically and File Downward Only.'
      },
      {
        checked: false,
        text: 'Avoid angling file toward mani.'
      },
    ],
    extraText: 'You can use a nail clipper or apply a top coat for the perfect edge!'
  },
];

const HowToApplySteps = () => {

  return (
    <div className={style.container}>
      <div className={style.title}>APPLY MANIME LIKE A PRO</div>
      {applyStepList.map((stepInfo, index) => (
        <HowToApplySection key={index} stepInfo={stepInfo} order={index} />
      ))}
    </div>
  );

};

export default HowToApplySteps;