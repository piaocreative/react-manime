import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import ReactImage from 'react-image';

import { PrimaryButton } from 'components/basic/buttons';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { getDateString } from 'utils/generalHelpers';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';

import style from '../static/components/order/order-item.module.css';

const shippingIcon = '/static/icons/shipping-icon.svg';
const arrowIconSrc = '/static/icons/arrow-down.svg';
const DISPLAY_PROD_COUNT = 4;
const prodIconPrefix = 'https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/';
const defaultProdIcon = 'https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/default.svg';

const Row = ({name, quantity, price}) => {
  return (
    <div className={style.tableRow}>
      <div className={style.leftCell}>{name}</div>
      <div className={style.centerCell}>{quantity}</div>
      <div className={style.rightCell}>{price}</div>
    </div>
  );
}

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value
  });
  return ref.current;
}

const productHandle = ({products, productId}) => {
  const product = products?.filter(p => p.nailProductId === productId.toString());
  return product.length === 1 ? product[0].shopifyHandle : ''
}

const OrderItem = props => {
  const { isLoading, error, result: products } = useGetNailProducts();
  const [orderDate, setOrderDate]= useState('');
  const [showDetail, setShowDetail]= useState(false);
  const [pageIndex, setPageIndex]= useState(0);
  const [data, setData]= useState([]);

  const prevProps = usePrevious(props);

  const changeDisplayData = () => {
    const tempData = [];
    const { shopifyData } = props;
    const { line_items } = shopifyData;

    for (let i = pageIndex * DISPLAY_PROD_COUNT; i < line_items.length && i < DISPLAY_PROD_COUNT * (pageIndex + 1); i++) {
      tempData.push({
        name: line_items[i].title,
        price: parseFloat(line_items[i].price),
        quantity: line_items[i].quantity,
        icon: `${prodIconPrefix}${line_items[i].product_id}.svg`,
        productId: line_items[i].product_id
      });
    }

    setData(tempData);
    setOrderDate(getDateString(shopifyData.created_at));
  }

  const changePageIndexHandler = step => {
    const { pageIndex } = state;
    const orderLength = (((props || {}).shopifyData || {}).line_items || []).length;
    const newPageIndex = pageIndex + step;
    if (newPageIndex < 0 || newPageIndex * DISPLAY_PROD_COUNT >= orderLength) {
      return;
    }
    setPageIndex(newPageIndex);
  }

  useEffect(() => {
    changeDisplayData();
  }, [pageIndex]);

  const { order, shopifyData } = props;

  if (!shopifyData) {
    return null;
  }

  // log.info('[OrderItem][render]', {order, shopifyData});

  const shopifyTrackingUrl = (shopifyData || {}).shopifyTrackingUrl;
  const shippingStatusMessage = shopifyTrackingUrl ? <a className={style.shopifyTrackingUrl} href={shopifyTrackingUrl} target='_blank'>TRACK YOUR ORDER</a>: 'NOT YET SHIPPED';
  // const isDelivered = shopifyData.fulfillments?.length >= 1 && shopifyData.fulfillments[0].shipment_status === 'delivered';
  const isDelivered = (shopifyData.trackingNumberShipmentStatus === 'Delivered' || shopifyData.shipmentStatus === 'delivered');
  const isCanceled = shopifyData.cancelled_at ? true: false;
  const statusJsx = isCanceled ?
    <div className={style.canceledStatus}>ORDER STATUS: CANCELED</div>:
    <>
      <img src={shippingIcon} />
      <div className={style.shippingStatus}>SHIPPING STATUS: {shippingStatusMessage}</div>
    </>
  const { total_line_items_price, total_tax, total_discounts, orderTotal, shopifyShippingLinePrice } = shopifyData;
  const seeMoreDetailsLink = (shopifyData || {}).order_status_url;
  const orderLength = (((props || {}).shopifyData || {}).line_items || []).length;
  let totalPrice = 0;
  data.map(item => totalPrice += item.price * item.quantity);

  const hasManis = (shopifyData?.line_items || []).some(line_item => line_item.properties.find(property => property.value === props.maniProfile.profileId));
  const hasPedis = (shopifyData?.line_items || []).some(line_item => line_item.properties.find(property => property.value === props.pediProfile.profileId));
  
  const typeQuery = (hasManis === hasPedis) ? '' : (hasManis ? '&profileType=Manis': '&profileType=Pedis');
  const isDisabledCTA = (hasManis && !props.hasDeliveredMani) || (hasPedis && !props.hasDeliveredPedi) || isCanceled || !isDelivered || (!hasManis && !hasPedis);

  return (
    <div className={classNames(style.container, order % 2 === 0 && style.darkBackColor)}>
      <div className={classNames(style.orderDate, style.narrowOrderDate)}>
        {orderDate}
      </div>
      <div className={style.content}>
        <div>
          <div className={classNames(style.orderDate, style.desktopOrderDate)}>
            {orderDate}
          </div>
          <div
            className={classNames(style.orderDetail, style.desktopOrderDetail)}
            onClick={() => setShowDetail(!showDetail)}>
            ORDER DETAILS
            <span className={style.orderDetailSymbol}>{showDetail ? '–': '+'}</span>
          </div>
        </div>
        <div className={style.column1}>
          <div className={style.iconBox}>
            <div
              className={classNames(style.leftButton, {
                [style.disabled]: pageIndex === 0})
              }
              onClick={() => changePageIndexHandler(-1)}>
                <img src={arrowIconSrc} className={style.upArrow} alt='left' />
            </div>
            {data.map((item, index) => (
              console.log({
                products, 
                productId: item.productId, 
                handle: productHandle({products, productId: item.productId})}) ||
              productHandle({products, productId: item.productId}) ?
              <Link
                key={index}
                href={`${pageLinks.ProductDetail.url}[handle]`}
                as={`${pageLinks.ProductDetail.url}${productHandle({products, productId: item.productId})}`}>
                <a>
                  <ReactImage src={[item.icon, defaultProdIcon]} className={style.prodIcon} />
                </a>
              </Link>:
              null
            ))}
            <div
              className={classNames(style.rightButton, {
                [style.disabled]: (pageIndex + 1) * DISPLAY_PROD_COUNT >= orderLength
              })}
              onClick={() => changePageIndexHandler(1)}>
              <img
                src={arrowIconSrc}
                className={style.downArrow}
                alt='right' />
            </div>
          </div>
        </div>
        <div className={style.column2}>
          <div className={style.column21}>
            <div className={classNames(style.resizeManis, isCanceled && style.canceled)}>Resize Your Gels:</div>
            <Link href={`${pageLinks.Refit.url}?groupOrderId=${shopifyData.id}${typeQuery}`}>
              <a>
                <PrimaryButton passedClass={style.reviewButton} disabled={isDisabledCTA}>
                  IMPROVE FIT
                </PrimaryButton>
              </a>
            </Link>
          </div>
          <div className={style.shippingStatusLine}>
            {statusJsx}
          </div>
        </div>
      </div>
      <div
        className={classNames(style.orderDetail, style.narrowOrderDate)}
        onClick={() => setState({showDetail: !showDetail})}>
        ORDER DETAILS
        <span className={style.orderDetailSymbol}>{showDetail ? '–': '+'}</span>
      </div>
      {showDetail &&
        <div className={style.detailedTable}>
          <Row name='ITEM' quantity='QT.' price='PRICE' />
          {data.map((item, index) => (
            <Row
              key={index}
              name={item.name}
              quantity={item.quantity}
              price={`$${item.price}`} />
          ))}
          <div className={style.totalPrice}>TOTAL: ${totalPrice}</div>
          {showDetail &&
            <div className={style.shippingStatusLineNarrow}>
              {statusJsx}
            </div>
          }
          <div className={style.orderInfo}>
            <div className={style.row}>
              <div>Bag items</div>
              <div>${total_line_items_price || 0}</div>
            </div>
            <div className={style.row}>
              <div>Promo Code</div>
              <div>- ${total_discounts}</div>
            </div>
            <div className={style.row}>
              <div>Shipping</div>
              <div>${shopifyShippingLinePrice}</div>
            </div>
            <div className={style.row}>
              <div>Taxes</div>
              <div>${total_tax || 0}</div>
            </div>
            <div className={classNames(style.totalRow, style.row)}>
              <div>TOTAL</div>
              <div>${orderTotal}</div>
            </div>
          </div>
          <div
            className={style.moreDetails}
            onClick={() => {window.open(`${seeMoreDetailsLink}`, '_blank')}}>
            SEE MORE DETAILS
          </div>
        </div>
      }
      {!showDetail &&
        <div className={style.shippingStatusLineNarrow}>
          {statusJsx}
        </div>
      }
    </div>
  );
}

export default OrderItem;
