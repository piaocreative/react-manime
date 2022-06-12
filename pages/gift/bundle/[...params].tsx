import { builder, BuilderComponent } from '@builder.io/react';
import { createCheckout } from 'api/cart';
import { getNailProductByKeyValue, getNailProductByName } from 'api/product';
import GiftConfirmation from 'components/checkout/noCart/GiftConfirmation';
import GiftDetails from 'components/checkout/noCart/GiftDetails';
import GiftHeader from 'components/checkout/noCart/GiftHeader';
import GiftMessage, { GiftMessageForm } from 'components/checkout/noCart/GiftMessage';
import GiftOrderSummary, { Order } from 'components/checkout/noCart/OrderSummary';
import PlaceOrderButton from 'components/checkout/noCart/PlaceOrderButton';
import ShippingAddressForm from 'components/checkout/noCart/ShippingAddressForm';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Box from 'components/styled/Box';
import { Case, Switch } from 'components/switch';
import { Markup } from 'interweave';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Address, CreateCheckoutInput, Product } from 'types';
import log from 'utils/logging';

builder.init(BUILDER_API_KEY);

export type GiftBundleAddress = {
  email: string;
  notes: string;
} & Address;
const blue = '#2c4349';
const TypeBox = styled(Box)`
  color: #f7bfa0;
  font-family: Avenir;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: 4px;
  padding-bottom: 10px;
  padding-top: 20px;
  text-transform: uppercase;
  text-align: center;
`;
const GiftBody = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const GiftPageBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 1024px) {
    align-self: flex-start;
    width: 440px;
  }
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
  margin-top: 20px;
  @media (min-width: 1024px) {
    flex-direction: row;
    font-size: 14px;
    & div {
      padding: 0 4px;
    }
  }
`;
const ErrorMessage = styled(Box)`
  font-style: italic;
