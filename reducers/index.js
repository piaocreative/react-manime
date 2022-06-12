import { combineReducers } from 'redux';
import userData from './userData';
import uiData from './uiData';
import ordersData from './ordersData';
import cartReducerFactory from './cartReducerFactory';
import productsData from './productsData';
import profileData from './profileData';
import camera from './camera'
import {AvailableCarts} from 'actions/cart'
export default combineReducers({
  userData,
  uiData,
  ordersData,
  [AvailableCarts.MainCart]: cartReducerFactory(AvailableCarts.MainCart),
  [AvailableCarts.GroupGiftCart]: cartReducerFactory(AvailableCarts.GroupGiftCart),
  [AvailableCarts.SubscriptionCart]: cartReducerFactory(AvailableCarts.SubscriptionCart),
  productsData,
  profileData,
  cameraData: camera,
});
