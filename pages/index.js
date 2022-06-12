import { builder, BuilderComponent } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import PageHead from 'components/PageHead';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import dynamic from 'next/dynamic';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import LazyLoadComponent from 'react-lazy-load';

builder.init(BUILDER_API_KEY);

const LandingPage = props => {
  const pageInfo = JSON.parse(props?.pageInfo);
  const marketingFooterTitle = pageInfo?.data?.marketingFooterTitle || 'missing';
  const marketingFooterText = pageInfo?.data?.marketingFooterText || 'missing';

  const isNew = true;

  function LazyView() {
    const MarketingFooter = dynamic(() => import('../components/design/MarketingFooter'));
    let LandingPage = undefined;
    if (isNew) {
      LandingPage = dynamic(() => import('../components/landing/landing-v1/LandingPageV1'));
    } else {
      LandingPage = dynamic(() => import('../components/landing/LandingPage'));
    }

    return (
      <div id="homepage-render">
        <LazyLoadComponent offset={300}>
          <LandingPage isMobileView={props.isMobileView} globalProps={props.globalProps} />
        </LazyLoadComponent>

        <MarketingFooter title={marketingFooterTitle}>
          {ReactHtmlParser(marketingFooterText)}
        </MarketingFooter>
      </div>
    );
  }

  return (
    <>
      <PageHead pageInfo={pageInfo} />
      <div style={{ position: 'relative' }}>
        <BuilderComponent model="page" content={pageInfo} />
        <LazyView />
      </div>
    </>
  );
};

export const getStaticProps = async ({ res, req }) => {
  const pageInfo = await resolveBuilderContent('page', { urlPath: '/' });

  const globalProps = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo),
    },
  });

  return globalProps;
};

export default ManimeStandardContainer(LandingPage);
