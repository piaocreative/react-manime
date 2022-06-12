import styles from '@styles/gift/group/redeem.module.css';
import { AvailableCarts } from 'actions/cart';
import { updateShippingAddress } from 'api/cart';
import { addShopifyOrder } from 'api/order';
import ShippingAddress from 'components/checkout/Shipping';
import CollapseableCart from 'components/core/cart/horizontal';
import withFitWall from 'components/core/hoc/FitWall';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import withRedemptionCart from 'components/gift/group/redeem/withRedemptionCart';
import { useRouter } from 'next/router';
import pRetry from 'p-retry';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { prepareBaseOrder } from 'utils/cartUtils';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { getProfileId } from 'utils/profileData';

function RedeemShippingPage(props) {
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const dispatch = useDispatch();
  const router = useRouter();

  let memberId = router.asPath.substring(router.asPath.indexOf('mid=') + 4);

  if (memberId.includes('&')) {
    memberId = memberId.substring(0, memberId.indexOf('&'));
  }

  const { userData, cart, profileData } = useSelector((state: any) => {
    const x = state.mainCartData;
    return {
      userData: state.userData,
      cart: state[AvailableCarts.GroupGiftCart].cart,
      profileData: state.profileData,
    };
  });

  useEffect(() => {
    log.verbose('selected address is ', selectedAddress);
    if (!selectedAddress) {
      return;
    }
    const {
      addressLine1: address1,
      addressLine2: address2,
      addressCity: city,
      addressState: province,
      addressZip: zip,
    } = selectedAddress;

    updateShippingAddress(
      cart.id,
      {
        address1,
        address2,
        city,
        firstName: userData.name.firstName,
        lastName: userData.name.lastName,
        province,
        zip,
      },
      AvailableCarts.GroupGiftCart
    );
  }, [selectedAddress]);

  async function placeOrder() {
    /**
     * use checkout id as deduplication key
     * if checkout id is not available,
     * then use memberId
     */
    const idempotencyKey = `${cart?.id || memberId}`;

    const maniProfileId = getProfileId(profileData.profiles, 'Manis');
    const pediProfileId = getProfileId(profileData.profiles, 'Pedis');

    const baseOrder = prepareBaseOrder({
      firstName: userData.name.firstName,
      lastName: userData.name.lastName,
      email: userData.email,
      idempotencyKey,
      fulfillType: 'ManiBox Redemption',
      maniProfileId,
      pediProfileId,
      shopifyCheckout: cart,
    });

    baseOrder.totalPriceFloat = 0;
    baseOrder.totalTaxFloat = 0;

    /*   const placeholderLineItems = {
     edges: [{quantity: recipients.length, variantId}]
    }*/

    const chargeId = undefined;

    let shopifyOrder;
    const acceptsMarketing = userData?.acceptsMarketing ? true : false;

    const noteAttributes = [
      {
        name: 'stripeChargeAmount',
        value: baseOrder.totalPriceFloat,
      },
      ...baseOrder.orderNotes,
    ];

    const lineItemsSubtotalPriceFloat = baseOrder.totalPriceFloat;

    const groupGiftRedemption = {
      groupGiftMemberId: memberId,
    };
    try {
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
            groupGiftRedemption,
            lineItemsSubtotalPriceFloat
          ),
        {
          onFailedAttempt: error => {
            log.verbose(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
            );
          },
          retries: 3,
          factor: 2,
          minTimeout: 500,
          maxTimeout: 2000,
          randomize: true,
        }
      );

      router.push(pageLinks.GroupGiftRedeemConfirmation.url);

      //   placeOrderCallback();
    } catch (err) {
      const myError = err;

      //      log.error("Caught an error in Gifting Place Order")
      //    log.error("Gifting PlaceOrderButton.handleCreditCard could not create", err)

      let message = JSON.stringify(err);
      let path = undefined;
      let fatal = false;
      if (chargeId && !shopifyOrder) {
        fatal = true;
        message =
          'Your order needs assistance from our care team, who will complete your order soon. Your payment was successfully processed. Please write to care@manime.co with any questions.';
        err.nestedMessage = err.message;
        err.message =
          'Charged customer but unable to create a shopify order. Please revert the charge ASAP.';
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
    } finally {
      // stopProcessingCountdown()
    }
  }

  return (
    <div>
      {cart && (
        <>
          <div style={{ padding: '10px', marginBottom: '20px' }}>
            <ShippingAddress
              onSelectAddress={address => setSelectedAddress(address)}
              next={{ label: 'Place Order', action: placeOrder }}
            />
          </div>
          <CollapseableCart
            isCollapsable={false}
            cart={cart}
            hidePrice={true}
            backgroundColor="#f9f9f9"
            label="Gift Kit Summary"
          />
        </>
      )}

      <div className={styles.error}>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ManimeStandardContainer(
  withRedemptionCart(withFitWall(RedeemShippingPage, AvailableCarts.GroupGiftCart))
);

export const getStaticProps = async () => await getGlobalProps();
