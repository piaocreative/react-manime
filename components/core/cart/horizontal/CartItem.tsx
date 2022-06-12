import React, { Component } from 'react';
import Box from 'components/styled/Box';
import styled from 'styled-components';
import styles from '@styles/gift/group/cart.module.css'


type LineItemProps = {
  updateLineItem?: Function,
  checkoutId: string, 
  line_item: any,
  notEditable?: any, 
  isCart: any,
  freeItem?: any,
  inventory?: any,
  hidePrice?: boolean,
}

export default function LineItem ({updateLineItem, hidePrice, ...props}: LineItemProps) {


  function removeItem(lineItemId) {
    
    updateLineItem(lineItemId, 0, props.checkoutId)
  }


    const THRESHOLD = process.env.OUT_OF_STOCK_THRESHOLD;
    const warningColor = '#ED7658'
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
    const oos = (line_item.inventory - quantity) <= parseInt(THRESHOLD )
    const warning = oos ? {backgroundColor: warningColor} : undefined

   // const nailProduct = isLoading ? [] : nailProducts.filter( product => product.variantId === id)
    // TODO: check collectionTitle later
    const collectionTitle = line_item.collectionTitle;
    const discountAllocations = line_item.discountAllocations ? line_item.discountAllocations : [];

    if (!src) {
      return <div></div>;
    }

    return (
      <div  className={ styles.cartItemContiner}>
         {updateLineItem &&
         <div className={styles.removeItem} onClick={() => removeItem(id)}>
         ×
       </div>
         } 
        { src ? <img className={styles.cartImage} src={src} alt={`${title} product shot`} /> : null}

          <div className={styles.itemTitle}>
            {`${quantity}x ${title}`} <br />
            {!hidePrice && <div className={styles.priceLabel}>${price}</div>}
          </div>
          {oos && <Box  background={'white'} color={warningColor} lineHeight={1.5} textTransform={"uppercase"} textAlign={'center'} width={'90px'}> Out of Stock</Box> }

          

      </div>
    );
  }

