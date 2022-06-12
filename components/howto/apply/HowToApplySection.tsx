import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import CheckIcon from '../../icons/howto/CheckIcon';
import UncheckIcon from '../../icons/howto/UncheckIcon';
import style from '../../../static/components/howto/apply/howto-apply-section.module.css';

const HowToApplySection = ({ stepInfo, order }) => {
  const [openVideo, setOpenVideo] = useState(false);
  const [isMobileView, setIsMobileView] = useState(true);

  const openVideoHandler = () => {
    setOpenVideo(true);
  };

  const closeVideoHandler = () => {
    setOpenVideo(false);
  };

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsMobileView(false);
    }
  }, []);

    return (
      <>
      <div className={classNames(style.container, {
        [style.reverseOrder]: order === 1
      })}>

        <video width="100%" height="100%" autoPlay loop muted playsInline
          className={classNames(style.videoStyle, {
            [style.reverseimageStyle]: order === 1
          })} id={`vid${order}`}>
          <source src={stepInfo.videoLink} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={style.textPanel}>
            {isMobileView &&
              <div className={style.stepOrder}>STEP {order + 1}</div>
            }
            <div className={style.titleDescription}>
              <div className={style.center}>
                <div className={classNames(style.desktopOnly, style.stepOrder)}>STEP {order + 1}</div>
                <div className={style.stepTitle}>{stepInfo.title}</div>
                {!isMobileView &&
                  <div className={style.videoLink} onClick={openVideoHandler}>{stepInfo.linkLabel}</div>
                }
              </div>
              <div className={style.descriptionList}>
                {stepInfo.descriptions.map((description, index) => (
                  <div key={index} className={style.descriptionItem}>
                    {description.checked ?
                      <CheckIcon className={style.checkIcon} />:
                      <UncheckIcon className={style.checkIcon} />
                    }
                    <div className={style.descriptionText}>{description.text}</div>
                  </div>
                ))}
              </div>
          </div>
          {isMobileView &&
            <div className={style.videoLink} onClick={openVideoHandler}>{stepInfo.linkLabel}</div>
          }
        </div>
      </div>
      <>
      {openVideo &&
        <div className={style.dialogContainer}>
          <div className={style.playerWrapper}>
            <div className={style.closeIcon} onClick={closeVideoHandler}>×</div>
            <YouTubePlayer
              className={style.reactPlayer}
              config={{
                youtube: {
                  preload: true
                }
              }}
              width='100%'
              height='100%'
              playing
              loop
              controls
              url={stepInfo.link} />
          </div>
        </div>
      }
      </>
      </>
    );
};

export default HowToApplySection;
