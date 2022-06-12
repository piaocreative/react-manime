
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import log from '../utils/logging'
import ShippingDialogWrapper from './ShippingDialogWrapper';
import StandardButton from '../components/styled/StandardButton';
import ShippingSuggestLine from '../components/checkout/ShippingSuggestLine';
import { StandardLabel, StandardInputBox as StandardInput } from '../components/styled/StyledComponents';
import Box from '../components/styled/Box';
import { smartyStreetExtract } from 'api/util';

const NonDialogContainer = styled(Box)`
  padding: 16px;
  position: relative;
  width: 100%;
  min-height: 432px;
  background: transparent;
`;

const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled ? '#aaa': '#2C4349'};
  height: 40px;
  &:hover {
    transition: ease-out 0.3s;
    background: ${props => props.disabled ? '#aaa': '#35535b'};
  }
  margin-bottom: 12px;
  width: 100%;

  @media (min-width: 768px) {
    width: calc(50% - 24px);
  }
`;

const OutlinedActionButton = styled(ActionButton)`
  background: ${props => props.disabled ? '#aaa': 'transparent'};
  color: #2C4349;
  &:hover {
    transition: ease-out 0.3s;
    color: #2C4349;
    background: ${props => props.disabled ? '#aaa': 'transparent'};
  }
  border: 1px solid #2C4349;
`;

const SuggestBox = styled(Box)`
  // position: absolute;
  z-index: 300;
  // background: white;
  top: 40px;
  width: -webkit-fill-available;
  // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  padding: 8px 0;
`;

const CloseButton = styled(Box)`
  cursor: pointer;
  font-size: 32px;
