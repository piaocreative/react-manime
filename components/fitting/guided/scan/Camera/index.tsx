import { useEffect, useState, useRef, useCallback, useReducer } from 'react';
import {  useDispatch, useSelector } from 'react-redux'
import {useRouter} from 'next/router'
import style from 'static/components/fitting/guided/fingers.module.css';
import {CameraActions, SetCamera} from 'actions/camera'
import {pageLinks} from 'utils/links';
import { getScreenshot, getCamera, closeCamera, CameraStream } from 'utils/camera';
import { GuidanceMeta, PhotoMeta, PhotoStatus } from 'components/fitting/guided/config'
import log from 'utils/logging';
import Controls from './controls';
import { motion, useMotionValue, useTransform, useCycle } from 'framer-motion';

type FittingCamProps = {
  directionsMeta: GuidanceMeta;
  height;
  width;
  photoCallback;
  photoMeta: PhotoMeta,
  proTipState: string
  inReview: boolean,
  setInReview: Function,
  imageProps: {
    quality;
    type;
    scale;
  };
};
export default function FittingCam({
  directionsMeta,
  height,
  width,
  photoCallback,
  imageProps,
  photoMeta,
  proTipState,
  inReview,
  setInReview

}: FittingCamProps) {
  const cardRatio = 0.628;

  const [isLive, setIsLive] = useState(true);

  const [snapshot, setSnapshot] = useState<any>();
  const [largeImage, setLargeImage] = useState<any>()
  const [isCameraDisabled, setIsCameraDisabled] = useState(false);
  const camera = useSelector((state : any)=>state.cameraData.camera) as CameraStream
  const dispatch = useDispatch();
  const router = useRouter();

 
  async function mount() {


    try {

      const video = document.querySelector('video');
      if (video) {
        video.srcObject = camera.stream;
        video.play();
      }

    } catch (error) {
      log.info(JSON.stringify(error));
    }
  }

  async function takePhoto(event = undefined) {
    const video = document.querySelector('video');

    if (inReview) {
      
      setSnapshot(undefined);
      setInReview(false)
    } else {


      const small = await getScreenshot({
        stream: video,
        maxDimensions: {
          width: camera.width,
          height: camera.height
        },
        viewDimensions: { width, height },
        type: 'jpeg',
        quality: .9,
        scale: 0.65,
      });
      const large = await getScreenshot({
        stream: video,
        maxDimensions: {
          width: camera.width,
          height: camera.height
        },
        viewDimensions: { width, height },
        type: 'jpeg',
        quality: .9,
        scale: .87,
      });
      const blobToBase64 = blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      };


      setSnapshot(await blobToBase64(small));
      setInReview(true)
      setLargeImage(large)

    }
  }

  async function keepPhoto() {

    if (photoMeta.url === snapshot) {

      photoCallback({
        success: true,
        keepOldPhoto: true
      });
    } else {
      photoCallback({
        success: true,
        inReview: inReview,
        smallImage: snapshot,
        largeImage: largeImage,
        version: photoMeta.version + 1,
        type: imageProps.type == 'jpeg' ? 'jpg' : imageProps.type
      });
    }

    takePhoto();
  }

  async function reviewCurrent(imageMeta: any) {
    const video = document.querySelector('video');

    try {
      setSnapshot(imageMeta.url);
      setInReview(true);
    } catch (error) {
      log.error('[scan/Camera/index][reviewCurrent] could not load review image ' + error, {error});
    }
  }


  useEffect(() => {

    if (photoMeta.key && (
      photoMeta.status === PhotoStatus.REJECTED ||
      photoMeta.status === PhotoStatus.PENDING
    )) {
      
      reviewCurrent(photoMeta);

    }


  }, [photoMeta.key]);


  useEffect(() => {

    if (photoMeta?.status === PhotoStatus.PENDING) {
      
      reviewCurrent(photoMeta);

    }else if(inReview) {
      setInReview(false)
    }

  }, [photoMeta]);

  useEffect(()=>{
    if(isCameraDisabled){
      alert('you paused the camera, you cannot proceed with fit flow while paused');
    }
  },[isCameraDisabled])
  
  useEffect(()=>{
    function cameraSuspeneded(){

    }
    function cameraPaused(){
      setIsCameraDisabled(true)
    }
    function cameraPlayed(){

      if(!isCameraDisabled){
        setIsCameraDisabled(false)
      }
    }

    function cleanUp(){
      vid.removeEventListener('playing', cameraPlayed);
      vid.removeEventListener('pause', cameraPlayed);
      vid.removeEventListener('suspend', cameraSuspeneded);
    }
    const vid = document.getElementById('cameraStream');
    vid.addEventListener('playing', cameraPlayed);
    vid.addEventListener('suspend', cameraSuspeneded)
    vid.addEventListener('pause', cameraPaused)

    return (cleanUp)
    
  },[])

  function goToOldFlow(){
    this.props.router.replace(
      {
        pathname: `${pageLinks.ManiFitting.url}`,
        query: this.props.router.query
      },
      {
        pathname: `${pageLinks.ManiFitting.url}`,
        query: this.props.router.query
      },
    );
  }

  useEffect(() => {

    if(camera){
      mount();
    }else{
      (async ()=>{
        const c = await getCamera(dispatch);
        if( c['error']){
          goToOldFlow();
        }
        else if (!c['hasStablization']) {
          
          closeCamera(c as CameraStream, dispatch);
          goToOldFlow();
          return;
        }else {
          dispatch(SetCamera(c))
        }
      }
      )()
    }
  }, [camera]);

  const proTipOpen = proTipState === 'open';

  return (

    <div>

        <div
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 10,
          }}
        >
          {
            inReview && snapshot &&
            <img src={snapshot} style={{ height, objectFit: 'cover' }} />
          }
            <video
            id='cameraStream'
            autoPlay={true}
            playsInline
            src={"empty"}
            style={{ height, display: (inReview && snapshot) ? 'none' : 'inline' }}
            className={style.camera}
          ></video>




        </div>
        {
          // top is to the bottom of the Guidance (30 top margin, 80 height closed) + 50 for padding
        }
        <div
          style={{
            position: 'fixed',
            left: '0px',
            top: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            zIndex: 50,
          }}
        >

          {directionsMeta.boundingBox &&
            <svg
              width={'70%'}
              viewBox={`0 0 100 ${100 * cardRatio}`}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                rx="3"
                ry="3"
                width="98%"
                height="98%"
                stroke="ghostwhite"
                fill="transparent"
              />
            </svg>
          }

        </div>
        <Controls
          guidance={directionsMeta}
          reviewImage={snapshot}
          inReview={ inReview}
          keepPhoto={keepPhoto}
          preparePhoto={takePhoto}
          showCameraButton={proTipOpen || inReview || isCameraDisabled}
          cardRatio={cardRatio}
        />
    </div>

  );
}
