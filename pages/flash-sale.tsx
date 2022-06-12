import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import CountDownPanel from 'components/count-down/CountDownPanel';
import { DescriptionBox, FlashSaleBannerBox, TitleBox } from 'components/design/Common';
import BHMCollection from 'components/design/redirect-banners/BHMCollection';
import EveryOccasionWithAction from 'components/design/redirect-banners/EveryOccasionWithAction';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import Box from 'components/styled/Box';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { sortByList } from 'utils/galleryUtils';

const FlashSalePage = (props: any) => {
  const { loading } = props;

  const productsJsx = useMemo(() => {
    const {
      tags,
      checkProductTags,
      sortIndex,
      displayProductsCount,
      setDisplayProductsCount,
      isMobileView,
    } = props;
    let { nailProducts } = props;
    nailProducts = nailProducts.filter(product => product.tags.includes('flash-sale'));
    let jsx = [];
    let productsCount = 0;
    nailProducts.sort(sortByList[sortIndex].comp);

    for (let indexPro = 0; indexPro < nailProducts.length; indexPro++) {
      const productInfo = nailProducts[indexPro];
      const isShowing = tags.length === 0 || checkProductTags(productInfo.tags);
      if (productInfo.images[0]) {
        const isOutOfStock = parseInt(nailProducts[indexPro].quantity || 0) <= 0;

        if (isShowing) {
          productsCount++;
          jsx.push(
            <ProductItem
              isMobileView={isMobileView}
              id={`${productInfo.nailProductId}`}
              key={indexPro}
              productItemData={productInfo}
              allProducts={nailProducts}
              isOutOfStock={isOutOfStock}
              {...props}
            />
          );
        }
      }
    }
    if (tags.length === 0) {
      jsx.push(<Box key="empty" width={1} />);
      jsx.push(<BHMCollection key="BHMCollection" />);
      jsx.push(<EveryOccasionWithAction key="EveryOccasionWithAction" />);
    }

    if (displayProductsCount !== productsCount) setDisplayProductsCount(productsCount);
    return <>{jsx}</>;
  }, [props.tags, props.checkProductTags, props.sortIndex, props.nailProducts, props.isMobileView]);

  return (
    <>
      <Head>
        <title>ManiMe Flash Sale | Stick On Nail Colors | ManiMe</title>
        <meta
          name="keywords"
          content="Sale, Flash, Flash Sale, Manicures, Nail art, manis, stick ons, stick on gels"
        ></meta>
        <meta
          name="description"
          content="End of Summer Sale. Buy 2 Manis, Get 1 Pedi FREE! — Grab your favorite manis and pedis from these select designs before they are gone."
        ></meta>
      </Head>
      <FlashSaleBannerBox bg="#d30047">
        <TitleBox
          color="#fff"
          style={{ textTransform: 'uppercase', marginLeft: 24, marginRight: 24 }}
        >
          Flash Sale <br />
          <DescriptionBox color="#fff">
            End of Summer Sale. Buy 2 Manis, Get 1 Pedi FREE!
            <br />
            Grab your favorite manis and pedis from these select designs before they are gone.
          </DescriptionBox>
        </TitleBox>
        <CountDownPanel timerMonth={8} timerDay={24} />
      </FlashSaleBannerBox>
      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {!loading && productsJsx}
        {loading && <LoadingAnimation isLoading={loading} size={200} height="50vh" />}
      </Box>
    </>
  );
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(FlashSalePage, 'Flash Sale')));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
