import { builder, BuilderComponent } from '@builder.io/react';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import { getNailProductsByType } from 'api/product';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GiftShortBanner from 'components/gift/GiftShortBanner';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem, { DisplayMode } from 'components/ProductItem';
import Box from 'components/styled/Box';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Product } from 'types';
import { compareBySortOrderShopPage } from 'utils/galleryUtils.js';
import log from 'utils/logging';

builder.init(BUILDER_API_KEY);

const peach = '#ebb3a6';
const blue = '#2c4349';
const HeaderBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 26px 0;
  font-family: avenirLight;
  font-size: 23px;
  letter-spacing: 3.83px;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/gift/gifting-banner-mobile-v2.jpg');
  min-height: 134px;
  word-break: keep-all;
  @media (min-width: 1024px) {
    align-items: flex-start;
    background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/gift/gifting-banner-desktop-v2.jpg');
    font-size: 28px;
    min-height: 188px;
    padding: 0 120px;
  }
`;

// small change for auto build

const SubHeaderBox = styled(Box)`
  font-family: AvenirLight;
  font-size: 12px;
  line-height: 1.67;
  letter-spacing: 0.67px;
  text-align: center;
  width: 70%;

  padding-top: 10px;
  margin: 0;
  @media (min-width: 1024px) {
    padding-top: 16px;
    text-align: left;
    width: 100%;
  }
`;

const StepOneBox = styled(Box)`
  font-family: Avenir;
  font-size: 12px;
  line-height: 1.67;
  letter-spacing: 4px;

  color: ${peach};
`;

const ChoiceBox = styled(Box)`
  font-family: avenirHeavy;
  font-size: 14px;
  font-weight: 900;
  padding-top: 10px;
  line-height: 1.67;
  letter-spacing: 3px;
  color: #2c4349;
  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;
const SectionTwo = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
`;

const RedeemSection = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: avenirBook;
  font-size: 12px;
  letter-spacing: 1px;
  text-align: center;
  color: ${blue};
  margin-top: -10px;
  margin-bottom: 30px;
  @media (min-width: 1024px) {
    flex-direction: row;
    font-size: 14px;
    & div {
      padding: 0 4px;
    }
  }
`;
const StepsSection = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: avenirBook;
  font-size: 12px;
  letter-spacing: 1px;
  text-align: center;
  background-color: ${blue};
  color: #fff;
  padding-left: 28px;
  padding-right: 28px;
  padding-bottom: 40px;
  margin: 0 12px;

  @media (min-width: 1024px) {
    font-size: 14px;
    margin: 0;
  }
`;
const StepsBox = styled(Box)`
  color: white;
  margin-top: 10px;
  padding-top: 7px;
  line-height: 1.67;
