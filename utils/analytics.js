import ReactGA from 'react-ga';
import config from '../config';
import { trackFunnelActionProjectFunnel } from './track';

export const initGA = () => {
  ReactGA.initialize(config.googleTagId);
};

export const logPageView = (url) => {
  // log.info(`Logging pageview for ${window.location.pathname}`);
  try {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);

  } catch (err) {
    log.error('[analytics] tracking', { err } );
  } finally{
    const time = (new Date()).getTime();
 //   alert(`about to track the location ${window.location.pathname}`)
    trackFunnelActionProjectFunnel(`${window.location.pathname}`, { time, query: window.location.search });
    trackFunnelActionProjectFunnel('PageView', {url: window.location.pathname, time, query: window.location.search});
  }
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