`;

class ShippingAddressDialog extends Component {

  state = {
    shippingAddressId: null,
    formAddress: {
      addressLine1: '',
      addressLine2: '',
      fullName: '',
      city: '',
      zipCode: '',
      state: '',
      country: '',
    },
    smartyStreetExtractAddress: null,
    errorZipCode: false,
    errorFullName: false,
    errorAddressLine1: false,
    errorCity: false,
    errorState: false,

    // suggestionList: [],
    // selectedSuggestIndex: -1,
    // showMainDialog: true,
    // showNextDialog: false,
    // showNoneDialog: false,
    // extractionSuccess: false
    useExtractedAddress: true,
    currentStep: 0,
    loading: false,
  };

  updateState = (key, value) => {
    this.setState({
      formAddress: {
        ...this.state.formAddress,
        [key]: value
      }
    });
  };

  onBackClickHandler = () => {
    this.setState({
      currentStep: 0,
      smartyStreetExtractAddress: null
    });
  }

  extractAddress = async () => {

    const { addressLine1, addressLine2, city, state, zipCode, fullName } = this.state.formAddress;


    // if (fullName != '') {
    //   this.setState({ errorFullName: false });
    // } else {
    //   this.setState({ errorFullName: true });
    //   return;
    // }

    this.setState({
      errorFullName: fullName == '',
      errorAddressLine1: addressLine1 == '',
      errorCity: city == '',
      errorZipCode: zipCode == '',
      errorState: state == ''
    });

    if (fullName == '' || addressLine1 == '' || city == '' || zipCode == '' || state == '') {
      return;
    }

    let addressString = `${addressLine1} ${addressLine2} ${city} ${state} ${zipCode}`;
    // track('ShippingAddressDialog Extract Address Params', this.state.formAddress);
    let extractionSuccess = false;
    try {
      this.setState({loading: true});
      const extractedResult = await smartyStreetExtract(addressString);
      log.info(extractedResult);

      const output = extractedResult.addresses[0].api_output[0];
      const components = output.components;

      log.info(output);
      log.info(components);

      const street_predirection = (components || {}).street_predirection ? ' ' + (components || {}).street_predirection : '';
      const primary_number = (components || {}).primary_number || '';
      const street_name = (components || {}).street_name || '';
      const street_suffix = (components || {}).street_suffix || '';
      let secondary_designator = (components || {}).secondary_designator || '';
      let secondary_number = (components || {}).secondary_number || '';
      const city_name = (components || {}).city_name || '';
      const state_abbreviation = (components || {}).state_abbreviation || '';
      const zipcode = (components || {}).zipcode || '';

      const delivery_line_1 = (output || {}).delivery_line_1 || '';
      const last_line = (output || {}).last_line || '';

      // addressString = extractedAddress.delivery_line_1 + ' ' + extractedAddress.last_line;

      if (!secondary_designator) secondary_designator = '';
      if (!secondary_number) secondary_number = '';
      await this.setState({
        smartyStreetExtractAddress: {
          addressLine1: `${primary_number}${street_predirection} ${street_name} ${street_suffix}`,
          addressLine2: `${secondary_designator} ${secondary_number}`,
          city: city_name,
          zipCode: zipcode,
          state: state_abbreviation,
          lastLine: last_line,
          firstLine: delivery_line_1
        }
      });
      log.info(3232);
      log.info(this.state);
    } catch (err) {
      log.error(`[ShippingAddressDialogVariantB] Could not find address with extraction ${err}`, { err });
    }
    this.setState({loading: false});
    if (this.state.smartyStreetExtractAddress) {
      this.setState({
        currentStep: 1
      });
    } else {
      this.setState({
        currentStep: 2
      });
    }
  }

  doneHandler = async () => {
    // trackFlowMixpanel('3', 'doneHandler');
    let validated = true;

    // if (!Number.isInteger(Number(this.state.zipCode)) || this.state.zipCode === '') {
    //   validated = false;
    //   this.setState({ errorZipCode: true });
    // } else {
    //   this.setState({ errorZipCode: false });
    // }

    if (validated) {
      const addressToUse = this.state.useExtractedAddress && this.state.smartyStreetExtractAddress ? this.state.smartyStreetExtractAddress : this.state.formAddress;
      // const { shippingAddressId } = this.state;
      const shippingAddressId = this.state.useExtractedAddress && this.state.smartyStreetExtractAddress ? this.state.shippingAddressId: null;
      const { fullName } = this.state.formAddress;
      this.props.onDataChange({ ...addressToUse, shippingAddressId, fullName });
      this.props.onClose();
    }
  };

  componentDidMount() {
    const { data, isAdd } = this.props;
    if (isAdd) {
      return;
    }
    const { addressLine1, addressLine2, city, zipCode, state, country, fullName, shippingAddressId } = data;
    this.setState({
      shippingAddressId,
      formAddress: {
        addressLine1,
        addressLine2,
        city,
        zipCode,
        state,
        country,
        fullName,
      }
    });
  }

  // getSuggestionAddresses = async () => {
  //   const { addressLine1, addressLine2, city, state, zipCode } = this.state.formAddress;
  //
  //   let addressString = `${addressLine1} ${addressLine2} ${city} ${state} ${zipCode}`;
  //   try {
  //     const extractedResult = await smartyStreetExtract(addressString);
  //     log.info(extractedResult);
  //     const extractedAddress = extractedResult.addresses[0].api_output[0];
  //     // addressString = extractedAddress.delivery_line_1 + ' ' + extractedAddress.last_line;
  //     await this.setState({ extractionSuccess: true });
  //     return extractedAddress;
  //   } catch (err) {
  //     log.error('Could not find address with extraction', new Error('ShippingAddressDialog'), null, null, { customObj: err });
  //     await this.setState({ extractionSuccess: false });
  //   }
  //
  //   const result = await getSuggestions(addressString);
  //   return result;
  // }

  render() {
    const { onClose, noDialog } = this.props;
    const { currentStep, smartyStreetExtractAddress, useExtractedAddress, formAddress: { fullName, zipCode, addressLine1, addressLine2, city, state } } = this.state;
    const Wrapper = !noDialog ? ShippingDialogWrapper: NonDialogContainer;
    const closeLabel = noDialog ? null: '×';
    return (
      <Wrapper>
          { currentStep == 0 && <Fragment>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>{noDialog ? 'Add A Shipping Address': 'Shipping Address'}</Box>
            <CloseButton onClick={onClose}>{closeLabel}</CloseButton>
          </Box>
          <form onSubmit={this.onSubmit}>
            <Box fontSize={3} color='#616161' mt={3} color='forecolor.2' />
            <Box display='flex' width={1}>
              <Box flex={1}>
                <StandardLabel>Full name</StandardLabel>
                <StandardInput
                  transparent
                  value={fullName}
                  onChange={ev => this.updateState('fullName', ev.target.value)}
                  error={this.state.errorFullName}
                  errorText='Please enter your full name'
                />
              </Box>
            </Box>

            <StandardLabel>Address</StandardLabel>
            <StandardInput
              transparent
              value={addressLine1}
              onChange={ev => this.updateState('addressLine1', ev.target.value)}
              error={this.state.errorAddressLine1}
              errorText='Please enter your address'
            />
            <StandardInput
              transparent
              value={addressLine2}
              onChange={ev => this.updateState('addressLine2', ev.target.value)}
            />
            <Box display='flex' width={1}>
              <Box flex={1} mr={2}>
                <StandardLabel>City</StandardLabel>
                <StandardInput
                  transparent
                  value={city}
                  onChange={ev => this.updateState('city', ev.target.value)}
                  error={this.state.errorCity}
                  errorText='Please enter your city'
                />
              </Box>
              <Box flex={1} ml={2}>
                <StandardLabel>State</StandardLabel>
                <StandardInput
                  transparent
                  value={state}
                  onChange={ev => this.updateState('state', ev.target.value)}
                  error={this.state.errorState}
                  errorText='Please enter your state'
                />
              </Box>
            </Box>
            <Box display='flex' width={1}>
              <Box flex={1} mr={2}>
                <StandardLabel>Zip Code</StandardLabel>
                <StandardInput
                  transparent
                  value={zipCode}
                  onChange={ev => this.updateState('zipCode', ev.target.value)}
                  error={this.state.errorZipCode}
                />
              </Box>

              <Box flex={1} ml={2}>
                <StandardLabel>Country</StandardLabel>
                <StandardInput
                  disabled
                  transparent
                  color='#717171'
                  value='United States'
                />
              </Box>
            </Box>
            <Box width={1} display='flex' justifyContent={noDialog ? 'flex-end': 'center'} mt={2}>
              <ActionButton
                position={noDialog && ['unset', 'absolute']}
                mt={noDialog && [0, '24px']}
                mr={2}
                disabled={this.state.loading}
                onClick={this.extractAddress}>
                DELIVER TO THIS ADDRESS
              </ActionButton>
            </Box>
          </form>
          </Fragment>
          }
          { currentStep == 1 &&
            <Fragment>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box onClick={this.onBackClickHandler} style={{cursor: 'pointer'}}> {'< Back'} </Box>
                <CloseButton onClick={onClose}>{closeLabel}</CloseButton>
              </Box>
              <br />
              <Box>Verify your shipping address</Box>
              <Box fontSize='14px' mt={2}>
                We found the following USPS validated address. Please choose which address you want to use,
                 or click Edit next to the address you want to change.
              </Box>
              <Box mb='40px'>
              { smartyStreetExtractAddress &&
                <SuggestBox>
                  <ShippingSuggestLine
                    checked={true===useExtractedAddress}
                    address={smartyStreetExtractAddress.firstLine}
                    zipCode={`, ${smartyStreetExtractAddress.lastLine}`}
                    onClick={() => this.setState({ useExtractedAddress: true })}
                    onEdit={this.onBackClickHandler}
                  />
                  {/* <Box display='flex' alignItems='center'>
                    <input type='radio' checked={true===useExtractedAddress} onChange={() => this.setState({ useExtractedAddress: true })} />
                    <SuggestLine
                      checked={true===useExtractedAddress}
                      onClick={() => this.setState({ useExtractedAddress: true })} >
                      {smartyStreetExtractAddress.firstLine}{`, ${smartyStreetExtractAddress.lastLine}`}
                    </SuggestLine>
                  </Box> */}
                </SuggestBox>
              }
              </Box>
              <Box mt={4}>
                Not your address? Continue with: <br />
              </Box>
              <SuggestBox>
                {/* <Box display='flex' alignItems='center'>
                  <input type='radio' checked={false===useExtractedAddress} onChange={() => this.setState({ useExtractedAddress: false })} />
                  <SuggestLine
                    checked={false===useExtractedAddress}
                    onClick={() => this.setState({ useExtractedAddress: false })} >
                    "{`${addressLine1} ${addressLine2}, ${city}, ${state}, ${zipCode}`}"
                  </SuggestLine>
                </Box> */}
                <ShippingSuggestLine
                  checked={false===useExtractedAddress}
                  address={`${addressLine1} ${addressLine2}, ${city}, ${state}, ${zipCode}`}
                  zipCode={``}
                  onClick={() => this.setState({ useExtractedAddress: false })}
                  onEdit={this.onBackClickHandler}
                />
              </SuggestBox>

              <Box
                //position='absolute'
                //left={0}
                //bottom='32px'
                width={1}
                display='flex'
                justifyContent='center'
                // px={4}
                mt={4}>
                <ActionButton onClick={() => this.doneHandler()}>DELIVER TO THIS ADDRESS</ActionButton>
              </Box>
            </Fragment>
          }
          {currentStep == 2 &&
            <Fragment>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box onClick={this.onBackClickHandler}> {'< BACK'} </Box>
                <CloseButton onClick={onClose}>{closeLabel}</CloseButton>
              </Box>
              <br />
              <Box mb={4}>Sorry, we could not find a USPS validated address for</Box>
              <ShippingSuggestLine
                hideAction
                address={`${addressLine1} ${addressLine2}, ${city}, ${state}, ${zipCode}`}
              />
              <Box my={2} fontSize='13px'>
                We want to get your Manis to you asap! <br />
                Please make sure you entered your full complete address.
              </Box>
              <Box
                // position='absolute'
                // left={0}
                // bottom='32px'
                width={1}
                display='flex'
                justifyContent='space-between'
                flexWrap='wrap'
                mt={4}
                px={[2, 0]}>
                <OutlinedActionButton style={{padding: '0 20px'}} onClick={this.onBackClickHandler}>EDIT ADDRESS</OutlinedActionButton>
                <ActionButton style={{padding: '0 20px'}} onClick={this.doneHandler}>DELIVER WITH THIS ADDRESS</ActionButton>

              </Box>
            </Fragment>

          }
      </Wrapper>
    );
  }

}

export default ShippingAddressDialog;
