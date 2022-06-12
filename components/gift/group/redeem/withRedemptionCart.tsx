import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createCart,
  addItemList,
} from 'api/cart';
import { redeemGroupGift } from 'api/order';
import { useRouter } from 'next/router';
import log from 'utils/logging';
import { SetCart, SetCartReadyStatus, AvailableCarts } from 'actions/cart';
import AuthWall from 'components/AuthWallHOC'

function withRedemptionCart(WrappedComponent){
  function _withRedemptionCart(props){
    const router = useRouter();
    let memberId = router.asPath.substring(router.asPath.indexOf('mid=') + 4);
  
    if (memberId.includes('&')) {
      memberId = memberId.substring(0, memberId.indexOf('&'));
    }
    const [isMounted, setIsMounted] = useState(false);
    const dispatch = useDispatch();
    const { userData, cart } = useSelector((state : any) => {
      return {
        userData: state.userData,
        cart: state[AvailableCarts.GroupGiftCart],
      };
    });
    useEffect(() => {
      mount();
    }, []);
  
    async function mount() {
      setIsMounted(true);
  
      try {
        dispatch(SetCartReadyStatus(false, AvailableCarts.GroupGiftCart));
        const groupGift = await redeemGroupGift(memberId);
        groupGift['memberId'] = memberId;
  
        const variantList = groupGift.groupGiftLineItems.map((lineItem) => {
          return {
            variantId: btoa(`gid://shopify/ProductVariant/${lineItem.variantId}`),
            quantity: lineItem.quantity,
          };
        });
        let _cart = await createCart({
          firstName: userData.name.firstName,
          lastName: userData.name.lastName,
          email: userData.email
        });
        log.verbose('cart is ', _cart);
        _cart = await addItemList(_cart.id, variantList);
  
        dispatch(SetCart(_cart, AvailableCarts.GroupGiftCart));
      } catch (error) {
        log.error(error);
      }
    }

    let toRender = null;
    if(isMounted && cart.isReady){
      toRender = <WrappedComponent props></WrappedComponent>
    }
    return toRender
  }
  return AuthWall(_withRedemptionCart)
};

export default withRedemptionCart;
