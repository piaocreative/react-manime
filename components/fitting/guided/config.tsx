
import { StepSequence,KeyValue } from 'types';
import cloneDeep from 'lodash/cloneDeep'
export enum FingerStepsEnum {
  LEFT_FINGERS = 'leftFingers',
  LEFT_THUMB = 'leftThumb',
  RIGHT_FINGERS = 'rightFingers',
  RIGHT_THUMB = 'rightThumb',
  SIDE = 'side',
}

export type GuidanceMeta = {
  description: string;
  name: string;
  proTips: string[];
  boundingBox: boolean;
  reviewHeader: string;
  reviewQuestions: string[];
  examples: {
    image: string,
    video: string,
    gif: string
  }
};

export enum PhotoStatus {
  NEW='new', APPROVED='approved', REJECTED='rejected', PENDING='pending', UPLOADING='uploading'
}

export type PhotoMeta = {
  version: number;
  key?: any;
  url?: any;
  status?: PhotoStatus 
};
export type KeyedPhotoMeta = KeyValue<PhotoMeta>;

export enum FitType {
  MANIS='Manis', PEDIS='Pedis'
}

export function getDefaultStepsKeys(type=FitType.MANIS): FingerStepsEnum[]{
  if(type===FitType.MANIS){
    return cloneDeep(DefaultManiKeys)
  }
}
export function getDefaultPhotosMeta(type=FitType.MANIS):KeyedPhotoMeta{
  if(type===FitType.MANIS){
    return cloneDeep(DefaultManiPhotoMeta)
  }
}

export function getDefaultStepSequence(type=FitType.MANIS):StepSequence {
  if(type===FitType.MANIS){
    return cloneDeep(DefaultManiSteps)
  }
}

const DefaultManiKeys = [
  FingerStepsEnum.LEFT_FINGERS,
  FingerStepsEnum.LEFT_THUMB,
  FingerStepsEnum.RIGHT_FINGERS,
  FingerStepsEnum.RIGHT_THUMB,
  FingerStepsEnum.SIDE

]
const DefaultManiPhotoMeta:KeyedPhotoMeta = {
  [FingerStepsEnum.LEFT_FINGERS]:  {
    version: 0,
    key: undefined,
    url: undefined,
    status: PhotoStatus.NEW,

  },
  [FingerStepsEnum.LEFT_THUMB]: {
    version: 0,
    key: undefined,
    url: undefined,
    status: PhotoStatus.NEW
  },
  [FingerStepsEnum.RIGHT_FINGERS]: {
    version: 0,
    key: undefined,
    url: undefined,
    status: PhotoStatus.NEW
  },
  [FingerStepsEnum.RIGHT_THUMB]: {
    version: 0,
    key: undefined,
    url: undefined,
    status: PhotoStatus.NEW
  },
  [FingerStepsEnum.SIDE]: {          
    version: 0,
    key: undefined,
    url: undefined,
    status: PhotoStatus.NEW
  }
}


const RetakeGuidenceOverlay = {
  description: "Retake your"
}

