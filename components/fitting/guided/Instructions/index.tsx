import React from 'react';
import Router from 'next/router';
import { OutlinedDarkButton, DarkButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import Slider from "react-slick";
import style from '@styles/fitting/guided/instructions.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from './carousel'
import {getCamera} from 'utils/camera'
import {useDispatch} from 'react-redux'

const videoUrl = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/hand-scan-intro.mp4?v=1616020124';

const Instructions = ({ nextButton, skippable, returnUrl }) => {

  const dispatch = useDispatch();
  async function requestCameraAccess(){

    const results = await getCamera(dispatch);

    if (results['error']){
      nextButton();
    }else {
      nextButton(results)
    }
  }

  const transitionTrigger = Router.router.query?.transitionTrigger;
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className={style.container}>
      <div className={style.contentContainer}>
        <div className={style.title}>
          It’s time to create your <br /> unique custom-fit.
        </div>
        <div className={style.videoContainer}>
          <video autoPlay loop muted playsInline
            className={style.videoStyle} key='mobileVideo'>
            {/* TODO: change later */}
            <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
        <div className={style.instructions}>

          <Carousel />

          <DarkButton passedClass={style.button}
            onClick={requestCameraAccess}>
            Let’s get started
          </DarkButton>
          {
            (skippable) && 
            <OutlinedDarkButton passedClass={style.button} style={{marginTop: '10px'}}
            onClick={()=>{
              Router.router.push(returnUrl)
            }}>
            Maybe later
          </OutlinedDarkButton>
          }
        </div>
      </div>
    </div>
  );
}

export default Instructions;