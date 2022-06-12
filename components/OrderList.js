import { getGroupOrders, getShopifyOrderByGroupOrderId } from 'api/order';
import { getProfileOverview } from 'api/profile';
import { retrieveUsersWithEmail } from 'api/user';
import LoadingAnimation from 'components/LoadingAnimation';
import OrderItem from 'components/OrderItem';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import style from 'static/components/order/order-list.module.css';
import log from 'utils/logging';
import { trackFunnelActionProjectFunnel } from 'utils/track';

const VIEWMORE_STEP = 5;
const INIT_VIEW = 3;

const OrderList = props => {
  const [state, setState] = useState({
    line_items: [],
    sub_total_price: '',
    total_line_items_price: '',
    total_tax: '',
    shipping_lines: [],
    order: {},
    ordersLoading: true,
    selectedIndex: 0,
    showDetail: false,
    groupOrders: [],
    groupOrdersMapShopify: [],
    lastIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasDeliveredMani, setHasDeliveredMani] = useState({});
  const [hasDeliveredPedi, setHasDeliveredPedi] = useState({});

  useEffect(() => {
    const email = props?.userData?.email;
    if (email) {
      retrieveShopifyData(email);
    }
  }, [props?.userData?.email]);

  useEffect(() => {
    if (props.userData?.identityId) {
      initProfileOverview();
    }
  }, [props.userData?.identityId]);

  const initProfileOverview = async () => {
    try {
      const userDataInfo = await getProfileOverview(props.userData.identityId);
      const profiles = userDataInfo.Profiles || [];
      const maniProfile = profiles.find(profile => profile.profileType === 'Manis');
      const pediProfile = profiles.find(profile => profile.profileType === 'Pedis');
      setHasDeliveredMani(maniProfile?.profileOverview?.hasDeliveredOrder);
      setHasDeliveredPedi(pediProfile?.profileOverview?.hasDeliveredOrder);
    } catch (err) {
      log.warn(err);
    }
  };

  const retrieveShopifyData = async email => {
    trackFunnelActionProjectFunnel(`[OrderList][retrieveShopifyData] init`);
    try {
      const users = await retrieveUsersWithEmail(email);

      let groupOrderPromises = [];
      users.map(async user => {
        const identityId = user.userId;
        groupOrderPromises.push(getGroupOrders(identityId));
      });

      let groupOrders = [];
      Promise.all(groupOrderPromises).then((groupOrdersArray, index) => {
        groupOrdersArray.map(async groupOrderArray => {
          groupOrders = [...groupOrders, ...groupOrderArray];
          const groupOrdersMapShopify = new Array(groupOrders.length);
          const groupOrdersLength = groupOrders.length;
          const initialLastIndex =
            groupOrdersLength > INIT_VIEW - 1 ? INIT_VIEW - 1 : groupOrdersLength - 1;
          setState(prevState => ({
            ...prevState,
            groupOrders,
            groupOrdersMapShopify,
            lastIndex: initialLastIndex,
          }));
          // trackFunnelActionProjectFunnel(`[OrderList][retrieveShopifyData] groupOrders ${index}`, { groupOrders });

          await loadShopifyOrders(0, initialLastIndex, groupOrders);
          setState(prevState => ({ ...prevState, ordersLoading: false }));
        });
      });
    } catch (err) {
      log.error(`[OrderList][retrieveShopifyData] ${err}`, { email, err });
    }
  };

  const loadShopifyOrders = async (from, to, groupOrders) => {
    try {
      setIsLoading(true);
      let groupOrdersMapShopify = [...state.groupOrdersMapShopify];
      for (let index = from; index <= to; index++) {
        const groupOrderId = groupOrders[index].groupOrderId;
        const groupOrder = await getShopifyOrderByGroupOrderId(groupOrderId);
        const {
          shopifyShippingLinePrice,
          orderTotal,
          trackingNumberShipmentStatus,
          shipmentStatus,
        } = groupOrders[index];
        groupOrdersMapShopify[index] = {
          ...groupOrder.order,
          shopifyTrackingUrl: groupOrders[index].shopifyTrackingUrl,
          shopifyShippingLinePrice,
          orderTotal,
          trackingNumberShipmentStatus,
          shipmentStatus,
        };
      }
      setState(prevState => ({
        ...prevState,
        groupOrdersMapShopify,
      }));
    } catch (err) {
      log.error(`[OrderList][loadShopifyOrders] ${err}`, {
        err,
        from,
        to,
      });
    }
    setIsLoading(false);
  };

  const viewMoreOrdersHandler = async () => {
    const { lastIndex, groupOrders } = state;
    if (isLoading) {
      return;
    }
    const maxLength = groupOrders.length;
    if (maxLength === 0 || lastIndex === maxLength - 1) {
      return;
    }
    let newIndex = lastIndex + VIEWMORE_STEP;
    if (newIndex >= maxLength) {
      newIndex = maxLength - 1;
    }
    try {
      await loadShopifyOrders(lastIndex + 1, newIndex, groupOrders);
      setState(prevState => ({ ...prevState, lastIndex: newIndex }));
    } catch (err) {
      log.error(`[OrderList][viewMoreOrders] ${err}`, {
        err,
        lastIndex,
        newIndex,
      });
    }
  };

  const { ordersLoading, groupOrdersMapShopify, lastIndex } = state;
  const maxLength = state.groupOrders.length;

  if (ordersLoading) {
    return (
      <LoadingAnimation isLoading={ordersLoading} height="calc(100% - 88px)" background="#FFF9F7" />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {groupOrdersMapShopify.slice(0, lastIndex + 1).map((shopifyOrder, index) => (
        <OrderItem
          key={index}
          order={index}
          shopifyData={shopifyOrder}
          maniProfile={props.maniProfile}
          pediProfile={props.pediProfile}
          hasDeliveredMani={hasDeliveredMani}
          hasDeliveredPedi={hasDeliveredPedi}
        />
      ))}
      {maxLength === 0 && <div className={style.noOrders}>No Orders</div>}
      {maxLength !== 0 && lastIndex !== maxLength - 1 && (
        <div className={style.viewMoreOrders} onClick={viewMoreOrdersHandler}>
          {isLoading ? 'LOADING ...' : 'VIEW MORE ORDERS'}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData,
  maniProfile: state.profileData.profiles.find(profile => profile.profileType === 'Manis') || {},
  pediProfile: state.profileData.profiles.find(profile => profile.profileType === 'Pedis') || {},
});

export default connect(mapStateToProps, null)(OrderList);