const DefaultManiGuidance: KeyValue<GuidanceMeta> = {
  [FingerStepsEnum.LEFT_FINGERS]: {
    description: 'Let\'s start with a picture of your',
    name: '4 left fingers',
    proTips: [
      'Hold phone parallel to surface & above nails',
      'Place fingers flat on your standard-size card',
      'Ensure the entire standard-size card is in frame',
    ],
    reviewHeader: `Let's review your %name% picture`,
    reviewQuestions: [
      'Is your phone parallel to the surface & above your nails? ',
      'Is the entire standard-size card in the frame?',
      'Is the picture well-lit & in-focus?'
    ],
    boundingBox: true,
    examples: {
      image: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/mani-example-left-fiingers.jpg?v=1616026156',
      video: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/M1A.mp4',
      gif: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/left-hand-v2.gif',
    }

  },
  [FingerStepsEnum.LEFT_THUMB]: {
    description: 'Let\'s start with a picture of your',
    name: 'left thumb',
    proTips: [
      'Hold phone parallel to surface & above nail',
      'Place thumb flat on your standard-size card',
      'Ensure the entire standard-size card is in frame',
    ],
    reviewHeader: `Let's review your %name% picture`,
    reviewQuestions: [
      'Is your phone parallel to the surface & above your nail? ',
      'Is the entire standard-size card in the frame?',
      'Is the picture well-lit & in-focus?'
    ],
    boundingBox: true,
    examples: {
      image: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/mani-example-left-thumb.jpg?v=1616026156',
      video: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/M2A.mp4',
      gif: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/left-thumb-v2.gif'
    }
  },
  [FingerStepsEnum.RIGHT_FINGERS]:  {
    description: 'Let\'s start with a picture of your',
    name: 'right 4 fingers',
    proTips: [
      'Hold phone parallel to surface & above nails',
      'Place fingers flat on your standard-size card',
      'Ensure the entire standard-size card is in frame',
    ],
    reviewHeader: `Let's review your %name% picture`,
    reviewQuestions: [
      'Is your phone parallel to the surface & above your nails? ',
      'Is the entire standard-size card in the frame?',
      'Is the picture well-lit & in-focus?'
    ],
    boundingBox: true,
    examples: {
      image: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/mani-example-right-fingers.jpg?v=1616026156',
      video: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/M3A.mp4',
      gif: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/right-hand-v2.gif'
    }
  },
  [FingerStepsEnum.RIGHT_THUMB]: {
    description: 'Let\'s start with a picture of your',
    name: 'right thumb',
    proTips: [
      'Hold phone parallel to surface & above nail',
      'Place tumb flat on your standard-size card',
      'Ensure the entire standard-size card is in frame',
    ],
    reviewHeader: `Let's review your %name% picture`,
    reviewQuestions: [
      'Is your phone parallel to the surface & above your nail? ',
      'Is the entire standard-size card in the frame?',
      'Is the picture well-lit & in-focus?'
    ],
    boundingBox: true,
    examples: {
      image: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/mani-example-right-thumb.jpg?v=1616026156',
      video: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/M4A.mp4',
      gif: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/right-thumb-v2.gif'
    }
  },
  [FingerStepsEnum.SIDE]: {
    description: "Lastly, let\'s focus on your",
    name: 'nail arch',
    proTips: [
      'Use either hand for this picture',
      'Press your fingers flat on top of your standard-size card ', 
      'Ensure all fingertips are visible  '
    ],
    reviewHeader: `Lastly, let\'s focus on your %name%`,
    reviewQuestions: [
      'Use either hand for this picture',
      'Press your fingers flat on top of your standard-size card ',
      'Ensure all fingertips are visible'
    ],
    boundingBox: false,
    examples: {
      image: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/mani-example-nail-arch.jpg?v=1616026156',
      video: 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/M5A.mp4',
      gif: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/nail-arch-v2.gif'
    }
  }
}

const DefaultManiSteps: StepSequence = {
  start: FingerStepsEnum.LEFT_FINGERS,
  meta: {},
  steps: {
    [FingerStepsEnum.LEFT_FINGERS]: {
      next: FingerStepsEnum.LEFT_THUMB,
      order: 0,
      meta: {
        guidance: DefaultManiGuidance[FingerStepsEnum.LEFT_FINGERS]
      },
    },
    [FingerStepsEnum.LEFT_THUMB]: {
      previous: FingerStepsEnum.LEFT_FINGERS,
      next: FingerStepsEnum.RIGHT_FINGERS,
      order: 1,
      meta: {
        guidance: DefaultManiGuidance[FingerStepsEnum.LEFT_THUMB]
      },
    },
    [FingerStepsEnum.RIGHT_FINGERS]: {
      previous: FingerStepsEnum.LEFT_THUMB,
      next: FingerStepsEnum.RIGHT_THUMB,
      order: 2,
      meta: {
        guidance: DefaultManiGuidance[FingerStepsEnum.RIGHT_FINGERS]

      },
    },
    [FingerStepsEnum.RIGHT_THUMB]: {
      previous: FingerStepsEnum.RIGHT_FINGERS,
      next: FingerStepsEnum.SIDE,
      order: 3,
      meta: {
        guidance: DefaultManiGuidance[FingerStepsEnum.RIGHT_THUMB]

      },
    },
    [FingerStepsEnum.SIDE]: {
      previous: FingerStepsEnum.RIGHT_THUMB,
      order: 4,
      meta: {
        guidance: DefaultManiGuidance[FingerStepsEnum.SIDE]

      },
    },
  },
}


export enum StepEnum {
  SIGNUP = 'signup',
  INSTRUCTIONS = 'instructions',
  SCAN = 'scan',
  VALIDATE = 'validate',
  SUCCESS = 'success',
  DESKTOP = 'desktop',
  LOADING = 'loading',
}

export const CollectionSequence: StepSequence = {
  start: StepEnum.INSTRUCTIONS,
  steps: {

    [StepEnum.INSTRUCTIONS]: {
      previous: StepEnum.SIGNUP,
      next: StepEnum.SCAN,
    },
    [StepEnum.SCAN]: {
      previous: StepEnum.INSTRUCTIONS,
      next: StepEnum.VALIDATE,
    },
    [StepEnum.VALIDATE]: {
      previous: StepEnum.SCAN,
      next: StepEnum.SUCCESS,
    },
    [StepEnum.SUCCESS]: {
      previous: StepEnum.VALIDATE,

    },
    [StepEnum.DESKTOP]: {

    },
    [StepEnum.LOADING]: {

    },
    [StepEnum.SIGNUP]: {
      next: StepEnum.INSTRUCTIONS,

    },
  },
  meta: {},
};
