// post to shipstation

import axios from 'axios';
import { Base64 } from 'js-base64';

export function createUpdateSSOrder(orderObject) {
  const encodedKeys = Base64.encode('70207c47a0e34ee4a1dbee8ec0d029f9:f2e68a8eb71d415cb1c434ff54349055');
  const Authorization = `Basic ${encodedKeys}`;

  axios({
    method: 'post',
    url: 'https://ssapi.shipstation.com/orders/createorder',
    headers: { 'Authorization': Authorization },
    data: {
      'orderNumber': orderObject.orderNumber,
      'orderKey': orderObject.orderKey,
      'orderDate': orderObject.orderDate,
      'shipByDate': orderObject.shipByDate,
      'orderStatus': orderObject.orderStatus,
      'customerUsername': orderObject.customerUsername,
      'customerEmail': orderObject.customerEmail,
      'billTo': orderObject.billTo,
      'shipTo': orderObject.shipTo
    }

  })
  .then(result => log.info(result));
}

// data: {
//   'orderNumber': 'TEST-ORDER-API-DOCS',
//   'orderKey': '0f6bec18-3e89-4881-83aa-f392d84f4c74',
//   'orderDate': '2015-06-29T08:46:27.0000000',
//   'shipByDate': '2015-07-05T00:00:00.0000000',
//   'orderStatus': 'awaiting_shipment',
//   'customerUsername': 'headhoncho@whitehouse.gov',
//   'customerEmail': 'headhoncho@whitehouse.gov',
//   'billTo': {
//     'name': 'The President',
//     'company': null,
//     'street1': null,
//     'street2': null,
//     'street3': null,
//     'city': null,
//     'state': null,
//     'postalCode': null,
//     'country': null,
//     'phone': null,
//     'residential': null
//   },
//   'shipTo': {
//     'name': 'The President',
//     'company': 'US Govt',
//     'street1': '1600 Pennsylvania Ave',
//     'street2': 'Oval Office',
//     'street3': null,
//     'city': 'Washington',
//     'state': 'DC',
//     'postalCode': '20500',
//     'country': 'US',
//     'phone': '555-555-5555',
//     'residential': true
//   }
// }
