import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { pageLinks } from 'utils/links';

export default function GorgiasChatWidget(props) {
  const [widget, setWidget] = useState(null);
  const router = useRouter();

  function loadGorgiasChat () {
    const win = window as any;
    window['GORGIAS_SENTRY_ENABLED'] = false;
    (win.GORGIAS_CHAT_APP_ID = '5767'),
      (win.GORGIAS_CHAT_BASE_URL = 'us-east1-898b.production.gorgias.chat'),
      (win.GORGIAS_API_BASE_URL = 'config.gorgias.chat');
    var e = new XMLHttpRequest();
    e.open('GET', 'https://config.gorgias.chat/applications/5767', !0),
      (e.onload = function (t) {
        if (4 === e.readyState)
          if (200 === e.status) {
            var n = JSON.parse(e.responseText);
            if (!n.application || !n.bundleVersion)
              throw new Error(
                'Missing fields in the response body - https://config.gorgias.chat/applications/5767'
              );
            if (
              ((win.GORGIAS_CHAT_APP = n.application),
              (win.GORGIAS_CHAT_BUNDLE_VERSION = n.bundleVersion),
              n && n.texts && (win.GORGIAS_CHAT_TEXTS = n.texts),
              n &&
                n.sspTexts &&
                (win.GORGIAS_CHAT_SELF_SERVICE_PORTAL_TEXTS = n.sspTexts),
              !document.getElementById('gorgias-chat-container'))
            ) {
              var o = document.createElement('div');
              (o.id = 'gorgias-chat-container'), document.body.appendChild(o);
              var r = document.createElement('script');
              r.setAttribute('defer', 'true'),
                (r.src =
                  'https://client-builds.production.gorgias.chat/{bundleVersion}/static/js/main.js'.replace(
                    '{bundleVersion}',
                    n.bundleVersion
                  )),
                document.body.appendChild(r);
            }
          } else
            console.error(
              'Failed request GET - https://config.gorgias.chat/applications/5767'
            );
      }),
      (e.onerror = function (_) {
        console.error(_);
      }),
      e.send();
  };
  

  useEffect(() => {
    process.env.SUPRESS_GORGIAS === 'true' || setTimeout(loadGorgiasChat, 3000);
  }, []);

  useEffect(()=>{
    const ignoreList = [
      pageLinks.ManiFitting.url,
      pageLinks.PediFitting.url,
      pageLinks.Refit.url,
      'gift/group',
      'my-fit'
    ];
    const chatContainer = document.getElementById('gorgias-chat-container');
    
    if(!chatContainer){
      return
    }

    const hasMatch = ignoreList.find((value) =>
      router.pathname?.includes(value)
    );

    

    chatContainer.style.display = hasMatch ? 'none' : 'inline';
  }, [router.pathname])
  
  return <></>;
}
