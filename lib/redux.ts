import { createStore, applyMiddleware, compose } from 'redux';
import log from 'utils/logging';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
export let store = undefined;
import { loadState, saveState } from 'utils/localStorageHelpers';

import rootReducer from 'reducers';

export function getStore() {
  return store;
}
function createMiddlewares({ isServer }) {
  let middlewares = [thunkMiddleware];
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(
      createLogger({
        level: 'info',
        collapsed: true
      })
    );
  }
  return middlewares;
}

import throttle from 'lodash.throttle';
export const initStore = (initialState = {}, context) => {

  log.verbose("store being initalized ")
  let { isServer } = context;
  let middlewares = createMiddlewares({ isServer });

  const persistedState = loadState();
  // TODO: Do we want to run this code on the server too?

  if (process.env.NODE_ENV == 'development') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    store = createStore(rootReducer, persistedState, composeWithDevTools(compose(applyMiddleware(...middlewares))));
  } else {
    store = createStore(rootReducer, persistedState, compose(applyMiddleware(...middlewares)));
  }

  store.subscribe(
    throttle(() => {
      saveState({
        userData: store.getState().userData
      });
    }, 1000)
  );
  return store;
};