import { isDevMode } from './generalHelpers';
import publicIp from 'public-ip';
import { experiments } from './abTest';

 
import log from './logging'

const fittingGalleryFlowActiveVariant = () => { 
  return experiments.fittingGalleryFlow.variantNames[0];
};
const checkoutFlowActiveVariant = () => { 
  return experiments.checkoutFlow.variantNames[0];
};

const maniFittingFlowVariant = () =>{
  return experiments.maniFittingFlow.experimentName[0];
};

const fitFlowVariant = () =>{
  return experiments.fitting.variantNames[0];
};

let ipAddress = 'default';
publicIp.v4().then(res => {
  ipAddress = res;
});

export const trackFlowMixpanel = (step, message, optionalData = {}) => {
  if (isDevMode()) return;
  trackFunnelActionProjectFunnel(`${step} - ${message}`, { ...optionalData });
}

export const trackFunnelAction = message => {
  if (isDevMode()) return;
  trackFunnelActionProjectFunnel(message);
}

export const trackWithGtm = (message, state={}) => {
  if (isDevMode()) {
    log.info(message, {state, userData, optionalData});
    return;
  }
  trackFunnelActionProjectFunnel(message, { ...state }, true);
}
export const track = (message, state = {}, userData = {}, optionalData = {}) => {
  if (isDevMode()) {
    log.info(message, {state, userData, optionalData});
    return;
  }
  trackFunnelActionProjectFunnel(message, { ...state, ...userData, ...optionalData });
};

export const trackCheckout = (message, optionalData)=>{

  trackFunnelActionProjectFunnel(`[checkout]${message}`, optionalData);
}

export const trackFunnelActionProjectFunnel = (message, optionalData = {}, withGtm=false ) =>{
  _trackFunnelActionProjectFunnel(message, optionalData, withGtm);
}
const _trackFunnelActionProjectFunnel = (message, optionalData = {}, withGtm=false ) => {
  
 // console.info(`going to track a mix panel message` )
 
  try{
    if ((isDevMode() || !process.browser)) {  // this is because only on browser should we be tracking
      log.info('eating sentry message:')
      log.info(message, optionalData);
      return;
    };
  
    if (optionalData.err) {
      const message = optionalData.err.message;
      delete optionalData.err;
      optionalData.err = message;
    }
    const now = new Date();
    const browserTime = now.getTime();
    const browserDate = now.toISOString();
    const gaid = process.GAID ? process.GAID : undefined;
    const env = process.env.RELEASE_LABEL
    const build = process.env.RELEASE
    const totalOrders = process.env.TOTAL_ORDERS ? process.env.TOTAL_ORDERS : 0
    const fitFlow = fitFlowVariant()
    const isAuth = process.env.IS_AUTH;

    const trackingProperties = {
      browserTime,
      browserDate,
      totalOrders,
      activeGalleryVariant: fittingGalleryFlowActiveVariant(),
      activeCheckoutVariant: checkoutFlowActiveVariant(),
      activeManiFittingFlowVariant: maniFittingFlowVariant(),
      fitFlow,
      ipAddress,
      gaid, 
      env, 
      build,
      isAuth,
      ...optionalData
    }
    mixpanel.funnel.track(message, trackingProperties);
    if(withGtm){
      const gtm = {
        event: message, 
        ...trackingProperties
      }
  
      try {
        if (window['dataLayer']) {
          window['dataLayer'].push(gtm);
        }
      } catch (err) {
      }
    }
  }catch(error){
    console.error(`could not run mixpanel ` + error)
  }

}

export function incrementGlobalOrderCount(){
  process.env.TOTAL_ORDERS = parseInt(process.env.TOTAL_ORDERS) +1;
}
export function setGlobalOrderCount(count){
  process.env.TOTAL_ORDERS = count
}


export const FlowLabels = {
  Auth: '[Auth]',
  Checkout: '[Checkout]',
  Fit: '[Fit]',
  Refit: '[Refit]',
  GroupGiftBuy: '[GroupGift][Buyer]',
  GroupGiftRedeem: '[GroupGift][Redeem]',
  TelfarRedeem: '[Telfar][Redeem]',
 }
