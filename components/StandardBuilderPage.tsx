import { builder, BuilderComponent } from '@builder.io/react';
import { BuilderPageHeader } from 'components/design/Common';
import MarketingFooter from 'components/design/MarketingFooter';
import SitePromotions from 'components/design/redirect-banners/SitePromotions';
import LoadingAnimation from 'components/LoadingAnimation';
import PageHead from 'components/PageHead';
import { BUILDER_API_KEY } from 'lib/builder';

builder.init(BUILDER_API_KEY);

const StandardBuilderPage = props => {
  const { pageInfo, children, loading } = props;

  return (
    <>
      <PageHead pageInfo={pageInfo} />
      <BuilderComponent model="page" content={pageInfo} />
      <BuilderPageHeader pageInfo={pageInfo} />
      {loading ? <LoadingAnimation isLoading={loading} size={200} height="50vh" /> : children}
      <SitePromotions pageInfo={pageInfo} />
      <MarketingFooter pageInfo={pageInfo} />
    </>
  );
};

export default StandardBuilderPage;
