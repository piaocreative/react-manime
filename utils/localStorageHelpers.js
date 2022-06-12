import { trackFunnelActionProjectFunnel } from './track';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

export const loadAddressId = identityId => {
  try {
    const serializedAddressId = localStorage.getItem(`${identityId}-lastShippingAddressId`);
    if (serializedAddressId === null) {
      return undefined;
    }
    return JSON.parse(serializedAddressId);
  } catch (err) {
    return undefined;
  }
};

export const saveAddressId = (identityId, id) => {
  try {
    const serializedAddressId = JSON.stringify(id);
    localStorage.setItem(`${identityId}-lastShippingAddressId`, serializedAddressId);
  } catch {
    // ignore write errors
  }
}

export const setItemToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    log.error('[localStorageHelper][setItemToLocalStorage] unable to set item in local storage ' + err, { err } );
  }
}

export const getItemFromLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage? localStorage.getItem(key): defaultValue;
    if (value) return value;
    if (defaultValue != null && defaultValue != undefined) return defaultValue;
    return null;
  } catch (err) {
    log.error('[localStorageHelpers][getItemFromLocalStorage] exeption ' + e,  { err, key } );
  }
}


export const loadImageStatuses = userData => {
  try {
    const serializedImageStatuses = null;
    // const serializedImageStatuses = localStorage.getItem(`${userData.identityId}-imageStatuses`);

    if (serializedImageStatuses === null) {
      const {
        statusLeftFingers,
        statusLeftThumb,
        statusRightFingers,
        statusRightThumb,
        statusSide
      } = userData;
      const serializedImageStatusesObject = JSON.stringify({
        statusLeftFingers,
        statusLeftThumb,
        statusRightFingers,
        statusRightThumb,
        statusSide
      });
      localStorage.setItem(`${userData.identityId}-imageStatuses`, serializedImageStatusesObject);

      const serializedImageStatusesFromLocalStorage = localStorage.getItem(`${userData.identityId}-imageStatuses`);
      // log.info(999);
      return JSON.parse(serializedImageStatusesFromLocalStorage);
    }
    // log.info(888);
    return JSON.parse(serializedImageStatuses);
  } catch (err) {
    log.error('[localStorageHelpers] error loadImageStatuses', { err } );
    return userData;
  }
};

export const clearImageStatuses = identityId => {
  try {
    localStorage.removeItem(`${identityId}-imageStatuses`);
  } catch (err) {
    log.error('[localStorageHelpers] error clearImageStatuses', { err } );
  }
}
