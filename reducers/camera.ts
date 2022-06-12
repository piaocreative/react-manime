;
import {CameraActions} from 'actions/camera'
import log from 'utils/logging'
const initialState = {
  camera: undefined,
};

const camera = (state = initialState, action) => {
  switch (action.type) {
    case CameraActions.SetCamera:
      return  {...state, camera:action.camera}
      break;
  }
  return state;
}

export default camera