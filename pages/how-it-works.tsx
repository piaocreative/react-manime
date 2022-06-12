import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import HowToApplyVideo from 'components/howto/apply/HowToApplyVideo';
import HowToFAQSection from 'components/howto/apply/HowToFAQSection';
import HowToSwitch from 'components/howto/apply/HowToSwitch';
import HowToApplyProSection from 'components/howto/work/HowToApplyProSection';
import HowToWelcomeSection from 'components/howto/work/HowToWelcomeSection';
import HowToWelcomeTitle from 'components/howto/work/HowToWelcomeTitle';
import HowToYouGetSection from 'components/howto/work/HowToYouGetSection';
import LoadingAnimation from 'components/LoadingAnimation';
import StandardBuilderPage from 'components/StandardBuilderPage';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React from 'react';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const HowItWorks = props => {
  const { loading } = props;
  const pageInfo = JSON.parse(props.pageInfo || null);
  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {loading ? (
        <LoadingAnimation isLoading={loading} size={200} height="50vh" />
      ) : (
        <>
          <HowToSwitch isWork />
          <HowToApplyVideo isWork />
          <HowToWelcomeTitle />
          <HowToWelcomeSection />
          <HowToYouGetSection />
          <HowToApplyProSection />
          <HowToFAQSection isLanding={false} />
        </>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.HowItWorks.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
    },
  });
  return props;
};

export default ManimeStandardContainer(HowItWorks);
