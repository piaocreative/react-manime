import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import SolidBubblesPanel2 from 'components/design/byn/SolidBubblesPanel2';
import { BannerBox, DescriptionBox, TitleBox } from 'components/design/Common';
import MarketingFooter from 'components/design/MarketingFooter';
import GalleryHeader from 'components/header/GalleryHeader';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import Box from 'components/styled/Box';
import constants from 'constants/index';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { getSolidDrops } from 'lib/airtable';
import { BUILDER_API_KEY } from 'lib/builder';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const hasPhotos = product => product.images && product.images[0];
const isVisible = product => product.visible;
const isNotArchived = product => !product.isarchived;
const hasTag = tag => product => product.tags.includes(tag);
const hasInventory = product => parseInt(product.quantity) > 0;
const isPreviewable = product => product.releasedate > new Date().toISOString();

const production = product => isVisible(product) && hasInventory(product);
const nonProduction = product => hasInventory(product) || isPreviewable(product);

const renderProducts = ({
  products,
  isMobileView,
  dispatchSetCartSideBar,
  dispatchSetUIKeyValue,
  addVariantToCart,
}) =>
  products.map((productInfo, indexPro) => (
    <ProductItem
      isMobileView={isMobileView}
      id={`${productInfo.nailProductId}`}
      key={indexPro}
      productItemData={productInfo}
      allProducts={products}
      dispatchSetUIKeyValue={dispatchSetUIKeyValue}
      dispatchSetCartSideBar={dispatchSetCartSideBar}
      addVariantToCart={addVariantToCart}
    />
  ));

const SolidColorsPage = props => {
  const { err, data, page, asPath } = props;

  const [sortIndex, setSortIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [solidDrops, setSolidDrops] = useState([]);

  useEffect(() => {
    const fetchSolidDrops = async () => {
      const result = await getSolidDrops();
      setSolidDrops(result);
    };
    fetchSolidDrops();
  }, []);

  // TODO: This should result in an object keyed on product ID AND hash for FAST lookups
  const { result: nailProducts, isLoading: loading } = useGetNailProducts();
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  // console.log({solidDrops, err, asPath, APP_URL: process.env.APP_URL, isProduction, nailProducts});

  const products = nailProducts
    .filter(hasTag('Solid choice'))
    .filter(isNotArchived)
    .filter(hasPhotos)
    .filter(constants.isProduction() ? hasInventory : nonProduction);
  let jsx = [];

  products.sort(sortByList[sortIndex].comp);

  const solidDropData = solidDrops
    ?.map(solidDrop => {
      const nailProduct = products.filter(
        product => product.shopifyHandle === solidDrop.fields.Handle
      );
      return { ...solidDrop.fields, ...nailProduct[0] };
    })
    .filter(constants.isProduction() ? production : nonProduction);
  // console.log({at: 'SolidColorsPage', solidDrops, solidDropData})

  const allProductsJsx = renderProducts({
    products,
    sortIndex: 0,
    addVariantToCart: cartFunctions.addVariantToCart,
    dispatchSetCartSideBar: commonDispatchers.dispatchSetCartSideBar,
    dispatchSetUIKeyValue: commonDispatchers.dispatchSetUIKeyValue,
    isMobileView: false,
  });

  const productsJsx =
    tags.length === 0
      ? allProductsJsx
      : allProductsJsx.filter(product =>
          tags.some(tag => product.props.productItemData.tags.includes(tag.tag))
        );

  // console.log({at: 'solid-colors.js', tags, allProductsJsx, productsJsx})

  return (
    <>
      <Head>
        <title>Solid Color Gel Nail Stickers | Stick On Nail Colors | ManiMe</title>
        <meta
          name="keywords"
          content="Nail Strips with Solid Colors, Gel Nail Colors, Color Bright Nails Stick On"
        ></meta>
        <meta
          name="description"
          content="You can't go wrong with our solid color gel nail stickers. Pick from a rainbow of shades for a salon-quality manicure at home."
        ></meta>
        <link rel="canonical" href="https://manime.co/collection/solid-colors" />
        <meta
          name="og:image"
          content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/ManiMe_metadata_banner_solids.jpg?v=1630439696"
        ></meta>
        <meta
          name="twitter:image"
          content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/ManiMe_metadata_banner_solids.jpg?v=1630439696"
        ></meta>
      </Head>
      <GalleryHeader
        hideItems={false}
        pageName="Solid Colors"
        showTopMenu={false}
        sortIndex={sortIndex}
        setSortIndex={setSortIndex}
        tags={tags}
        setTags={setTags}
        displayProductsCount={productsJsx.length}
      />
      <BannerBox
        bg="#f5f5f7"
        mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/solid_3x_266c7e4c-cbc8-451c-994f-d1c8e13e12f9.jpg?v=1630695760"
        desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/solid_3x_d5c0075c-0150-47df-8200-4512f5a9aa6d.jpg?v=1630514342"
      >
        <TitleBox marginTop="0" paddingTop="40px">
          Solid Colors <br />
          <DescriptionBox>Our favorite solid colors. You can't go wrong.</DescriptionBox>
        </TitleBox>
      </BannerBox>
      <SolidBubblesPanel2 productList={solidDropData} isSolidChoice />
      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {productsJsx || <LoadingAnimation isLoading={loading} size={200} height="50vh" />}
      </Box>
      <MarketingFooter title="Explore Our Gel Nail Colors">
        <p>
          Sometimes simple is better. Our nail strips with solid colors make it easy to get a plain
          manicure in your favorite hue. If you always choose solid colors in the salon, this is for
          you. We've got a whole host of soft nude tones. These versatile shades are understated and
          professional, perfect for the office. Subtle pastel shades, like Strawberry Mochi,
          Limoncello and Provence Daze, add a lighthearted pop of color to any outfit. No collection
          of gel nail colors is complete without a few bold pinks and reds, and we have plenty to
          choose from. Whether you want to follow current trends or keep it classic, you'll find a
          shade to suit your taste.{' '}
        </p>
        <p>
          Solid colors can be super versatile and are a great way to add a pop of color to
          monochrome outfits. Don't get us wrong — we're big fans of elaborate nail art too. Our
          collection of{' '}
          <Link href={pageLinks.Collection['Signature'].url}>
            <a>signature designs</a>
          </Link>{' '}
          proves that. But there's just something about simplicity that we can't get enough of.
          Speaking of simple, it's super easy to apply our gel nails. Just stick them on, smooth
          them down and file away any extra. You can add a{' '}
          <Link href={pageLinks.ShopEssentials.url}>
            <a>top coat</a>
          </Link>
          , too, if you're feeling fancy.
        </p>
        <p>
          Gel nail color trends are constantly changing, and we try our best to keep up with them.
          You can see our latest shades on our{' '}
          <Link href={pageLinks.NewProduct.url}>
            <a>new-in page</a>
          </Link>
          . We adore nudes and have them in every shade, but one trend we can't get enough of is
          rainbow brights. Look out for shades of yellow, blue, pink and red in our collection of
          nail strips with solid colors.
        </p>
      </MarketingFooter>
    </>
  );
};

export default ManimeStandardContainer(SolidColorsPage, 'Solid Colors');

export const getStaticProps = async props => {
  const { req, res } = props;
  const builderPage = await builder
    .get('solid-colors-page', {
      req,
      res,
      url: '/collection/solid-colors',
    })
    .promise();

  const globalProps = await getGlobalProps({
    propsToMerge: {
      builderPage: JSON.stringify(builderPage || null),
    },
  });

  return globalProps;
};
