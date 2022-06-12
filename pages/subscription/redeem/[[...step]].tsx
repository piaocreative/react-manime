import groupGiftStyle from '@styles/gift/group/styles.module.css';
import { AvailableCarts, SetCart } from 'actions/cart';
import { createCart, DEFAULT_CHECKOUT } from 'api/cart';
import { addShopifyOrder } from 'api/order';
import NavBar from 'components/core/gallery/NavBar';
import ShopBody from 'components/core/gallery/ShopBody';
import EntitlementWall from 'components/core/hoc/EntitlementWall';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import BottomCart from 'components/subscription/BottomCart';
import Confirmation from 'components/subscription/Confirmation';
import LoadingScreen from 'components/subscription/RedemptionLoading';
import SubscriptionAddressForm from 'components/subscription/SubscriptionAddressForm';
import { Case, Switch } from 'components/switch';
import useCartFunctions from 'hooks/useCartFunctions';
import { getStore } from 'lib/redux';
import Link from 'next/link';
import router, { withRouter } from 'next/router';
import pRetry from 'p-retry';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Address, Product, StepSequence, SubscriptionEntitlement, SubscriptionPlan } from 'types';
import { countTypesInCart, prepareBaseOrder } from 'utils/cartUtils';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { getProfileId } from 'utils/profileData';
import { scrollToTop } from 'utils/scroll';
import { trackWithGtm as track } from 'utils/track';

export enum StepEnum {
  PICK = 'pick-products',
  SHIPPING = 'shipping',
  SUCCESS = 'confirmation',
  ERROR = 'error',
}

const SubscriptionSequence: StepSequence = {
  start: StepEnum.PICK,
  steps: {
    [StepEnum.PICK]: {
      next: StepEnum.SHIPPING,
      meta: {},
    },
    [StepEnum.SHIPPING]: {
      previous: StepEnum.PICK,
      next: StepEnum.SUCCESS,
      meta: {},
    },
    [StepEnum.SUCCESS]: {
      previous: StepEnum.SHIPPING,
      meta: {},
    },
    [StepEnum.ERROR]: {
      meta: {},
    },
  },
  meta: {},
};

type Props = {
  router: any;
  entitlement: SubscriptionEntitlement;
  plan: SubscriptionPlan;
  isLoading: boolean;
};