`;

function GiftBundle(props: any) {
  log.verbose('rendering giftBundle.tsx');
  const [shippingAddress, setShippingAddress] = useState<Address>();

  const [product, setProduct] = useState<Product>(props.product);
  const [giftMessage, setGiftMessage] = useState<GiftMessageForm>();

  const [stepState, setStepState] = useState(['']);
  const [checkout, setCheckout] = useState();

  const router = useRouter();

  const [error, setError] = useState<string>();

  const name = router?.query?.params?.[0]?.replace(/_/g, ' ') || '';

  let step = router?.query?.params?.[1] || '';

  /**  Need to find a better way to do this, it's causing infinite loops.
   */
  useEffect(() => {
    if (router && !stepState.includes(step)) {
      const path = `/gift/bundle/${name.replace(/ /g, '_')}`;
      router.replace(router.pathname, path);
    }
  }, [router]);

  useEffect(() => {
    if (router.query.params?.length < 1) throw new Error('product not found');

    fetchProduct(name);
  }, [router.query.params]);
  const testMessage: GiftMessageForm = giftMessage;
  const temp = checkout || ({} as any);

  const giftOrder: Order = {
    product: product,
    quantity: 1,
    shipping: temp.shippingLine?.amount || 0,
    taxes: parseFloat(temp?.totalTax || 0),
    estimate: checkout === undefined,
  };

  //const { isLoading, error, result: nailProducts, } = useGetNailProducts();

  async function orderConfirmation() {
    log.verbose('order conifrmation');
    stepState.push('confirmation');
    setStepState(stepState);
    const path = router.asPath.replace('/creditCard', '/confirmation');
    router.push(router.pathname, `${path}`, { shallow: true });
  }

  async function handleGiftMessage(input: GiftMessageForm) {
    setGiftMessage(input);
    stepState.push('shipping');
    setStepState(stepState);
    router.push(router.pathname, `${router.asPath}/shipping`, { shallow: true });
  }

  async function handleShippingAddress(input: Address, done = false) {
    if (done) {
      const names = giftMessage?.fromName.split(' ');
      const variantId = btoa(`gid://shopify/ProductVariant/${product.variantId}`);
      const createInput: CreateCheckoutInput = {
        shippingAddress: {
          address1: shippingAddress.line1,
          address2: shippingAddress.line2,
          province: shippingAddress.state,
          city: shippingAddress.city,
          firstName: names[0],
          lastName: names[1],
          country: shippingAddress.country,
          zip: shippingAddress.zip,
        },
        customAttributes: [
          {
            key: 'recipient',
            value: giftMessage.toName,
          },
        ],

        note: giftMessage.message,
        email: giftMessage.fromEmail,
        allowPartialAddresses: true,
        lineItems: [
          {
            quantity: 1,
            variantId,
          },
        ],
      };

      stepState.push('creditCard');
      setStepState(stepState);
      const path = router.asPath.replace('/shipping', '/creditCard');
      router.push(router.pathname, `${path}`, { shallow: true });
      let result = undefined;
      try {
        result = await createCheckout(createInput);
        log.verbose('results from creation of checkout', { checkoutResult: result });

        if (result.errors) {
          throw new Error(
            'There was a problem preparing your order. Please hit back and try again. \
            If this problem persists please contact us at care@manime.co'
          );
        }

        setError('');

        setCheckout(result);
        log.verbose('checkout  is created', { checkout: result });
      } catch (error) {
        log.error('Gifting.handleShippingAddress error, see params', {
          error,
          createResult: result,
          giftMessage,
          shippingAddress,
          stepState,
          checkout,
        });
        setError(error);
      }
    } else {
      setShippingAddress(input);
    }
  }

  async function fetchProduct(name: string) {
    let product: Product = null;
    if (name === 'Mothers Day Gift Kit') {
      product = await getNailProductByKeyValue('shopifyHandle', 'mothers-day-gift-kit');
    } else {
      product = await getNailProductByName(name);
    }

    //  if(parseInt(product.quantity) <= 0){
    //  router.replace(pageLinks.Gift.url)
    //    }else{
    setProduct(product);
    //  }
  }

  const checkoutTemp = checkout || { id: undefined };

  const withData = (
    <>
      <Head>
        <meta
          name="og:image"
          content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"
        ></meta>
        <meta
          name="twitter:image"
          content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616"
        ></meta>
        <title>At-Home Gel Manicure Kits | Fingernail Design | ManiMe</title>

        <meta name="description" content={product?.shortDescription}></meta>
      </Head>

      <BuilderComponent model="page" content={props.pageInfo} />
      <Box
        width={1}
        display="flex"
        flexDirection="column"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        <GiftHeader
          image={product?.images[1]}
          title={product?.name}
          collapse={step === 'confirmation'}
          canHide={step !== ''}
        />
        <GiftBody>
          <GiftPageBox flex={'1 1'}>
            <GiftOrderSummary
              order={giftOrder}
              giftMessage={giftMessage}
              shippingAddress={shippingAddress}
              preLaunchDateString={product?.extraFields?.preLaunchDateString}
            />
            <GiftDetails
              order={giftOrder}
              giftMessage={giftMessage}
              shippingAddress={shippingAddress}
              step={step}
              editable={step !== 'confirmation'}
            />
          </GiftPageBox>

          <Switch active={step}>
            <Case name="">
              <GiftPageBox px={['30px', '30px', 'unset']} flex={'1  1'}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  {product && (
                    <>
                      <TypeBox>{product?.subtitle}</TypeBox>
                      <Box px={30} style={{ textAlign: 'center' }}>
                        <Markup content={product.description} />
                      </Box>
                      <GiftMessage callback={handleGiftMessage} messageForm={giftMessage} />
                    </>
                  )}
                </Box>
              </GiftPageBox>
            </Case>

            <Case name="shipping">
              <GiftPageBox px={['30px', '30px', 'unset']} flex={'1 1'}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <ShippingAddressForm
                    title={product?.name}
                    shippingForm={shippingAddress}
                    preLaunchDateString={product?.extraFields?.preLaunchDateString}
                    callback={handleShippingAddress}
                  />
                </Box>
              </GiftPageBox>
            </Case>

            <Case name="creditCard">
              <GiftPageBox px={['30px', '30px', 'unset']} flex={'1 1'}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <PlaceOrderButton
                    giftMessage={giftMessage}
                    address={shippingAddress}
                    product={product}
                    checkoutId={checkoutTemp.id}
                    onDataChange={orderConfirmation}
                  />
                  <ErrorMessage color="forecolor.2" fontSize="14px" my={0}>
                    {error}
                  </ErrorMessage>
                </Box>
              </GiftPageBox>
            </Case>
            <Case name="confirmation">
              <Box flex={'1 2'}>
                <GiftConfirmation productImage={product?.images[1]} toName={giftMessage?.toName} />
              </Box>
            </Case>
          </Switch>
        </GiftBody>

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
      </Box>
    </>
  );

  const withoutData = <div></div>;

  return product ? withData : withoutData;
}

const _GiftBundle: any = ManimeStandardContainer(GiftBundle);
export default _GiftBundle;

_GiftBundle.getInitialProps = async ctx => {
  const url = ctx.pathname;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  return (
    await getGlobalProps({
      propsToMerge: { params: ctx?.query?.params, pageInfo: pageInfo || null },
    })
  ).props;
};
