function noop() {
  return '';
}
//const colors = require('./colors.js')
let consoleLogger = require('./console.js');
let sentryLogger = process.browser
  ? require('./sentry.js')
  : { logSentry: noop };
const { format } = require('fecha');
const slack = require('./slack');

const { v4 } = require('uuid');

//const cls = require('continuation-local-storage');
var namespace = undefined;
var inialized = false;

// var winston = require('winston');

let level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'warn';

let winstonLogger = process['winstonLogger'];

let isVerbose = level === 'verbose';
let isHttp = level === 'http' || isVerbose;
let isInfo = level === 'info' || isHttp;
let isWarn = level === 'warn' || isInfo;
let isError = level === 'error' || isWarn;
let isFatal = level === 'fatal' || isError;

let isExpand = process.env.LOG_FULL_EXPAND === 'true';

let _infoLog = undefined;
let _warnLog = undefined;
let _errorLog = undefined;
let _httpLog = undefined;
let _verboseLog = undefined;
let _fatalLog = undefined;

let getCallSource = undefined;

let dev = process.env.NODE_ENV !== 'production';

if (!winstonLogger) {
  winstonLogger = {
    info: noop,
    warn: noop,
    error: noop,
    http: noop,
    verbose: noop,
    fatal: noop,
  };
}

_infoLog = isInfo ? _log : noop;
_warnLog = isWarn ? _log : noop;
_errorLog = isError ? _log : noop;
_httpLog = isHttp ? _log : noop;
_verboseLog = isVerbose ? _log : noop;
_fatalLog = isFatal ? _log : noop;

getCallSource = isVerbose ? _getCallSource : noop;

function _stringify(toStringify, expand) {
  if (!toStringify) {
    return '';
  }

  if (typeof toStringify === 'string') {
    return toStringify;
  }
  let strings = [];
  let space = '';
  let string = '';

  if (expand) {
    for (const [key, value] of Object.entries(toStringify)) {
      strings.push(`${key}: ${JSON.stringify(toStringify[key], null, 2)}`);
    }

    space = '\n';
    string = space + strings.join(`\n`).trim();
  } else {
    string = '';
  }

  return string;
}
function getNamespace() {
  return process['cls']
    ? process['cls'].getNamespace('my request')
    : browserNamespace;
}

const unauthId = v4();
const browserNamespace = process.browser ? {
  get: (arg) => {
    if (!process.GAID) {

      try{
        
        const match = document.cookie.match(/ga=(?<gaid>\S+)/);
        const gaid = ((match || {}).groups || {}).gaid
  
        if (gaid) {
          process.GAID = gaid.replace(';', '');
        } else {
          process.GAID = 'UNKNOWN';
        }
      }catch(error){
        process.GAID = 'UNKNOWN'
      }

    }
    return process.GAID;
  },
} :
{
  get: (arg) => {
    return 'UNKNOWN'
  }
}
function _log(browser, file, output, toStringify = '', expand = isExpand) {
  let callSource = undefined;
  const namespace = getNamespace();

  if (typeof output !== 'string') {
    if (toStringify === '') {
      toStringify = {};
    }
    toStringify.arg1 = output;
  }

  const gaid = namespace.get('user');
  const email = process.EMAIL || 'undefined';

  const time = format(new Date(), 'DD/MM/YY: HH:mm:ss:SSS');

  callSource = getCallSource();
  const stringified = _stringify(toStringify, expand);
  const message = `[${time}] gaid:'${gaid}' email:'${email}' release:'${process.env.RELEASE}' ${callSource} ${output} ${stringified}`;
  browser(message);
  file(message);
  return { gaid, email, message, payloadString: stringified, timestamp: time };
}
/**
 * Log to info level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function info(output, toStringify = undefined, sendToSentry=false) {
  const { gaid, email, timestamp } = _infoLog(
    consoleLogger.info,
    winstonLogger.info,
    output,
    toStringify
  );
  //sendToSentry && sentryLogger.logSentry(`${output}`, timestamp, gaid, email, toStringify, 1);
}
/**
 * Log to fatal level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function fatal(output, toStringify = undefined) {
  const { message, gaid, email, timestamp } = _fatalLog(
    consoleLogger.fatal,
    winstonLogger.fatal,
    output,
    toStringify,
    true
  );
  sentryLogger.logSentry({message:`${output}`, timestamp, gaid, email, payload: toStringify, level: 5});
  const slackAlertOverride = process.env.SLACK_ALERT_OVERRIDE;
  slack.logSlack(slackAlertOverride || '#alerts-and-warnings', message);
}
/**
 * Log to error level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function error(output, toStringify = undefined) {
  const { gaid, email, timestamp } = _errorLog(
    consoleLogger.error,
    winstonLogger.error,
    output,
    toStringify,
    true
  );
  sentryLogger.logSentry({message:`${output}`, timestamp, gaid, email, payload: toStringify});
}
/**
 * Log to warn level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function warn(output, toStringify = undefined) {
  _warnLog(consoleLogger.warn, winstonLogger.warn, output, toStringify);
}
/**
 * Log to verbose level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function verbose(output, toStringify = undefined) {
  _verboseLog(
    consoleLogger.verbose,
    winstonLogger.verbose,
    output,
    toStringify
  );
}
/**
 * Log to http level
 * @param output Message or Object to ouptut
 * @param toStringify Additional object to log
 */
function http(output, toStringify = undefined) {
  _httpLog(consoleLogger.http, winstonLogger.http, output, toStringify);
}

function _getCallSource() {
  // this does not work on all javascript engines. Its very hacky and
  // should never be done on a productoin level ... something like this
  // might work but would need more tightening like tightening the app locaiton
  let orig = new Error().stack;

  let stack = orig.split('\n');
  let start = process.browser && process.env.dev ? 5 : 4;

  let primary = stack[start] ? stack[start].trim() : 'CANNOT DETERMINE';
  let secondary = stack[start + 1]
    ? stack[start + 1].trim()
    : 'CANNOT DETERMINE';

  let fileLocation =
    primary.indexOf('track') == -1
      ? primary.substring(primary.indexOf(' '), primary.indexOf('('))
      : secondary.substring(secondary.indexOf(' '), secondary.indexOf('('));

  return `[${fileLocation.trim()} browser: ${process.browser} ]`;
}

module.exports = {
  fatal,
  error,
  warn,
  info,
  http,
  verbose,
};
