import React from 'react';
import log from '../utils/logging'
import { updateUserColumn } from 'api/user';
;
import ShopifyHOC from './ShopifyHOC';
import { setItemToLocalStorage, getItemFromLocalStorage } from '../utils/localStorageHelpers';
import {getCheckout, createDefaultCheckout, applyDiscountCode} from 'api/cart'
import { retryPromise } from '../utils/retry';
import {addItemList} from 'api/cart'
import { AvailableCarts } from 'actions/cart';
import { withRouter } from 'next/router';
import { isHiddenTitle } from 'utils/cartUtils';

// TODO: encode of "gid://shopify/ProductVariant/" + MIRELLACOAT_VARIANT_ID, WELCOME_VARIANT_ID 
const input = {
  allowPartialAddresses: true,
  lineItems: [
    {
      quantity: 1,
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDAxNTkzMTk0MDk3Mw=='
    },
  ],
  shippingAddress: {
    address1: '-',
    address2: '-',
    city: 'Los Angeles',
    company: '-',
    country: 'US',
    firstName: '-',
    lastName: '-',
    province: 'CA',
    zip: '-',
  }
}

const groupGiftInput = {
  allowPartialAddresses: true,
  lineItems: [
    {
      quantity: 1,
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDAxNTkzMTk0MDk3Mw=='
    },
  ],
  shippingAddress: {
    address1: '1625 Olympic Blvd',
    address2: '-',
    city: 'Santa Monica',
    company: '-',
    country: 'US',
    firstName: '-',
    lastName: '-',
    province: 'CA',
    zip: '90404',
  }
}

class ShopifyLifecycle extends React.Component<any, any> {

  //const identityId = (((this || {}).props || {}).userData || {}).identityId || undefined;
  // updateUserColumn(identityId, 'checkoutId', checkout.id);
  locked = false;
  state = {
    mounted: false,
  }

  constructor(props){
    super(props)
  }


  mergeCart = async (from, toCheckoutId) => {
    log.info('merging carts');
    try {
      const list = from.lineItems.edges.map(item => {
        if(isHiddenTitle(item.node?.title)) {
          return;
        }
        const productType = item?.node?.variant?.product?.productType || '';
        const profileId = productType ? (this.props.profileIds.find(profile => profile.profileType === productType))?.profileId: undefined;
        return ({
          variantId: item?.node?.variant?.id,
          quantity: parseInt(item.node.quantity, 10),
          customAttributes:  profileId ? [
            {key: 'profileId', value: profileId }
          ]: undefined
        });
      });

      // ideally would merge to the "to" cart
      const discount = from.customAttributes.find(element=>element.key === 'discountName');
      let result = await addItemList(toCheckoutId, list);
      
      

      if(discount) {
        result = await applyDiscountCode(toCheckoutId, discount.value, AvailableCarts.MainCart);
      }
      this.props.dispatchSetCheckout(result)

      // OPTIMIZE: refactor this to clear default checkout
      const defaultCheckout = {
        id: undefined
      }


    } catch (err) {
      log.verbose('[mergeCart] err =>', err);
      log.error(
        `[ShopifyLifecycle] mergeCartError`,
        {
          err,
        },
      );
    }
  }
  retrieveCheckoutData = async (checkoutId) => {

    try{
      const res = await getCheckout(checkoutId)

      let checkout = res;
      if (checkout) {
        
        this.props.dispatchSetCheckout(checkout);
        const _checkoutId = checkout.id
        log.verbose('got checkout ', {checkoutId: _checkoutId, checkout})
        return _checkoutId
      } else {
        checkout = await createDefaultCheckout();
        this.storeCheckoutId(checkout.id)
        this.props.dispatchSetCheckout(checkout);
        return checkout.id
      }
    }
    catch(err){
      log.error('[retreiveCheckoutData] err =>', err);
      const checkout = await createDefaultCheckout();
      this.storeCheckoutId(checkout.id)
      this.props.dispatchSetCheckout(checkout);
      return checkout.id;
      
    };
  }

  retrieveGroupGiftCartData = async checkoutId => {

    try{
      const res = await getCheckout(checkoutId)
      const checkout = res
      if (checkout) {
        this.props.dispatchSetGroupGiftObject(checkout);
      } 
    }catch(err){

      log.info('[retrieveGroupGiftCartData] err =>', {err, checkoutId});
    };
  }

  async storeCheckoutId(checkoutId){
    const isAuth = (((this || {}).props || {}).userData || {}).isAuth || undefined;
    if(isAuth){
      const userData = ((this || {}).props || {}).userData;
      updateUserColumn(userData.identityId, 'checkoutId', checkoutId);
    }else{
      setItemToLocalStorage('checkoutId', checkoutId)
    }
    this.props.dispatchSetKeyValue('checkoutId',checkoutId)
  }

  async storeGroupGiftCartId(groupGiftCartId){
    const isAuth = (((this || {}).props || {}).userData || {}).isAuth || undefined;
    if(isAuth){
      const userData = ((this || {}).props || {}).userData;
      updateUserColumn(userData.identityId, 'groupGiftCartId', groupGiftCartId);
    }else{
      setItemToLocalStorage('groupGiftCartId', groupGiftCartId)
    }
    this.props.dispatchSetKeyValue('groupGiftCartId',groupGiftCartId)
  }

