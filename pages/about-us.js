import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import StandardBuilderPage from 'components/StandardBuilderPage';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React from 'react';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const AboutUsPage = props => {
  const pageInfo = JSON.parse(props?.pageInfo || {});

  return <StandardBuilderPage pageInfo={pageInfo} />;
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.AboutUs.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(AboutUsPage);
