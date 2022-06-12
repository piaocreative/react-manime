const initialState = {
  camera: undefined,
};

const camera = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_COGNITO_AUTH':
    //  alert('setting cognito auth')
  }
  return state;
}

export default camera