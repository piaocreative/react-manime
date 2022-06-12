import React, { forwardRef } from 'react';
import classNames from 'classnames';
import CheckIcon from '../../icons/howto/CheckIcon';
import UncheckIcon from '../../icons/howto/UncheckIcon';
import style from './css/how-to-apply-video-section.module.css';

type PropsType = {
  data: {
    stepName: string,
    shortName: string,
    fullName: string,
    note: any,
    videoUrl: string,
    descriptions: Array<any>
  },
  reverse: any,
  index?: any,
  ref?: any,
  key?: any
}

const HowToApplyVideoSection = forwardRef(({ data, reverse, index }: PropsType, ref: any) => (
  <div
    key={`sections-${index}`}
    id={`section${index}`}
    ref={ref}
    className={classNames('apply-section', style.container, {
    [style.reverseContainer]: !!reverse
  })}>
    <video width="100%" height="100%" autoPlay loop muted playsInline
      className={classNames(style.videoStyle, {
        [style.reverseImageStyle]: !!reverse
      })}>
      <source src={data.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className={style.textPanelStyle}>
      <div className={style.stepName}>{data.stepName}</div>
      <div className={style.fullName}>{data.fullName}</div>
      <div>{data.note}</div>
      <div className={style.descriptionPanel}>
        {data.descriptions.map((description, index) => (
          <>
          {description.checked?
            <CheckIcon key={`${description.shortName}-check-${index}`} color='#59AA8E'/>:
            <UncheckIcon key={`${description.shortName}-uncheck-${index}`}/>
          }
          <div key={index} className={style.descriptionLine}>
            {description.jsx}
          </div>
          </>
        ))}
      </div>
    </div>
  </div>
));

export default HowToApplyVideoSection;