function getQueryParam(url, param) {
  // Expects a raw URL
  param = param.replace(/[[]/, '[').replace(/[]]/, ']');
  var regexS = '[?&]' + param + '=([^&#]*)',
    regex = new RegExp(regexS),
    results = regex.exec(url);
  if (
    results === null ||
    (results && typeof results[1] !== 'string' && results[1].length)
  ) {
    return '';
  } else {
    return decodeURIComponent(results[1]).replace(/\W/gi, ' ');
  }
}
export default function campaignParams() {
  try {
    var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(
        ' '
      ),
      kw = '',
      params = {},
      first_params = {};
    var index;
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(document.URL, campaign_keywords[index]);
      if (kw.length) {
        params[campaign_keywords[index] + ' [last touch]'] = kw;
      }
    }
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(document.URL, campaign_keywords[index]);
      if (kw.length) {
        first_params[campaign_keywords[index] + ' [first touch]'] = kw;
      }
    }
    const referral = (new URL(document.URL)).searchParams.get('referral');
    if (referral) first_params['referral [first touch]'] = document.URL;
    // log.info('referral', referral);
    mixpanel.funnel.people.set(params);
    mixpanel.funnel.people.set_once(first_params);
    mixpanel.funnel.register(params);
  } catch (err) {
    log.error(`[lastTouchUTM][campaignParams] ${err}`, {err});
  }
}