`;

const StepsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
  & > div {
    height: 100%;
  }
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const GiftLanding = props => {
  const { loading, productType } = props;
  const showEssentials = [null, 'Essentials'].includes(productType);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProducts() {
    let maniBox: Product[] = (await getNailProductsByType('ManiBox')) || [];
    let gifts: Product[] = (await getNailProductsByType('Other')) || [];
    gifts = gifts.filter(product => product.tags.includes('gift'));
    gifts = [...maniBox, ...gifts];
    if (!(process.env.INVISIBLE_PRODUCTS === 'true')) {
      gifts = gifts.filter(product => product.visible);
    }
    gifts.sort(compareBySortOrderShopPage);

    setProducts(gifts);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <BuilderComponent model="page" content={props.pageInfo} />
      <HeaderBox>
        GIFT ManiMe
        <SubHeaderBox>
          The best gifts are personal. <br />
          Surprise someone with an at-home custom-made mani.
        </SubHeaderBox>
      </HeaderBox>
      <SectionTwo>
        <ChoiceBox>GIFTS FOR EVERY OCCASION</ChoiceBox>
      </SectionTwo>

      {isLoading ? (
        <LoadingAnimation isLoading={isLoading} size={200} height="50vh" />
      ) : (
        <>
          <GiftShortBanner products={products} />
          <Box width={1} display="flex" style={{ flexWrap: 'wrap' }} justifyContent="center">
            {products.map((product: any, index) => {
              const everGreen = product.tags.includes('evergreen');
              const isOutOfStock = parseInt(product.quantity || 0) <= 0;
              const giftType = product?.extraFields?.giftType;
              const linkBase = `gift/${giftType}`;
              const linkExtension =
                giftType === 'bundle' ? `/${product.name.replace(/\s/g, '_')}` : '';
              return (
                <ProductItem
                  isMobileView={props.isMobileView}
                  id={`${product.nailProductId}`}
                  key={index}
                  productItemData={product}
                  allProducts={products}
                  isOutOfStock={!everGreen && isOutOfStock}
                  dispatchSetUIKeyValue={props.dispatchSetUIKeyValue}
                  link={`${linkBase}${linkExtension}`}
                  mode={DisplayMode.LINK}
                />
              );
            })}
          </Box>
        </>
      )}

      <RedeemSection>
        <div>Did you receive a gift card or e-gift card?</div>
        <div style={{ fontFamily: 'AvenirHeavy', fontWeight: 'bolder' }}>Redeem at checkout.</div>
      </RedeemSection>

      <RedeemSection>
        <Box
          color={'#a3a3a3'}
          width={['90%', '90%', '480px']}
          textAlign={'center'}
          alignSelf={'center'}
        >
          Please note: Promo codes and ManiMoney are not valid on ManiMe Gifts. ManiMe Gifts are
          non-refundable. Reach out to care@manime.co with any questions.
        </Box>
      </RedeemSection>
      <StepsSection>
        <StepsBox
          style={{
            color: 'white',
            fontFamily: 'AvenirHeavy',
            letterSpacing: '4px',
            marginTop: 20,
            textTransform: 'uppercase',
          }}
        >
          How Gifting Works
        </StepsBox>
        <StepsContainer>
          <StepsBox maxWidth="282px">
            <StepsBox style={{ color: peach, fontFamily: 'AvenirHeavy' }}> STEP 1</StepsBox>
            <StepsBox style={{ textTransform: 'uppercase' }}>CHOOSE THE PERFECT GIFT</StepsBox>
            <StepsBox>
              Select the gift you wish to give: our Deluxe Gift Kit or Digital e-Gift Card.
              Whichever you choose, write a personal note to be included with your gift!
            </StepsBox>
          </StepsBox>

          <StepsBox maxWidth="282px">
            <StepsBox style={{ color: peach, fontFamily: 'AvenirHeavy' }}>STEP 2</StepsBox>
            <StepsBox style={{ textTransform: 'uppercase' }}>Customization Begins</StepsBox>
            <StepsBox>
              Once your gift is received (either digitally or physically), we’ll guide the
              customization and style selection process. Custom-fit stick on gels will be delivered
              in no time!
            </StepsBox>
          </StepsBox>

          <StepsBox maxWidth="282px">
            <StepsBox style={{ color: peach, fontFamily: 'AvenirHeavy' }}>STEP 3</StepsBox>
            <StepsBox style={{ textTransform: 'uppercase' }}>Enjoy ManiMe</StepsBox>
            <StepsBox>
              Once the customized stick on gels arrive, there’s nothing left to do but enjoy!
            </StepsBox>
          </StepsBox>
        </StepsContainer>
      </StepsSection>
    </>
  );
};

export default ManimeStandardContainer(GiftLanding);

// export const getStaticProps = async () => await getGlobalProps();

export const getStaticProps = async ctx => {
  const url = '/gift';
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, pageInfo: pageInfo || null },
    });
    return globalProps;
  } catch (err) {
    log.error('[generic page]', err);
    return {
      notFound: true,
    };
  }
};
