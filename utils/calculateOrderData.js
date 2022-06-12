import { trackFunnelActionProjectFunnel,  } from './track';
import log from 'utils/logging'


// input:
// totalPrice - string
// credits - number

// output:
// creditsToRedeem - number
// newCredits - number
// newtotal for shopify and stripe - number
export const calculateOrderData = (userData, mainCartData) => {
  const currentCheckout = getCurrentCheckout(userData, mainCartData);
  if (!currentCheckout) log.error('[calculateOrderData] calculateOrderData and !currentCheckout');

  const _totalPrice = (currentCheckout || {}).totalPrice || '';
  const _credits = (userData || {}).credits || 0;

  try {
    // make sure two decimal places and are numbers
    let totalPrice = convertFloatFixedTwo(_totalPrice);
    if (totalPrice < 0) totalPrice = 0;
    let credits = convertFloatFixedTwo(_credits);
    if (credits < 0) credits = 0;

    // defaults
    const creditsToRedeem = Math.min(totalPrice, credits);
    let newCredits = convertFloatFixedTwo(credits - creditsToRedeem);
    let newTotal = totalPrice - creditsToRedeem;

    if (newTotal < 0) {
      log.error(`[calculateOrderData] Floating precision is off, ${newTotal}`);
      newTotal = 0.0;
    }

    const data = { totalPrice, credits, newCredits, newTotal, creditsToRedeem };
    process.browser && trackFunnelActionProjectFunnel(`calculated order data`, {totalPrice,credits, newCredits,newTotal, creditsToRedeem});
    return data;
  } catch (err) {
    log.error('[calculateOrderData] error try in calculateOrderData', { err } );
  }
}


export const convertFloatFixedTwo = input => {
  let result = input;
  if (typeof input == 'string') {
    result = parseFloat(input);
  } else if (typeof input == 'number') {
    result = input;
  }

  result = roundNumber(result, 2);
  // log.info(result);
  // log.info(typeof result);
  return result;
}

// https://stackoverflow.com/a/12830454
function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

export const getCurrentCheckout = (userData, mainCartData) => {
  let checkout = mainCartData?.cart

  return checkout;
}
