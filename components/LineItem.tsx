import config from 'config';
import constants from 'constants/index';
import React from 'react';
import styled from 'styled-components';
import Box from './styled/Box';

const CartImg = styled.img`
  height: 92px;
  width: 92px;
  object-fit: cover;
  text-align: center;
  // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
`;

const PlusMinusButton = styled.div`
  width: 30px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background-color: #f7bfa0;
    opacity: 0.5;
  }
`;

type LineItemProps = {
  updateLineItemInCart?: Function;
  removeLineItemInCart?: Function;
  line_item: any;
  notEditable?: any;
  isCart?: any;
  freeItem?: any;
  inventory?: any;
};

export default function LineItem({ updateLineItemInCart, ...props }: LineItemProps) {
  function decrementQuantity(lineItemId) {
    updateLineItemInCart(lineItemId, props.line_item.quantity - 1);
  }

  function incrementQuantity(lineItemId) {
    updateLineItemInCart(lineItemId, props.line_item.quantity + 1);
  }

  function removeItem(lineItemId) {
    updateLineItemInCart(lineItemId, 0);
  }

  const THRESHOLD = config.soldOutThreshold;
  const warningColor = '#ED7658';
  const { notEditable, isCart, freeItem } = props;
  const line_item = (props || {}).line_item || {};
  const id = line_item.id || '';
  const variant = line_item.variant || {};
  const price = variant.price || 0;
  const quantity = parseInt(line_item.quantity || 0);
  const image = variant.image || {};
  const src = image.src;
  const title = line_item.title || '';
  const description = line_item.description || '';
  let oos = line_item.inventory - quantity <= THRESHOLD;
  const giftWithPurchaseTitles = constants.giftsWithPurchase.map(gift => gift.productTitle);
  if (constants?.notEditableInCart?.includes(line_item.title)) oos = false;
  if (giftWithPurchaseTitles.includes(line_item.title)) oos = false;

  const warning = oos ? { backgroundColor: warningColor } : undefined;

  // const nailProduct = isLoading ? [] : nailProducts.filter( product => product.variantId === id)
  // TODO: check collectionTitle later
  const collectionTitle = line_item.collectionTitle;
  const discountAllocations = line_item.discountAllocations ? line_item.discountAllocations : [];

  if (!src) {
    updateLineItemInCart(id, 0);
    return <div></div>;
  }

  return (
    <Box
      position="relative"
      display="flex"
      p={'12px'}
      my={'10px'}
      background={freeItem ? '#F5DED1' : isCart ? '#F9F9F9' : '#fff'}
      fontSize="14px"
      style={warning}
    >
      {isCart && !notEditable && (
        <Box
          position="absolute"
          right="12px"
          top={0}
          fontSize="28px"
          style={{ cursor: 'pointer' }}
          data-testid="remove-line-item"
          onClick={() => removeItem(id)}
        >
          ×
        </Box>
      )}
      {src ? <CartImg src={src} alt={`${title} product shot`} /> : null}
      <Box pl={4} display="flex" flexDirection="column" justifyContent="space-between" width="100%">
        <Box width="calc(100% - 20px)">
          {title} <br /> {collectionTitle}
        </Box>
        {oos && (
          <Box
            mt={-20}
            px={1}
            background={'white'}
            color={warningColor}
            lineHeight={1.5}
            textTransform={'uppercase'}
            textAlign={'center'}
            width={'90px'}
          >
            {' '}
            Out of Stock
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" textAlign="center">
            {!notEditable && (
              <PlusMinusButton onClick={() => decrementQuantity(id)}>-</PlusMinusButton>
            )}
            <Box minWidth="30px" display={!freeItem ? 'block' : 'none'}>{`${
              notEditable ? 'Qty: ' : ''
            }${line_item.quantity}`}</Box>
            {!notEditable && (
              <PlusMinusButton onClick={() => incrementQuantity(id)}>+</PlusMinusButton>
            )}
          </Box>
          <Box>$ {(quantity * price).toFixed(2)}</Box>
        </Box>
        {discountAllocations.map((entry, index) => {
          const amount = parseFloat(entry.allocatedAmount.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            useGrouping: false,
          });
          return (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              style={{ marginTop: '-2em' }}
              alignItems="center"
            >
              <Box display="flex" alignItems="center" textAlign="center">
                Promotion
              </Box>
              <Box>-$ {amount}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
