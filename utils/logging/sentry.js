import * as Sentry from '@sentry/browser';

function _logSentry({message, timestamp, gaid, email, payload, level = 3}) {


    //trackFunnelActionProjectFunnel(`[ERROR]${message}`, payload);
    let _level = Sentry.Severity.Error;
    switch(level){
        case 5: 
        _level = Sentry.Severity.Fatal;
            break;
        case 1: 
        _level = Sentry.Severity.Info;
            break;
        case 2:    
        _level = Sentry.Severity.Warning;
            break;
        default:
            _level = Sentry.Severity.Error;
            break;
    }

    const identityId = mixpanel && mixpanel.funnel && mixpanel.funnel.get_distinct_id ? mixpanel.funnel.get_distinct_id() : '';

    const release = process.env.RELEASE || "INITIAL"

    Sentry.configureScope((scope) => {
        scope.setExtra('payload', payload);
        scope.setExtra('IdentityId', `${identityId}`)
        scope.setExtra('BrowserTimestamp', timestamp)
        scope.setLevel(_level);
        scope.setUser({id:gaid, email})

        if(level >=3){
            Sentry.captureException(new Error(`${message}` ))
        }else{
            scope.setExtra('level',_level)
            Sentry.captureMessage(`${message}`)
        }
        scope.clear();

    });
};


var temp = process.env.SENTRY_ENABLED==='true' ? _logSentry: ()=>{}


export const logSentry = temp



