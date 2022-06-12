import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import { BannerBox, DescriptionBox, TitleBox } from 'components/design/Common';
import MarketingFooter from 'components/design/MarketingFooter';
import EveryOccasionWithAction from 'components/design/redirect-banners/EveryOccasionWithAction';
import SpringAir from 'components/design/redirect-banners/SpringAir';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import Box from 'components/styled/Box';
import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

const SignatureProducts = props => {
  const [productType, setProductType] = useState(null);
  const { loading } = props;

  const renderProducts = useCallback(
    productType => {
      const {
        tags,
        checkProductTags,
        sortIndex,
        displayProductsCount,
        setDisplayProductsCount,
        isMobileView,
      } = props;
      let { nailProducts } = props;
      // nailProducts = nailProducts.filter(product => !product.tags.includes('ManiMe Bundle'));
      let jsx = [];
      let productsCount = 0;

      nailProducts.sort(sortByList[sortIndex].comp);

      for (let indexPro = 0; indexPro < nailProducts.length; indexPro++) {
        const productInfo = nailProducts[indexPro];
        const isShowing = tags.length === 0 || checkProductTags(productInfo.tags);
        if (
          productInfo.images[0] &&
          (productInfo.tags.includes('signature') || productInfo.tags.includes('signature-capsule'))
        ) {
          if (isShowing && (!productType || productInfo.productType === productType)) {
            productsCount++;
            jsx.push(
              <ProductItem
                isMobileView={isMobileView}
                id={`${productInfo.nailProductId}`}
                key={indexPro}
                productItemData={productInfo}
                allProducts={nailProducts}
                {...props}
              />
            );
          }
        }
      }
      if (tags.length === 0) {
        jsx.push(<Box key="empty" width={1} />);
        jsx.push(<SpringAir key="SpringAir" />);
        jsx.push(<EveryOccasionWithAction key="EveryOccasionWithAction" />);
      }

      if (displayProductsCount !== productsCount) setDisplayProductsCount(productsCount);
      return <>{jsx}</>;
    },
    [props.tags, props.checkProductTags, props.sortIndex, props.nailProducts, props.isMobileView]
  );

  const productsJsx = useMemo(
    () => renderProducts(),
    [props.tags, props.sortIndex, props.nailProducts, props.isMobileView]
  );

  return (
    <>
      <Head>
        {/* <meta name="og:image" content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"></meta>
        <meta name="twitter:image" content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"></meta> */}
        <title>Signature Press On Nails | Stick On Gel Nail Designs | ManiMe</title>
        <meta
          name="keywords"
          content="Gel Nail Polish Designs, Press On Nail Designs, Nail Design Stick On"
        ></meta>
        <meta
          name="description"
          content="Our signature series of press on gel nails are designed specially for you. This selection of solid and patterned stickers is sure to please."
        ></meta>
        <link rel="canonical" href="https://manime.co/collection/signature" />
      </Head>
      <BannerBox
        bg="#f0e8e2"
        mobileURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/collection-banners/signature-mobile-v2.jpg"
        desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/collection-banners/signature-desktop-v2.jpg"
      >
        <TitleBox>
          Signature <br />
          <DescriptionBox>Designed by Me, specially for You.</DescriptionBox>
        </TitleBox>
      </BannerBox>
      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {
          !loading && productsJsx
          // renderProducts(productType)
        }
        {loading && <LoadingAnimation isLoading={loading} size={200} height="50vh" />}
      </Box>
      <MarketingFooter title="Signature Gel Nail Polish Designs">
        <p>
          Get the perfect mani-pedi with our Signature collection of gel on nail designs. From
          eye-catching artwork to must-try shades, our collection of custom nails is exclusive to
          ManiMe. Good nail artists know it's important to keep up with the latest trends. When you
          do your manicure at home, it can mean missing out on conversations about what's hot right
          now. Luckily, we're here to help. The Signature collection features a range of on-trend
          designs that we've created. Choose from minimalist nail art,{' '}
          <Link href={pageLinks.Collection['Solid Colors'].url}>
            <a>statement solids</a>
          </Link>{' '}
          and playful twists on the classic French manicure to find a stylish look perfect for this
          season.
        </p>
        <p>
          These gel nail polish designs don't take a long time to achieve. Unlike salons, where you
          need to sit in the chair while layer after layer of gel is applied and cured under UV
          light, our press on nails are much easier to apply. Simply send us a photo of your hands
          so we can check your size, and we'll send you your chosen gel nail polish designs in the
          mail. To apply them, simply stick them on clean nails, smooth them out and file away the
          excess.
        </p>
        <p>
          Our signature{' '}
          <Link href={pageLinks.SetupManiDesign.url}>
            <a>manicures</a>
          </Link>{' '}
          and{' '}
          <Link href={pageLinks.SetupPediDesign.url}>
            <a>pedicures</a>
          </Link>{' '}
          don't just look professional — they feel professional, too. They have all the strength and
          durability of standard gel. If you care for them properly they'll last weeks without
          chipping. They're tough enough to handle everything life throws at it, from long sessions
          in the gym to steamy showers afterwards. Once they start to grow out, simply peel them
          off. It won't damage your nail and it's totally pain-free.
        </p>
      </MarketingFooter>
    </>
  );
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(SignatureProducts, 'Signature')));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
