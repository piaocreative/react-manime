import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import StandardBuilderPage from 'components/StandardBuilderPage';
import { PageContainer } from 'components/styled/StyledComponents';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React from 'react';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const FAQ = props => {
  const pageInfo = JSON.parse(props?.pageInfo || {});

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      <PageContainer>
        <div className="elfsight-app-8ce9d922-d6e0-4670-99d9-9978c36b0fca"></div>
      </PageContainer>
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.Faq.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(FAQ);
