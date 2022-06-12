# Welcome to manime Logging

## How to use 
```
import log from "./utils/logging"

const someObject = {keyA: "valueA", keyB: "valueB"}
log.info("some string", someObject)
```


The system is set up to inject the appropriate logger whether the code is executing on browser or server. Loggers may are
 - _console_ 
 - _file system_
 - _Sentry.io_

System allows you to specify which logging levelel you want to use. Levels are tiered, so setting logger to level verbose will log everything as log.verbose and lower. The levels are as follows

Level | Notes
---- | ----
fatal | Lowest level calling this will also send log to Sentry.io AND generate a Slack alert. Should be used if error needs immediate attention
error | General errors. May not require immediate attention but should be tracked by Sentry.io
warn | Odd conditions but not unexpected. These will not be sent to Sentry.io
info | Normal logging, should be used to give visibility that code is working normally and being called. Not sent to Sentry.io
http | Access level logging, only should be used by server.js or _document.js
verbose | This is for debugging in the place of console.log, will help developers by outputting log values but don't want the noise in a production environment. 


## Configuration
The following are the .env params and what they may be set to 

Setting | Purpose | Values | Default
------------ | ------------- | --------- | -------------
RELEASE_LABEL | Used to indicate what label to use when building the RELEASE tag. | any string  | local
RELEASE | Used in logging to Sentry, you should never need to update this. It is automatically created and incremented with each build. | Updated with each build | no default
SENTRY_ENABLED | Whether or not to log to Sentry. Allows a dev to enable sentry logging in a dev env to test new sentry logs | true false | false
LOG_LEVEL | Set the log level you want to use | verbose http info warn error fatal | warn
LOG_SERVER_CONSOLE | Set wether to log server (EG: Next.js logs) to console. Good for local development | true false | false
