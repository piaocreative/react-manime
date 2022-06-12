import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { useMemo } from 'react';
import Head from 'next/head';
import Box from '../../components/styled/Box';
import ShopifyHOC from 'components/ShopifyHOC';
import GalleryHOC from '../../components/GalleryHOC';
import ProductItem from '../../components/ProductItem';
import { BannerBox, TitleBox, DescriptionBox } from '../../components/design/Common';
import BHMCollection from '../../components/design/redirect-banners/BHMCollection';
import EveryOccasionWithAction from '../../components/design/redirect-banners/EveryOccasionWithAction';
import LoadingAnimation from '../../components/LoadingAnimation';
import { sortByList } from '../../utils/galleryUtils';

const RemixCollection = (props: any) => {
  const { loading } = props;

  const productsJsx = useMemo(() => {
    const { tags, checkProductTags, sortIndex, displayProductsCount, setDisplayProductsCount, isMobileView } = props;
    let { nailProducts } = props;
    nailProducts = nailProducts.filter(product => product.tags.includes('signature-capsule'));
    let jsx = [];
    let productsCount = 0;
    nailProducts.sort(sortByList[sortIndex].comp);

    for (let indexPro = 0; indexPro < nailProducts.length; indexPro++) {
      const productInfo = nailProducts[indexPro];
      const isShowing = tags.length === 0 || checkProductTags(productInfo.tags);
      if (productInfo.images[0]) {
        
        if (isShowing) {
          productsCount ++;
          jsx.push(
            <ProductItem
              isMobileView={isMobileView}
              id={`${productInfo.nailProductId}`}
              key={indexPro}
              productItemData={productInfo}
              allProducts={nailProducts}
              {...props} />
          );
        }
      }
    }
    if (tags.length === 0) {
      jsx.push(<Box key='empty' width={1} />)
      jsx.push(<BHMCollection key='BHMCollection' />);
      jsx.push(<EveryOccasionWithAction key='EveryOccasionWithAction' />)
    }

    if (displayProductsCount !== productsCount)
      setDisplayProductsCount(productsCount);
    return (
      <>
        {jsx}
      </>
    );
  }, [props.tags, props.checkProductTags, props.sortIndex, props.nailProducts, props.isMobileView]);

  return (
    <>
      <Head>
        <title>ManiMe Signature Capsule Collection | Stick On Nail Colors | ManiMe</title>
        <meta name="keywords" content="manis, manicures, stick ons, nail art, designer nails, manime, nature, natural nails, quartz, clouds, gold, silver, white, nude"></meta>
        <meta name="description" content="Two minimal looks inspired by the subtle beauty of natural forms. Whether you’re channeling the airiness of clouds or strength of marble, these stylish designs are inspired by the tranquility felt only in nature."></meta>
      </Head>
      <BannerBox
        bg='#f3eeed'
        mobileURL='https://d1b527uqd0dzcu.cloudfront.net/web/design/collection-banners/signature-capsule-mobile.jpg'
        desktopURL='https://d1b527uqd0dzcu.cloudfront.net/web/design/collection-banners/signature-capsule-desktop.jpg'>
        <TitleBox>
          Signature Capsule <br />
          <DescriptionBox>Freshen up with naturally inspired looks.</DescriptionBox>
        </TitleBox>
      </BannerBox>
      <Box width={1} display='flex' style={{flexWrap: 'wrap'}} justifyContent='flex-start' minHeight={['unset', '600px']}>
        {!loading &&
          productsJsx
        }
        {loading && <LoadingAnimation isLoading={loading} size={200} height='50vh' />}
      </Box>
    </>
  );
}

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(RemixCollection, 'Signature Capsule')));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