function SubscriptionRedemption(props: Props) {
  const [currentStep, setCurrentStep] = useState<string>();
  const store = getStore();
  const cartFunctions = useCartFunctions();

  const [error, setError] = useState<string>();
  const { isLoading = true } = props;
  const [isTimedLoading, setIsTimedLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { userData, cartData, profileData } = useSelector((state: any) => {
    return {
      userData: state.userData,
      cartData: state[AvailableCarts.SubscriptionCart],
      profileData: state.profileData,
    };
  });

  const [isMounted, setIsMounted] = useState(false);
  const step = props.router.query?.step?.[0];

  const [availableTypes, setAvailableTypes] = useState(['Gels', 'Essentials']);
  const [shippingAddress, setShippingAddress] = useState<Address>();
  async function mount() {
    if (!cartData || !userData.isReady || isMounted) {
      return;
    }
    const match = process.browser ? props.router.asPath.match(/new=(?<isNew>\w+)&?/) : undefined;
    let isNew = match?.groups?.isNew === 'true';
    setIsMounted(true);
    track(`[subscription][redemption][mount]`, { isNew });

    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));

    let _cart = cartData.cart;
    if (!cartData.isReady) {
      _cart = await createCart({
        firstName: userData?.name?.firstName,
        lastName: userData?.name?.lastName,
        email: userData?.email,
        baseCart: DEFAULT_CHECKOUT,
      });

      store.dispatch(SetCart(_cart, AvailableCarts.SubscriptionCart));
    }
  }

  useEffect(() => {
    mount();
  }, [userData, cartData]);

  useEffect(() => {
    props.plan && cartData.isReady && calculateAvailableTypes(props.plan, cartData.cart);
  }, [props.plan && cartData]);

  useEffect(() => {
    if (!step) {
      router.replace(pageLinks.SubscriptionsRedemptionPick.url);
    } else if (!currentStep) {
      setCurrentStep(step);
    } else if (step !== SubscriptionSequence.start && availableTypes.length !== 0) {
      router.replace(pageLinks.SubscriptionsRedemptionPick.url);
    } else if (currentStep !== step) {
      setCurrentStep(step);
    } else if (currentStep === StepEnum.SHIPPING) {
      const count = countTypesInCart(cartData.cart);
      if (count && Object.entries(count).length === 0) {
        setCurrentStep(SubscriptionSequence.start);
      }
    }
  }, [step]);

  function calculateAvailableTypes(plan: SubscriptionPlan, cart, throwError = false) {
    setError(undefined);
    const counts = countTypesInCart(cart);
    let types = [];
    plan.items.forEach(planItem => types.push(planItem.productType));
    let exceeded = false;
    for (const [key, value] of Object.entries(counts)) {
      const planItem = plan.items.find(entry => entry.productType === key);
      if (planItem?.quantity < value) {
        setError('Items in cart exceed plan allowance.');
        exceeded = true;
        types = types.filter(type => type !== key);
      } else if (planItem?.quantity === value) {
        types = types.filter(type => type !== key);
      }
    }

    let different = types.some(entry => !availableTypes.includes(entry));
    if (different || types.length != availableTypes.length) {
      setAvailableTypes([...types]);
    }

    if (throwError && exceeded) {
      throw 'Items in cart exceed plan allowance';
    }
  }
  async function onPickNext() {
    if (availableTypes.length > 0) {
      setError('you still have items to choose');
      return;
    }

    try {
      calculateAvailableTypes(props.plan, cartData.cart, true);
    } catch (err) {
      return;
    }

    scrollToTop();
    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    const pathname = `${root}/${SubscriptionSequence.steps[StepEnum.PICK].next}`;
    const result = await cartFunctions.autoApplyShippingLine(
      AvailableCarts.SubscriptionCart,
      'Subscription Redeemption onPickNext'
    );

    props.router.push(
      {
        pathname,
      },
      {
        pathname,
      },
      { shallow: true }
    );
  }

  async function onShippingNext() {
    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    props.router.push(
      {
        pathname: `${root}/${SubscriptionSequence.steps[StepEnum.SUCCESS].next}`,
      },
      {
        pathname: `${root}/${SubscriptionSequence.steps[StepEnum.SUCCESS].next}`,
      },
      { shallow: true }
    );
  }

  async function handleShippingAddress(input) {
    log.info('subscription: updating address for subscription cart ');
    const {
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressZip,
      name,
      shippingAddressId,
    } = input;

    const [firstName, lastName] = name.split(' ', 2);
    const param = {
      address1: addressLine1,
      address2: addressLine2,
      city: addressCity,
      country: 'US',
      firstName: firstName,
      lastName: lastName,
      province: addressState,
      zip: `${addressZip}`,
    };
    await cartFunctions.updateShippingAddress(param, AvailableCarts.SubscriptionCart);
    log.info('subscription: done with update, now apply shipping line');
    const result = await cartFunctions.autoApplyShippingLine(
      AvailableCarts.SubscriptionCart,
      'Subscription Redeemption handleShippingAddress'
    );
  }

  async function placeOrder() {
    try {
      setIsDisabled(true);
      var d = new Date();
      var time = Math.round(d.getTime() / (1000 * 60));
      const idempotencyKey = `${props.entitlement.entitlementId}${time}`;

      const maniProfileId = getProfileId(profileData.profiles, 'Manis');
      const pediProfileId = getProfileId(profileData.profiles, 'Pedis');

      const baseOrder = prepareBaseOrder({
        firstName: userData.name.firstName,
        lastName: userData.name.lastName,
        email: userData.email,
        idempotencyKey,
        fulfillType: 'Subscription Redemption',
        maniProfileId,
        pediProfileId,
        shopifyCheckout: cartData.cart,
      });
      baseOrder.totalPriceFloat = 0;
      baseOrder.totalTaxFloat = 0;
      const noteAttributes = [
        {
          name: 'stripeChargeAmount',
          value: baseOrder.totalPriceFloat,
        },
        {
          name: 'entitlementId',
          value: props.entitlement.entitlementId,
        },
        ...baseOrder.orderNotes,
      ];
      const chargeId = undefined;

      const lineItemsSubtotalPriceFloat = baseOrder.totalPriceFloat;

      let shopifyOrder;
      const acceptsMarketing = !!userData?.acceptsMarketing;
      shopifyOrder = await pRetry(
        async () =>
          await addShopifyOrder(
            baseOrder.lineItems,
            baseOrder.shippingAddress,
            baseOrder.shippingLine,
            baseOrder.totalPriceFloat,
            baseOrder.totalTaxFloat,
            baseOrder.email,
            baseOrder.firstName,
            baseOrder.lastName,
            undefined /*discountCodes */,
            acceptsMarketing /*acceptsMarketing*/,
            noteAttributes,
            idempotencyKey,
            chargeId,
            null,
            null,
            lineItemsSubtotalPriceFloat
          ),
        {
          onFailedAttempt: error => {
            if (error['response'].status < 500) {
              throw new pRetry.AbortError(error['response'].data.message);
            }
            log.verbose(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
            );
          },
          retries: 3, // 5 calls
          factor: 2,
          minTimeout: 500,
          maxTimeout: 2000,
          randomize: true,
        }
      );

      track('[subscription][redemption][success]');
      const _cart = await createCart({
        firstName: userData?.name?.firstName,
        lastName: userData?.name?.lastName,
        email: userData?.email,
        baseCart: DEFAULT_CHECKOUT,
      });

      store.dispatch(SetCart(_cart, AvailableCarts.SubscriptionCart));
      setCurrentStep(StepEnum.SUCCESS);
    } catch (err) {
      const myError = err;
      let message = JSON.stringify(err);
      let path = undefined;
      let fatal = false;
      if (err.name === 'AbortError') {
        message = err.message;
      } else if (err.isAxiosError) {
        // these are from
        try {
          message = `${err.response.data.prefix} ${err.response.data.message} ${err.response.data.suffix}`;
          path = myError.config.url;
        } catch (innerErr) {
          message = 'Check your card information and try again, or use a different payment method.';
        }
      } else if (err.message) {
        message = err.message;
      } else if (err.source === 'SYSTEM') {
        message =
          'Oops, we had system errors placing your order. Please refresh and try again. If the problem persists please contact us at care@manime.co';

        fatal = err.fatal ? true : false;
      }
      setError(message);

      track('[subscription][redemption][failure]', { message });
      //  setError(message)
    } finally {
      setIsDisabled(false);
    }
  }

  SubscriptionSequence.steps[StepEnum.PICK].meta.action = onPickNext;
  SubscriptionSequence.steps[StepEnum.PICK].meta.label = 'Next';
  SubscriptionSequence.steps[StepEnum.SHIPPING].meta.action = onShippingNext;
  SubscriptionSequence.steps[StepEnum.SHIPPING].meta.label = 'Continue';

  const bottomCartJsx = (
    <BottomCart
      onShopClickNext={SubscriptionSequence.steps[currentStep]?.meta.action}
      step={currentStep}
      label={SubscriptionSequence.steps[currentStep]?.meta.label}
      cartName={AvailableCarts.SubscriptionCart}
      hidePrice={true}
      planTerms={props.plan}
      error={error}
    />
  );
  const productFilter = useCallback(product => {
    return (
      !product.tags?.includes('ManiMe Bundle') &&
      !product.tags?.includes('Not Shop All') &&
      product.productType !== 'ManiBox'
    );
  }, []);

  const disableFilter = useCallback(
    (product: Product) => {
      let productType = product.productType;
      if (productType === 'Manis' || productType === 'Pedis') {
        productType = 'Gels';
      }
      return !availableTypes.includes(productType);
    },
    [availableTypes]
  );

  if (isLoading || isTimedLoading) {
    if (!isTimedLoading) {
      setIsTimedLoading(true);
      setTimeout(() => setIsTimedLoading(false), 3000);
    }

    return <LoadingScreen />;
  }
  return (
    <div className={groupGiftStyle.groupGiftContainer}>
      <NavBar navTitle={'Redeem monthly subscription'} hideBack={true} />

      <Switch active={currentStep} isMounted={isMounted}>
        <Case name={StepEnum.PICK}>
          <div
            className={`${groupGiftStyle.galleryRow} ${groupGiftStyle.galleryHeader}`}
            style={{
              marginTop: '50px',
              flexDirection: 'column',
              paddingTop: '10px',
              paddingBottom: '10px',
              height: 'auto',
            }}
          >
            <div>
              Your subscription plan:
              <b style={{ margin: '2pt' }}> {` ${props.plan?.planCode} `} </b>{' '}
            </div>
            <div style={{ paddingTop: '5px' }}>
              Includes:
              {props.plan?.items.map((planItem, itemIndex) => {
                const and = itemIndex === 0 ? '' : '& ';
                return (
                  <span key={itemIndex}>
                    {`${and} ${planItem.quantity} ${planItem.productType} `}
                  </span>
                );
              })}
            </div>
            <div style={{ marginTop: '15px', fontSize: '10px' }}>Need to change your routine?</div>
            <div>
              <Link href={pageLinks.SubscriptionLanding.url}>
                <span style={{ fontWeight: 'normal', fontSize: '10px' }}>
                  Checkout the other plans.
                </span>
              </Link>
            </div>
          </div>

          <ShopBody
            menuBaseUrl={pageLinks.SubscriptionsRedemptionPick.url}
            cartName={AvailableCarts.SubscriptionCart}
            productFilter={productFilter}
            disableFilter={disableFilter}
            hidePrice={true}
            addCtaLabel={`Claim`}
            disabledCtaLabel={`Not Claimable`}
            extraBottomMargin={'90px'}
          />
          {bottomCartJsx}
        </Case>
        <Case name={StepEnum.SHIPPING}>
          <div style={{ marginTop: '50px' }}>
            <SubscriptionAddressForm
              title={'Confirm Order'}
              shippingAddress={shippingAddress}
              cartName={AvailableCarts.SubscriptionCart}
              next={{ label: 'Confirm Order', action: placeOrder }}
              updateShippingAddress={handleShippingAddress}
              error={error}
              isDisabled={isDisabled}
            />
          </div>
        </Case>

        <Case name={StepEnum.SUCCESS}>
          <Confirmation />
        </Case>
        <Case name={StepEnum.ERROR}>
          <div style={{ marginTop: '50px' }}>There was a problem placing your order</div>
          <div>{error}</div>
        </Case>
      </Switch>
    </div>
  );
}

export default ManimeStandardContainer(EntitlementWall(withRouter(SubscriptionRedemption)), true);
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async props => await getGlobalProps();
