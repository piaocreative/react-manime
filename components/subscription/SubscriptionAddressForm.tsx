import style from '@styles/subscription/redeem.module.css';
import OrderSummary from "components/subscription/OrderSummary";
import ShippingAddress from 'components/checkout/Shipping'
import FitWall from "components/core/hoc/FitWall";
import { AvailableCarts } from "actions/cart";
function SubscriptionAddressForm({next, updateShippingAddress, error, isDisabled=false}){
  return(
    <div className={style.shippingContainer}>

    <ShippingAddress  onSelectAddress={updateShippingAddress} next={next} isDisabled={isDisabled} error={error}/>
    <OrderSummary />
  </div>
  )
}

export default FitWall(SubscriptionAddressForm, AvailableCarts.SubscriptionCart)