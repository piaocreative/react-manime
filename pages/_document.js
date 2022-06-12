import Document, { Head, Main, NextScript, Html } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import * as Sentry from '@sentry/browser';
import GorgiasChatWidget from 'components/GorgiasChatWidget'



process.on('unhandledRejection', (err) => {
  Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
});




export default class MyDocument extends Document {

  constructor(props){
    super(props)
  }
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const { renderPage, path, req, res, } = ctx;
    try{


      const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
      const initialProps = await Document.getInitialProps(ctx);
      const styles = (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )
  
  
      return { ...page, styles, path, req, res };
    }finally{
      sheet.seal()
    }


  }


  render() {
    
  //  log.verbose(`rendering path: ${this.props.req.url}`, )


    return (
      <Html style={{ width: '100%' }}>
        <Head>
          {this.props.styleTags}
          <style>
            {`#__next {
                width: 100%;
              }
              * {
                box-sizing: border-box;
              }
              .StripeElement {

                width: 100%;
                height: 40px;
                padding: 10px 12px;
                border: 1px solid transparent;
                border-radius: 4px;
                background-color: white;
                box-shadow: 0 1px 3px 0 #e6ebf1;
                font-size: 16px;
                -webkit-transition: box-shadow 150ms ease;
                transition: box-shadow 150ms ease;
              }

              .StripeElement--focus {
                box-shadow: 0 1px 3px 0 #cfd7df;
              }

              .StripeElement--invalid {
                border-color: #fa755a;
              }

              .StripeElement--webkit-autofill {
                background-color: #fefde5 !important;
              }
              `}
          </style>

          <link rel='icon' type='image/x-icon' href='/static/favicon3.ico' as='font'  crossOrigin="anonymous"/>
          <link rel='preload' href='/static/fonts/AvenirLTStd-Black.otf' as='font' crossOrigin="anonymous" />
          <link rel='preload' href='/static/fonts/AvenirLTStd-Heavy.otf' as='font'  crossOrigin="anonymous"/>
          <link rel='preload' href='/static/fonts/AvenirLTStd-Light.otf' as='font'  crossOrigin="anonymous"/>
          <link rel='preload' href='/static/fonts/AvenirLTStd-Medium.otf' as='font'  crossOrigin="anonymous"/>
          <link rel='preload' href='/static/base.css' as='style' />
          <link rel='preload' href='https://apps.elfsight.com/p/platform.js' as='script' />  
          <link rel='preload' href='https://js.stripe.com/v3/' as='script' />  

          <link rel='stylesheet' href='/static/base.css' />
          <link rel='stylesheet' href='/static/slick.min.css' />
          <link rel='stylesheet' href='/static/slick-theme.min.css' />
          <script src="https://apps.elfsight.com/p/platform.js" defer />
          <script src="https://js.stripe.com/v3/" defer />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,
              0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
              for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
              MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
              mixpanel.init("8134d6c6c56a60b0d5d08161b8fdd229");
              mixpanel.init("e704576d827bdf609a8622b1b4ebe119", {}, "funnel");
              mixpanel.init("99eff3711031f6efb088cb50ebc04798", {}, "abtest");
            `
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=!0, e.src="//staticw2.yotpo.com/scRvYdSnTYwg3tUwkB6TyOUDMppywLo9cgGAl73v/widget.js";var t=document.getElementsByTagName("script")[0]; t.parentNode.insertBefore(e,t)})();
              `
            }}
          />          
          {/* Facebook Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '688455561647909');
              fbq('track', 'PageView');
            `
            }}
          />

          <script
            dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:1616844,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `
          }}
          />

          {
            (process.env.SUPRESS_GTM !== 'true') &&
              <>
              <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K7ZXRG7');
            `
            }}
          />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139133109-1"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-139133109-1', { 'optimize_id': 'GTM-W6MSLFT'});
              `
            }}
          />
              </>
          }
          

          <noscript>
            <img height="1" width="1"
            src="https://www.facebook.com/tr?id=688455561647909&amp;ev=PageView&amp;noscript=1" />
          </noscript>
          {/* End Facebook Pixel Code */}
          
        </Head>

        <body style={{ margin: 0, width: '100%' }}>
          <div id='loading-modal' />

          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K7ZXRG7"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          <Main />
          <NextScript />

        </body>
      </Html>
    );
  }
}

