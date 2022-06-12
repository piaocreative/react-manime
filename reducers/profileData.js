const initialState = {
  profiles: [],
  isReady: false
  // userId: 'userId', //
  // profileName: 'Test User',
  // isDefault: true,
  // defaultType: 'manicure',
  // statusLeftFingers: null, //false,
  // statusLeftThumb: null, //true,
  // statusRightFingers: null, //true,
  // statusRightThumb: null, //true,
  // versionLeftFingers: null, //1,
  // versionLeftThumb: null, //1,
  // versionRightFingers: null, //1,
  // versionRightThumb: null, //1,
  // versionSide: null, //1,
  // statusSide: null, //true,
  // fitStatus: null, //'fittingValidated'
}

const profileData = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_COGNITO_AUTH':
      // setting to false because this represents the shift between auth to unauth, or reverse. 
      // it means that the Account script still needs to hydrate a user and send it's event, 
      // so the user is not ready until this happens. 
      return { ...state, isReady: false };
    case 'SET_USER_AND_PROFILE': {
      return {...state, profiles: [...action.profileData], isReady: true}
    }
    case 'SET_PROFILE_KEY_VALUE': {
      let profiles = [...state.profiles];
      let index = profiles.findIndex(profile => profile.profileId === action.profileId);
      if (index >= 0) {
        profiles[index][action.key] = action.value;
        return { ...state, profiles };
      }
    }
    case 'RESET_USER_DATA':
      return initialState;
    default:
      return state;
  }
};

export default profileData;
