import { builder } from '@builder.io/react';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import LoadingAnimation from 'components/LoadingAnimation';
import PageHead from 'components/PageHead';
import ProductItem from 'components/ProductItem';
import BundlePanel from 'components/design/BundlePanel_V2';
import MarketingFooter from 'components/design/MarketingFooter';
import BYNCountDown from 'components/design/byn/BYNCountDown.js';
import CollectionSection from 'components/sections/CollectionSection';
import EssentialsSection from 'components/sections/EssentialsSection';
import MonthlySolidSection from 'components/sections/MonthlySolidSection';
import SolidSection from 'components/sections/SolidSection';
import TaggedProductsSection from 'components/sections/TaggedProductsSection';
import Box from 'components/styled/Box';

import { visibleBundlesOnGallery } from 'config/config-local';

import { BUILDER_API_KEY } from 'lib/builder';

import { sortByList } from 'utils/galleryUtils';

const onlyProductType = productType => product => product.productType === productType;
const isNotArchived = product => !product.isArchived;
const excludeTag = tag => product => !product.tags.includes(tag);
const doNothing = _ => true;

builder.init(BUILDER_API_KEY);

const ShopPageContent = props => {
  const {
    loading,
    tags,
    checkProductTags,
    sortIndex,
    displayProductsCount,
    setDisplayProductsCount,
    isMobileView,
    addVariantToCart,
    dispatchSetCartSideBar,
    dispatchSetUIKeyValue,
    productType,
    isPedis,
    url,
  } = props;

  const pageInfo = JSON.parse(props.pageInfo || null);
  const sections = JSON.parse(props.sections);
  const collectionData = JSON.parse(props.globalProps.collectionData);

  const pageData = pageInfo?.data;
  const seoTitle = pageData?.title;
  const seoDescription = pageData?.description;
  const seoKeywords = pageData?.keywords;
  const seoLinkImage = pageData?.pageLinkImage || pageData?.pageLinkImageUrl;

  const marketingFooterTitle = pageData?.marketingFooterTitle || 'missing';
  const marketingFooterText = pageData?.marketingFooterText || 'missing';

  let { nailProducts = [] } = props;

  // console.log({ pageInfo, sections, nailProducts });

  nailProducts = nailProducts
    .filter(productType ? onlyProductType(productType) : doNothing)
    .filter(isNotArchived)
    .filter(excludeTag('ManiMe Bundle'))
    .filter(excludeTag('Not Shop All'))
    .sort(sortByList[sortIndex].comp);

  if (tags.length > 0) {
    nailProducts = nailProducts
      .filter(product => checkProductTags(product.tags))
      .filter(isNotArchived)
      .filter(excludeTag('ManiMe Bundle'))
      .filter(excludeTag('Not Shop All'));
    if (displayProductsCount !== nailProducts.length) setDisplayProductsCount(nailProducts.length);
  } else {
    if (displayProductsCount !== nailProducts.length + visibleBundlesOnGallery)
      setDisplayProductsCount(nailProducts.length + visibleBundlesOnGallery);
  }

  const outputCollectionSection = ({ section }) =>
    collectionData[section.fields['Section Name']] ? (
      <CollectionSection
        key={section.fields['Section Name']}
        collection={collectionData[section.fields['Section Name']]}
        productType={productType}
        section={section}
      />
    ) : (
      <div key={section.fields['Section Name']}>
        MISMATCHED Collection {section.fields['Section Name']}
      </div>
    );

  const outputSolidsSection = ({ section }) => (
    <MonthlySolidSection
      key={section.fields['Section Name']}
      isMobileView={isMobileView}
      month={section.fields['Section Title']}
      tag={section.fields['Shopify Tag']}
      isPedis={isPedis}
      productType={productType}
      section={section}
    />
  );

  const outputTaggedProductsSection = ({ section }) => (
    <TaggedProductsSection
      key={section.fields['Section Name']}
      productType={productType}
      section={section}
    />
  );

  const outputAllSolidsSection = ({ section }) => (
    <SolidSection
      key={section.fields['Section Name']}
      isMobileView={isMobileView}
      productType={productType}
      isPedis={isPedis}
      section={section}
    />
  );

  const outputOtherSection = ({ section, products }) => {
    // console.log({at: 'outputOtherSection', section});
    switch (section.fields['Section Name']) {
      case 'Nude Bubbles':
        return <BYNCountDown key={section.fields['Section Name']} section={section} />;
      case 'Bundles':
        return (
          <BundlePanel
            {...props}
            key={section.fields['Section Name']}
            hideSignature
            section={section}
          />
        );
      case 'Essentials':
        return (
          <EssentialsSection
            {...props}
            key={section.fields['Section Name']}
            products={products}
            section={section}
          />
        );
    }
  };

  const outputSectionType = {
    Collection: outputCollectionSection,
    Solids: outputSolidsSection,
    'Tagged Products': outputTaggedProductsSection,
    'All Solids': outputAllSolidsSection,
    Other: outputOtherSection,
  };

  const outputSection = ({ section, products }) =>
    outputSectionType[section.fields['Section Type']] ? (
      outputSectionType[section.fields['Section Type']]({ section, products })
    ) : (
      <div>
        {section.fields['Section Name']}
        {section.fields['Section Type']}
      </div>
    );

  const outputAllSections = ({ sections, products }) =>
    sections.map(section => outputSection({ section, products }));

  // console.log({ sections })

  return (
    <>
      <PageHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={url}
        image={seoLinkImage}
      />

      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {loading && <LoadingAnimation isLoading={loading} size={200} height="50vh" />}

        {!loading &&
          sortIndex === 0 &&
          tags.length === 0 &&
          outputAllSections({ sections, products: nailProducts })}

        {!loading &&
          (sortIndex !== 0 || tags.length > 0) &&
          nailProducts.map((product, index) => {
            return (
              <ProductItem
                isMobileView={isMobileView}
                id={`${product.nailProductId}`}
                key={index}
                productItemData={product}
                addVariantToCart={addVariantToCart}
                dispatchSetCartSideBar={dispatchSetCartSideBar}
                dispatchSetUIKeyValue={dispatchSetUIKeyValue}
              />
            );
          })}
      </Box>
      <MarketingFooter title={marketingFooterTitle}>
        {ReactHtmlParser(marketingFooterText)}
      </MarketingFooter>
    </>
  );
};

export default ShopPageContent;
