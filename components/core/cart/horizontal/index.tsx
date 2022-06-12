import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import style from '@styles/gift/group/cart.module.css';
import { motion, useCycle } from 'framer-motion';

type Props = {
  updateLineItem?: Function;
  step?: string;
  cart: any;
  label?: string;
  isCollapsable?: boolean;
  showCartCount?: boolean;
  openOnCartChange?: boolean;
  hidePrice?: boolean,
  backgroundColor?: string,
  openHeight?: string,
  error?: string
};
const DEFAULT_LABEL = 'Gift Kit Contains';
export default function CollapseableCart({
  step,
  updateLineItem,
  cart,
  isCollapsable = true,
  showCartCount = true,
  label = DEFAULT_LABEL,
  openOnCartChange = true,
  hidePrice = false,
  backgroundColor = 'white',
  openHeight = '150px',
  error
}: Props) {
  const [cartState, toggleCart] = useCycle('closed', 'open');
  const [mounted, setMounted] = useState(false);
  const [lineItems, setLineItems ] = useState<any>([]);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (mounted && cartState === 'open') {
      toggleCart();
    }
  }, [step]);

  useEffect(() => {
    if(!cart?.lineItems?.edges){
      return
    };
    let _lineItems = cart?.lineItems?.edges?.filter(edge => {
      if (
        edge.node.title === "DON'T DELETE - not visible" ||
        edge.node.variant.product.productType === 'ManiBox'
      ) {
        return false;
      }else{
        return true;
      }
      
    })
    let _itemCount = 0;
    _lineItems = _lineItems.map(edge=>{

      _itemCount += edge.node.quantity;
      return (
        <CartItem
          isCart
          updateLineItem={updateLineItem}
          checkoutId={cart?.id}
          key={edge.node.id.toString()}
          line_item={edge.node}
          inventory={edge.node.inventory}
          hidePrice={hidePrice}
        />
      );
    });
    
    if(_itemCount !== itemCount){

      setLineItems(_lineItems);
      setItemCount(_itemCount)
    }


  }, [cart]);

  useEffect(()=>{
    if(mounted && cartState === "closed" && openOnCartChange ){
      toggleCart();
    }
  }, [itemCount])

  useEffect(()=>{
    setMounted(true)
  },[])

  const cartContentVariants = {
    open: {
      height: openHeight,
    },
    closed: isCollapsable
      ? {
          height: '0px',
        }
      : {
          height: openHeight,
        },
  };

  const controlVariants = {
    open: {
      rotate: 270,
    },
    closed: {
      rotate: 90,
    },
  };
  let subTotal = 0;

  let topBorder = !isCollapsable && {
    border: '0px'
  }

  return (
    <>
      <div className={style.topSection} style={{backgroundColor, ...topBorder}} onClick={() => toggleCart()}>
        <div className={style.bottomCartDetails} style={{color: error ? 'red' : 'black'}}>
          {error ? error : label} { (!error &&showCartCount) && <span>({itemCount}) items</span> }
        </div>
        <div className={style.bottonCartPrice}>{ !hidePrice && `$${(cart?.subtotalPrice || 0)} / Kit`}</div>

          {isCollapsable && (
                    <div className={style.cartControl}>
            <motion.img
              src="/static/icons/arrow-left-nocircle.svg"
              animate={cartState}
              transition={{ duration: 0.3 }}
              variants={controlVariants}
            />
                    </div>
          )}

      </div>
      <motion.div
        animate={cartState}
        transition={{ duration: 0.3 }}
        className={style.cartItems}
        style={{backgroundColor}}
        variants={cartContentVariants}
      >
        {lineItems}
      </motion.div>
    </>
  );
}
