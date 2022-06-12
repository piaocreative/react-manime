import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { trackFunnelActionProjectFunnel, track } from '../../utils/track';
import { saveAddressId } from '../../utils/localStorageHelpers';
import { StandardLabel, StandardOutlinedButton, StyledStandardDarkButton } from '../styled/StyledComponents';
import Box from '../styled/Box';

import {
  updateUserColumn,
  addShippingAddress,
  editShippingAddress,
  getShippingAddressWithIndentity,
} from 'api/user';
import ShopifyHOC from '../ShopifyHOC';
import {SET_KEY_VALUE} from 'actions'

import { SetShippingData } from 'actions/cart';

import ShippingAddressBar from '../ShippingAddressBar';
import ShippingAddressDialog from '../ShippingAddressDialog';

import log from '../../utils/logging'

const RootContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const AddressBarList = styled(Box)`
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 8px;
`;

const ActionButtons = styled(Box)`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
type Props = {
  userData,
  dispatchSetShippingData,
  profile,
  onSelectAddress,
  dispatchSetDefaultShippingAddress,
  next,
  isDefaultShippingAddress,
  tabClickHandler,
  updateShippingAddress,
  hideActions,
  isDisabled,
  error
}
type State = {
    // description: '',
    fullName,
    addressLine1,
    addressLine2,
    city,
    zipCode,
    state,
    country,
    errorZipCode,
    discountCode,
    inputValue,
    loading,
    redeemValid,
    total,
    variantIdNumber,
    defaultAddressList,
    selectedAddressIndex,
    isOpenDialog,
    error,
}
class CheckoutForm extends React.Component<Props, State>{
  state = {
    // description: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    state: '',
    country: '',
    errorZipCode: false,
    discountCode: '',
    inputValue: '',
    loading: true,
    redeemValid: -1,
    total: 0.00,
    variantIdNumber: 0,
    defaultAddressList: [],
    selectedAddressIndex: 0,
    isOpenDialog: false,
    error: ''
  };

  initialize = async () => {
    const { userData } = this.props;
    const { identityId } = userData;
    // const shippingAddresses = this.props.shippingAddresses;
    let result = [];
    let length = 0;

      try {
        this.setState({loading: true});
        result = await getShippingAddressWithIndentity(identityId);
        this.setState({loading: false});
        result = result.filter(item => item.visible);
        length = result.length;
        this.setState({defaultAddressList: result});
        this.props.dispatchSetShippingData(result);
      } catch (err) {
        log.error(
          '[Shipping] Error Shipping.js getShippingAddressWithIdentity',
          {
              err,
              state: this.state,
          },
        );
      }
    // }
    this.setDefaultAddressById(result, this.props.userData.defaultShippingAddressId);
  }

  componentDidMount() {

    if (this.props.profile) {
      trackFunnelActionProjectFunnel(`/profile/shipping-payment`);
      track('[profile][shipping] mount')
    }
    else {
      trackFunnelActionProjectFunnel(`/checkout/shipping - same as /checkout`);
      track('[checkout][shipping')
    }

    const { userData } = this.props;
    if (userData.identityId) {
      this.initialize();
    }
  }


  componentDidUpdate (prevProps, prevState) {
    const { userData } = this.props;
    if (prevState.defaultAddressList.length !== this.state.defaultAddressList.length) {
      return;
    } else if ((prevProps.userData.identityId === '' && userData.identityId !== '')) {
      this.initialize();
    }
    // FIXME:
    // OPTIMIZE:
    if (prevState.selectedAddressIndex != this.state.selectedAddressIndex || prevState.defaultAddressList != this.state.defaultAddressList)
      this.updateShopifyShipping();
  }

  addEditShippingAddress = async data => {
    const body = {
      shippingAddressId: data.shippingAddressId ? data.shippingAddressId : '',
      userId: this.props.userData.identityId,
      name: data.fullName || `${this.props.userData.name.firstName} ${this.props.userData.name.lastName}`,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressCity: data.city,
      addressZip: data.zipCode,
      addressState: data.state,
      addressCountry: data.country,
      addressLatitude: 0,
      addressLongitude: 0,
    };

    try {
      const latestShippingAddress = (data.shippingAddressId) ? await editShippingAddress(body) : await addShippingAddress(body);
      const updatedShippingAddressId = latestShippingAddress && latestShippingAddress.shippingAddressId ? latestShippingAddress.shippingAddressId : data.shippingAddressId;
      // FIXME: track
      // log.info(`addEditShippingAddress updatedShippingAddressId = ${updatedShippingAddressId}`);

      updateUserColumn(this.props.userData.identityId, 'defaultShippingAddressId', updatedShippingAddressId);
      saveAddressId(this.props.userData.identityId, {shippingAddressId: updatedShippingAddressId });
      return updatedShippingAddressId;
    } catch (err) {
      log.error(
        '[Shipping] addEditShippingAddress(data) Error in Shipping.js ' + err,
        {
            data,
            body,
            err,
        },
      );
    }
  }

  setDefaultAddressById = (defaultAddressList, defaultShippingAddressId) => {
    if (!Array.isArray(defaultAddressList) || defaultAddressList.length <= 0) {
      // log.info('setDefaultAddressById error');
      return;
    }

    let defaultIndex = 0;
    defaultAddressList.map((shippingAddress, index) => {
      if (shippingAddress.shippingAddressId == defaultShippingAddressId) defaultIndex = index;
    });

    // log.info(`setDefaultAddressById found object`, defaultAddressList[defaultIndex]);

    const { addressLine1, addressLine2, addressCity: city, addressState: state, addressZip: zipCode, name: fullName } = defaultAddressList[defaultIndex];
    this.setState({
      addressLine1, addressLine2, city, state, zipCode,
      fullName: fullName || `${this.props.userData.name.firstName} ${this.props.userData.name.lastName}`
    }, () => this.updateShopifyShipping());
    this.selectChangeHandler(defaultIndex);
  }

  onSubmit = ev => {
    ev.preventDefault();
  };

  openNewDialogHandler = () => {
    this.setState({isOpenDialog:true});
  }

  addNewAddressHandler = async data => {

    const { defaultAddressList } = this.state;
    const {
      addressLine1,
      addressLine2,
      // description,
      fullName,
      city,
      zipCode,
      state,
      country,
    } = data;
    const shippingAddressId = await this.addEditShippingAddress(data);

    this.setState({
      addressLine1,
      addressLine2,
      // description,
      fullName,
      city,
      zipCode,
      state,
      country,
      defaultAddressList: [{
        addressZip: zipCode,
        addressState: state,
        addressCity: city,
        // name: description,
        shippingAddressId,
        name: fullName,
        addressLine1,
        addressLine2
      }, ...defaultAddressList
      ]}, () => {

      this.selectChangeHandler(0);
      const fullNameArray = fullName.split(' ');
      let firstName = fullNameArray[0];
      let lastName = fullNameArray.length > 1 ? fullNameArray[1] : '-';
      const param = {
        address1: addressLine1,
        address2: addressLine2,
        city,
        country: 'US',
        firstName,
        lastName,
        province: state,
        zip: `${zipCode}`,
      };
      this.props.updateShippingAddress(param)
      this.props.dispatchSetShippingData(this.state.defaultAddressList);

    });
  }

  selectChangeHandler = index => {

    try {
      const { onSelectAddress } = this.props;
      const { defaultAddressList } = this.state;
      const { addressLine1, addressLine2, addressCity, addressState, addressZip, name, shippingAddressId } = defaultAddressList[index];
      this.setState({
        selectedAddressIndex: index,
        addressLine1,
        addressLine2,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        // description: name
        fullName: name || `${this.props.userData.name.firstName} ${this.props.userData.name.lastName}`
      });
      onSelectAddress(defaultAddressList[index]);
      saveAddressId(this.props.userData.identityId, {shippingAddressId});
      updateUserColumn(this.props.userData.identityId, 'defaultShippingAddressId', shippingAddressId);
      this.props.dispatchSetDefaultShippingAddress(shippingAddressId);
    } catch (error) {
      log.error(`[Shipping][selectChangeHandler] caught error ${error}`, {error});
    }
  }

  addressChangeHandler = (index, data) => {

    const { defaultAddressList } = this.state;
    this.setState({selectedAddressIndex: index});

    const newDefaultAddressList = [...defaultAddressList];
    newDefaultAddressList[index] = {
      ...newDefaultAddressList[index],
      addressCity: data.city,
      addressCountry: data.country,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressState: data.state,
      addressZip: data.zipCode,
      name: data.fullName,
    };
    this.setState({
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      fullName: data.fullName,
      city: data.city,
      zipCode: data.zipCode,
      state: data.state,
      country: data.country,
      defaultAddressList: newDefaultAddressList
    }, () => {});
    this.addEditShippingAddress(data);
  }

  removeAddressHandler = async index => {

    const { defaultAddressList, selectedAddressIndex } = this.state;
    let newDefaultAddressList = [...defaultAddressList];
    if (index < 0 || index >= newDefaultAddressList.length) {
      log.error('[Shipping] removeAddressHandler',  { index, selectedAddressIndex } );
      return;
    }
    try {
      const body = {
        shippingAddressId: defaultAddressList[index].shippingAddressId,
        visible: false
      };
      await editShippingAddress(body);
      newDefaultAddressList = newDefaultAddressList.filter((item, itemIndex) => index !== itemIndex );
      this.props.dispatchSetShippingData(newDefaultAddressList);
      await this.setState({
        defaultAddressList: newDefaultAddressList,
        selectedAddressIndex: selectedAddressIndex > index ?
        selectedAddressIndex - 1 :
        (selectedAddressIndex === index ? 0 : selectedAddressIndex)
      });
      if (selectedAddressIndex === index && newDefaultAddressList.length > 0) {
        this.selectChangeHandler(0);
      }
    } catch (err) {
      log.error(`[Shipping] removeAddressHandler ` + err, {err, userId: this.props.userData.identityId }  );
    }
  }

  navToPaymentHandler = async () => {
    if(this.props?.next?.action){
      this.props.next.action();
      return;
    }

    try {
      this.setState({loading: true});
      await this.updateShopifyShipping();
      this.setState({loading: false});
      const isDefaultShippingAddress = this.props.isDefaultShippingAddress();
      if (!isDefaultShippingAddress) {
        this.props.tabClickHandler(1);
      } else {
        trackFunnelActionProjectFunnel('isDefaultShippingAddress, pressed continue but unable to continue');
      }

      window['dataLayer'] && window['dataLayer'].push({
        event: 'addPaymentInfo',
      });

    } catch (err) {
      log.error('[Shipping] navToPaymentHandler ' + err, { err } );
      this.setState({error: 'Sorry! We could not update your address as a valid US address. Please try again or reach out to care@manime.co with any questions', loading: false});
    }
  }

  updateShopifyShipping = () => {
    log.verbose('updateshopifyshiping v1')
    const fullNameArray = this.state.fullName.split(' ');
    let firstName = fullNameArray[0];
    let lastName = fullNameArray.length > 1 ? fullNameArray[1] : '-';
    if (!firstName || firstName == '') firstName = '-';
    if (!lastName || lastName == '') lastName = '-';
    const { addressLine1, addressLine2, city, state, zipCode } = this.state;

    if (!addressLine1 || !city || !state || !zipCode) {

      // log.info('Shipping Address not ready');
      trackFunnelActionProjectFunnel('Shipping Address not ready');

      return;
    }

    const param = {
      address1: addressLine1,
      address2: addressLine2,
      city,
      country: 'US',
      firstName,
      lastName,
      province: state,
      zip: `${zipCode}`,
    };


    // log.info('updateShopifyShipping in Shipping.js', param);
    trackFunnelActionProjectFunnel('updateShopifyShipping in Shipping.js', param);

    if (!addressLine1 || !city || !state || !zipCode) {
      trackFunnelActionProjectFunnel('Shipping Address not ready');
      return;
    }

    return new Promise((resolve, reject) => {
      this.props.updateShippingAddress(param)
      .then(async res => {
        // log.info(res);
        const checkoutUserErrors = ( res || {}).checkoutUserErrors || [];
        if (checkoutUserErrors && checkoutUserErrors.length > 0) {
          reject('unable to update - v2');
          log.error(
            '[Shipping] updateShopifyShipping',
            {
              checkoutUserErrors,
            },
          );
          return;
        }

        resolve('address successful');
      })
      .catch(err => {
        log.error(
          '[Shipping] updateShopifyShipping Error ' + err,
          {
              err,
              state: this.state,
          },
        );
      });
    });
  }

  render() {
    const { userData, hideActions } = this.props;
    const { defaultAddressList, selectedAddressIndex, isOpenDialog, loading } = this.state;
    const error = this.state.error || this.props.error || undefined
    return (
          <RootContainer>
            <StandardLabel mt={2}>Previously used:</StandardLabel>
            <AddressBarList height='200px' display='block'>
              {defaultAddressList.map((address, index) => (
                <ShippingAddressBar
                  key={index}
                  order={index}
                  data={address}
                  userData={userData}
                  isSelected={index===selectedAddressIndex}
                  onChange={(data) => this.addressChangeHandler(index, data)}
                  onSelect={() => this.selectChangeHandler(index)}
                  onRemove={() => this.removeAddressHandler(index)} />
              ))}
            </AddressBarList>
            <ActionButtons mt={3}>
              <StandardOutlinedButton
                fontFamily='Avenir'
                onClick={this.openNewDialogHandler}
                border='1px solid #000'
                color='#000'
                width='100%'
                fontSize={['12px', '14px']}
                height='40px'
                px={['4px', '20px']}
                style={{textTransform: 'uppercase'}}
                >
                Add new address
              </StandardOutlinedButton>
              {!hideActions && <form onSubmit={this.onSubmit}>
                <Box width={1} display='flex' justifyContent='center' flexDirection='column'>
                  <StyledStandardDarkButton
                    disabled={defaultAddressList.length === 0 || loading || this.props.isDisabled }
                    fontFamily='Avenir'
                    onClick={this.navToPaymentHandler}
                    border='1px solid #fa6a00'
                    color='white'
                    fontSize={['12px', '14px']}
                    height='40px'
                    width='100%'
                    px={['4px', '20px']}
                    waitTime={5000}
                    loading={loading || this.props.isDisabled}
                    style={{textTransform: 'uppercase'}} >
                    {this.props.next?.label || "Continue to Payment Info"}
                  </StyledStandardDarkButton> 
                </Box>
              </form>}
            </ActionButtons>
            {isOpenDialog &&
              <ShippingAddressDialog
                isAdd
                key={-1}
                opened={isOpenDialog}
                onDataChange={data => this.addNewAddressHandler(data)}
                onClose={() => this.setState({isOpenDialog: false})} />
            }
            { error &&
              <Box color='red' mt={'20px'}>{error}</Box>
            }
          </RootContainer>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  uiData: state.uiData,
  mainCartData: state.mainCartData,
  shippingAddresses: state.uiData.shippingAddresses
});

const mapDispatchToProps = dispatch => ({
  dispatchSetDefaultShippingAddress: defaultShippingAddressId => dispatch(SET_KEY_VALUE('defaultShippingAddressId', defaultShippingAddressId)),
  dispatchSetShippingData: addresses => dispatch(SetShippingData(addresses)),

});


const _CheckoutForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutForm);

export default ShopifyHOC(_CheckoutForm);
