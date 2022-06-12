import log from './logging';
import { useState, useEffect } from 'react';
import { isApplePortable, isMobileDevice } from 'utils/device';
import { experiments } from 'utils/abTest';
import { SetCamera } from 'actions/camera';
import { getItemFromLocalStorage, setItemToLocalStorage } from 'utils/localStorageHelpers';
import { track } from './track';
const IPHONE_6_CAMERA_WIDTH = 3264;

export type CameraStream = {
  width: number;
  height: number;
  stream: any;
  hasStablization: boolean;
};

const iterator = 2;
const CAMERA_KEY = 'cameraAllowed' + iterator;
const FIT_VERSION_OVERRIDE = 'fitVersionOverride';
const LOW_POWER_MODE = 'lowPowerMode';
const MIN_APPLE_WIDTH = 375;
function setCameraEligibilty(eligibility) {
  setItemToLocalStorage(CAMERA_KEY, eligibility);
}
export function isLowPowerMode() {
  if (document) {
    const vid = document.createElement('video');
    // vid.style.display = 'none';

    vid.autoplay = true;
    vid.setAttribute('playsinline', 'playsinline');
    vid.loop = true;
    vid.muted = true;
    vid.setAttribute('type', 'video/mp4');

    vid.id = 'powermodetest';
    vid.src =
      'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/hand-scan-intro.mp4?v=1616020124';

    const html = document.getElementsByTagName('html')[0];
    html.appendChild(vid);
    vid.play();
    // may want this someday
    const playing = !!(vid.currentTime > 0 && !vid.paused && !vid.ended && vid.readyState > 2);
  }
}
export function getLotteryOverride() {
  let activeVariant = experiments.fitting.variantNames[0];
  const performCameraCheck = !(process.env.PERFORM_CAMERA_CHECK === 'false');
  const cameraEligibility = getItemFromLocalStorage(CAMERA_KEY);
  const screenEligibility = window.screen.width >= MIN_APPLE_WIDTH;

  const lowPowerMode = getItemFromLocalStorage(LOW_POWER_MODE) || undefined;

  let flowResult = activeVariant;
  let denialResult = undefined;
  if (isMobileDevice()) {
    if (!isApplePortable()) {
      denialResult = 'non-apple portable';
    } else if (!screenEligibility) {
      denialResult = 'screen rez';
    } else if (performCameraCheck && cameraEligibility === 'false') {
      denialResult = 'cameraRez';
    } else if (lowPowerMode) {
      denialResult = 'lowPowerMode';
    }
  } else {
    denialResult = undefined;
  }

  // TODO: Unforce this in the future when fixing FF2
  denialResult = 'force ff1';
  return denialResult;
}

export function getFitVersion() {
  let fitVersionOverride = getItemFromLocalStorage(FIT_VERSION_OVERRIDE) || undefined;
  let activeVariant = experiments.fitting.variantNames[0];
  if (
    fitVersionOverride &&
    activeVariant !== fitVersionOverride &&
    fitVersionOverride !== 'undefined'
  ) {
    activeVariant = fitVersionOverride;
  }

  return activeVariant;
}

function isCameraEligible(cameraWidth) {
  const eligible = cameraWidth >= IPHONE_6_CAMERA_WIDTH;

  setCameraEligibilty(eligible);
  return eligible;
}

export async function closeCamera(camera: CameraStream, dispatch) {
  try {
    await camera?.stream.getTracks()[0].stop();
    if (dispatch) {
      dispatch(SetCamera(undefined));
    }
  } catch (error) {
    log.error('could not close camera stream');
  }
}

export async function getCamera(dispatch): Promise<CameraStream | { error }> {
  let toReturn = {} as CameraStream;

  var defaultEnvironmentCamera = {
    audio: false,
    video: {
      facingMode: 'environment',
    },
  };

  try {
    const envStream = await navigator.mediaDevices.getUserMedia(defaultEnvironmentCamera);
    if (!envStream) {
      return { error: 'User Denied Access' };
    }
    const capabilities = await envStream.getTracks()[0].getCapabilities();
    const settings = await envStream.getTracks()[0].getSettings();

    log.verbose('capabilities:', capabilities);
    log.verbose('settings: ', settings);
    toReturn.width = capabilities.width.max;
    toReturn.height = capabilities.height.max;

    toReturn.hasStablization =
      process.env.PERFORM_CAMERA_CHECK === 'false' || isCameraEligible(capabilities.width.max);

    await envStream.getTracks()[0].stop();

    let constraints = {
      audio: false,
      video: {
        height: {
          exact: toReturn.height,
        },
        width: {
          exact: toReturn.width,
        },

        facingMode: 'environment',
      },
    };

    const s = await navigator.mediaDevices.getUserMedia(constraints);

    const camera = {
      width: toReturn.width,
      height: toReturn.height,
      stream: s,
      hasStablization: toReturn.hasStablization,
    };
    if (dispatch && toReturn.hasStablization) {
      dispatch(SetCamera(camera));
    }

    return camera;
  } catch (error) {
    return { error };
  }
}

export async function getScreenshot({
  stream,
  maxDimensions,
  viewDimensions,
  quality = 1,
  type = 'jpeg',
  scale = 0.8,
}) {
  const canvas = document.createElement('canvas');

  if (viewDimensions.width >= viewDimensions.height) {
    canvas.width = maxDimensions.width * scale;
    canvas.height = maxDimensions.height * scale;
  } else {
    canvas.width = maxDimensions.height * scale;
    canvas.height = maxDimensions.width * scale;
  }

  const ctx = canvas.getContext('2d');

  ctx.drawImage(stream, 0, 0, canvas.width, canvas.height);

  return new Promise(resolve => {
    canvas.toBlob(
      result => {
        resolve(result);
      },
      `image/${type}`,
      quality
    );
  });
}
