import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GalleryHOC from 'components/GalleryHOC';
import ShopifyHOC from 'components/ShopifyHOC';
import ShopPageContent from 'components/ShopPageContent';
import { getShopPageSections } from 'lib/airtable';
import { resolveBuilderContent } from 'lib/builder';
import React from 'react';
import { pageLinks } from 'utils/links';

const url = pageLinks.SetupDesign.url;
const isPedis = false;
const productType = null;

const ShopAll = props => (
  <ShopPageContent {...props} isPedis={isPedis} productType={productType} url={url} />
);

export const getStaticProps = async ({ req, res }) => {
  const sections = await getShopPageSections();
  const pageInfo = await resolveBuilderContent('page', { urlPath: '/shop' });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      sections: JSON.stringify(
        sections?.filter(row => !row.fields['Exclude Pages']?.includes(productType))
      ),
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(ShopAll, 'All')));