  async mount(){

    const isAuth = (((this || {}).props || {}).userData || {}).isAuth || undefined;
    const mainCartData = ((this || {}).props || {}).mainCartData || {};
    const userData = ((this || {}).props || {}).userData;

    const checkoutId =  isAuth ? userData?.checkoutId : getItemFromLocalStorage("checkoutId");

    log.verbose("componentDidMount ShopifyLifecycle", {isAuth, mainCartData, userData})

    ///***** this meeds to be reafactoed whe the actual data/tables/apiis available */
    const groupGiftCartId = isAuth ? userData?.description : getItemFromLocalStorage('multiPackCartId')

    let checkout = undefined;


    try {
      checkout = await getCheckout(checkoutId)
      log.verbose('got checkout ', checkout)
    }catch(retrieveError){

      if(checkoutId){
        log.error(`ShopifyLifecycle.mount: could not get checkout id ${checkoutId} going to create a new one`, retrieveError )
      }else {
        log.verbose(`ShopifyLifecycle.mount: no checkout id defined, new visitor, creating new checkout`, retrieveError )
      }
      try{
        checkout = await createDefaultCheckout();
        this.storeCheckoutId(checkout.id)
        this.props.dispatchSetCheckout(checkout);
      }catch(createError){
        log.error(`ShopifyLifecycle.mount: could not create default checkout`)
      }
    }

    if(!checkout){
      log.error("potentially fatal error, could not create/retrieve checkout ")
    }else{
      this.props.dispatchSetCheckout(checkout)
    }
      
    try{
      if(groupGiftCartId){ //retrieve
        const _groupGiftId = await this.retrieveGroupGiftCartData(groupGiftCartId)
        if(groupGiftCartId !== _groupGiftId){
          this.storeGroupGiftCartId(_groupGiftId)
        }
      } 
    }catch(err){
      log.error("could not load group gift cart ", err)
    }
    
    this.setState({mounted: true});

    if(this.props.router?.query?.partnerCode){
      const partnerCode = this.props.router?.query?.partnerCode as string;
      applyDiscountCode(checkout.id, partnerCode, AvailableCarts.MainCart, true);
    }

  }

  async update(prevProps){
    const isAuth = (((this || {}).props || {}).userData || {}).isAuth || undefined;
    const prevAuth = prevProps?.userData?.isAuth


    let checkout = this.props?.mainCartData?.cart

    if(this.locked){
      return;
    }
    if(!checkout?.id  ){
      this.locked = true;
      log.verbose("ShopifyLifecycle.update creating default checkout because one does not exist", {isAuth})
      try{
        checkout = await createDefaultCheckout();
        this.storeCheckoutId(checkout.id)
        this.props.dispatchSetCheckout(checkout);
      }catch(error){
        log.error("problems creating default checkout" , {error})
      }

      this.locked = false;
      return;
    }


    if(isAuth && isAuth!==prevAuth){
        log.verbose("ShopifyLifecycle.update merging carts from prev auth to auth", {isAuth})
        setItemToLocalStorage("checkoutId", "");
        setItemToLocalStorage("groupGiftCartId", "")
        const prevCheckout = prevProps.mainCartData.cart;
        const userData = ((this || {}).props || {}).userData;
        const checkoutId = userData?.checkoutId 
        const groupGiftCartId = userData?.description
        const shopifyLoginPromise = this.loginCustomer(this?.props?.userData.email, checkoutId)

        if(checkoutId){ // retrieve
          const _cart = await getCheckout(checkoutId)
          this.mergeCart(prevCheckout, checkoutId)
        }else{ // create
          checkout = await createDefaultCheckout();
          this.storeCheckoutId(checkout.id)
          this.mergeCart(prevCheckout, checkout.id)
        }

        try{
          await shopifyLoginPromise;
        }catch( err ){
          log.error('could not log into shopify account, ', {err});
        }
    
        try{ 
          await shopifyLoginPromise;
        }catch(error){
          log.error('could not create shopify token', {error});
        }

        if(groupGiftCartId){ //retrieve
          const _groupGiftId = await this.retrieveGroupGiftCartData(groupGiftCartId)
          if(groupGiftCartId !== _groupGiftId){
            this.storeGroupGiftCartId(_groupGiftId)
          }
        } 

        // dispatch merge cart with previous props
      }
  }

  componentDidMount() {
    this.mount();
  }
  componentDidUpdate(prevProps) {
   
    if(this.state.mounted){
      this.update(prevProps)
    }
  }

  loginCustomer = async (email, checkoutId) => {

    try {
      let tokenResponse = await retryPromise(this.customerAccessTokenCreatePromise, [email, 'admin'], '[ShopifyLifecycle] Create Shopify Token');
      const customerAccessToken = ((tokenResponse || {}).customerAccessToken || {}).accessToken || '';
      let checkout = await retryPromise(this.checkoutCustomerAssociatePromise, [checkoutId, customerAccessToken], '[ShopifyLifecycle] Customer Associate');
    } catch (err) {
      log.error('[ShopifyLifecycle] loginCustomer ' + err, { err, email, checkoutId }  );
    }
  }

  checkoutCustomerAssociatePromise = (checkoutId, customerAccessToken) => {
    return new Promise((resolve, reject) => {
      this.props.associateCartToCustomer(checkoutId, customerAccessToken )
      .then(result => {
        const userErrors = result.userErrors || [];

        if (userErrors.length == 0) resolve(result);
        else reject(userErrors[0]);
      })
      .catch(err => {
        log.info('[checkoutCustomerAssociate]', err);
        reject(err);
      })
    });
  }

  customerAccessTokenCreatePromise = (email, password) => {
    return new Promise((resolve, reject) => {
      this.props.createAccessToken(email, password)
      .then(result => {
        const userErrors = result.userErrors || [];

        if (userErrors.length == 0) resolve(result);
        else reject(userErrors[0]);
      })
      .catch(err => reject(err))
    });
  }

  render() {
    return (
      <></>
    );
  }
};

export default withRouter(ShopifyHOC(ShopifyLifecycle));
