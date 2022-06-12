import { builder, BuilderComponent } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GiftCard from 'components/gift/GiftCard';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';

builder.init(BUILDER_API_KEY);

const GiftCardPage = props => {
  useEffect(() => {
    init(window, document, 'script', 'https://cdn.giftup.app/dist/gift-up.js', 'giftup');

    // Track conversions:
    giftup('conversion', function (payload) {
      var event = {};
      // Specify your Google Tag Manager custom event name here:
      event.event = 'GiftUpConversion';
      // Add any properties that you want from the Gift Up! conversion payload:
      event.GiftUpRevenue = payload.revenue;
      event.GiftUpCodes = payload.giftCards.map(e => e.code).join(',');
      // Fire the Google Tag Manager custom event:
      window['dataLayer'].push(event);
      trackFunnelActionProjectFunnel('[GiftCardPage]', event);
    });
  }, []);

  const init = (g, i, f, t, u, p, s) => {
    g[u] =
      g[u] ||
      function () {
        (g[u].q = g[u].q || []).push(arguments);
      };
    p = i.createElement(f);
    p.src = t;
    s = i.getElementsByTagName(f)[0];
    s.parentNode.insertBefore(p, s);
  };

  return (
    <>
      <Head>
        {/* <meta name="og:image" content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"></meta>
        <meta name="twitter:image" content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"></meta> */}
        <title>ManiMe Gifts | Stick On Gel Nails | Custom Nail Art Design</title>
        <meta name="keywords" content="ManiMe gifts"></meta>
        <meta
          name="description"
          content="Give the gift of perfectly polished nails with ManiMe stick on gel nails. With our custom stickers, you'll be sure to find something for everyone on your list."
        ></meta>
        <link rel="canonical" href="https://manime.co/gift/card" />
      </Head>
      <BuilderComponent model="page" content={props.pageInfo} />
      <GiftCard />
    </>
  );
};

export default ManimeStandardContainer(GiftCardPage);

export const getStaticProps = async ctx => {
  const url = '/gift/card';
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, pageInfo: pageInfo || null },
    });
    return globalProps;
  } catch (err) {
    log.error('[generic page]', err);
    return {
      notFound: true,
    };
  }
};
