import { isDevMode } from './generalHelpers';
import { trackFunnelActionProjectFunnel } from './track';

const MAX_RETRIES = 10;
const INTERVAL = 250;
const EXPONENTIAL_FACTOR = 2;

function retryTrack(message, retryCount, result, args) {
  const retryText = ` - [Success] Retry [${retryCount}]`;
  trackFunnelActionProjectFunnel(`${message}${retryText}`, { result, args });
}

function retryErrorTrack(message, retryCount, err, maxRetries = MAX_RETRIES, args) {
  const retryText = retryCount == 0
    ? `` : ` - [Fail] Retry [${retryCount}]`;
  if (retryCount === maxRetries) {
    log.error(`[retry] ${message}${retryText} ${err}`, { err, args }  );
  } else if (retryCount > 5) {
    log.error(`[retry] ${message}${retryText} ${err}`, { err, args } );
  } else {
    trackFunnelActionProjectFunnel(`${message}${retryText}`, { error: err, args });
  }
}

export function retryPromise(functionToRetry, _args, message, _interval, _maxRetries, _exponentialFactor) {
  const initInterval = _interval ? _interval : INTERVAL;
  const initMaxRetries = _maxRetries ? _maxRetries : MAX_RETRIES;
  const initExponentialFactor = _exponentialFactor ? _exponentialFactor : EXPONENTIAL_FACTOR;

  let args = _args;
  if (!message || typeof message !== 'string') return;
  if (!_args || !Array.isArray(_args)) args = [];
  return new Promise((resolve, reject) => {
    let success = false;

    function recursiveFunction(retryCount, args, interval) {
      // NOTE: pass arguments to retry
      functionToRetry.apply(null, args)
      .then(res => {
        success = true;
        retryTrack(message, retryCount, res, args);
        resolve(res);
      })
      .catch(err => {
        success = false;
        retryErrorTrack(message, retryCount, err, initMaxRetries, args);
      })
      .finally(() => {
        setTimeout(() => {
          if (success) return;
          else if (retryCount < initMaxRetries) recursiveFunction(retryCount + 1, args, interval * initExponentialFactor);
          else reject('[utils][retryPromise] all retries failed');
        }, interval);
      })
    }

    recursiveFunction(0, args, initInterval);
  });
}
