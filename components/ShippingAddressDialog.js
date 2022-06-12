
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import log from '../utils/logging'
import StandardButton from '../components/styled/StandardButton';
import { StandardLabel, StandardInput } from '../components/styled/StyledComponents';
import Box from '../components/styled/Box';
import { smartyStreetExtract } from 'api/util';
const Container = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 'calc(var(--vh, 1vh) * 100';
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  padding: 20px;
`;

const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled && '#eee'};
  height: 40px;
  &:hover {
    background: ${props => props.disabled && '#eee'};
  }
  margin-bottom: 12px;
  width: 100%;
  @media (min-width: 480px) {
    width: unset;
  }
`;

const SuggestBox = styled(Box)`
  // position: absolute;
  z-index: 300;
  background: white;
  top: 40px;
  width: -webkit-fill-available;
  // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  padding: 8px 16px;
`;

const SuggestLine = styled(Box)`
  margin-left: 8px;
  border-bottom: 1px solid #D8D8D8;
  height: 48px;
  flex-grow: 1;
  padding: 0 4px;
  background: ${props => props.checked && '#F7BFA0'};
  &:hover {
    border-bottom: 1.5px solid #f7bfa0;
  }
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
    errorCity: false,
    errorState: false,
    errorZipCode: false,
    errorFullName: false,
    errorAddressLine1: false,
    // suggestionList: [],
    // selectedSuggestIndex: -1,
    // showMainDialog: true,
    // showNextDialog: false,
    // showNoneDialog: false,
    // extractionSuccess: false
    useExtractedAddress: true,
    currentStep: 0,
    isMobile: true
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

  extractAddress = async ev => {
    ev.preventDefault();
    const { addressLine1, addressLine2, city, state, zipCode, fullName } = this.state.formAddress;

    this.setState({errorFullName: !fullName, errorCity: !city, errorState: !state, errorZipCode: !zipCode, errorAddressLine1: !addressLine1});

    const isValid = fullName != '' && zipCode != '' && city != '' && state != '';
    if (!isValid) return;

    let addressString = `${addressLine1} ${addressLine2} ${city} ${state} ${zipCode}`;
    // let extractionSuccess = false;
    try {
      const extractedResult = await smartyStreetExtract(addressString);
      // log.info(extractedResult);

      const output = extractedResult.addresses[0].api_output[0];
      const components = output.components;

      // log.info(output);
      // log.info(components);

      const street_predirection = (components || {}).street_predirection ? ' ' + (components || {}).street_predirection : '';
      const street_postdirection = (components || {}).street_postdirection ? ' ' + (components || {}).street_postdirection : '';
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
      const addressLine1Value = `${primary_number}${street_predirection} ${street_name} ${street_suffix}${street_postdirection}`;
      await this.setState({
        smartyStreetExtractAddress: {
          addressLine1: addressLine1.toLowerCase().includes('po box') ? delivery_line_1 || addressLine1Value  : addressLine1Value,
          addressLine2: `${secondary_designator} ${secondary_number}`,
          city: city_name,
          zipCode: zipcode,
          state: state_abbreviation,
          lastLine: last_line,
          firstLine: delivery_line_1
        }
      });
      // log.info(3232);
      // log.info(this.state);
    } catch (err) {
      log.error(`[ShippingAddressDialog] Could not find address with extraction ${err}`, { err } );
    }

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
      const { shippingAddressId } = this.state;
      const { fullName } = this.state.formAddress;
      this.props.onDataChange({ ...addressToUse, shippingAddressId, fullName });
      this.props.onClose();
    }
  };

  componentDidMount() {
    const { data, isAdd } = this.props;
    if (window.innerWidth >= 768) {
      this.setState({isMobile: false});
    }
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
    const { onClose } = this.props;
    const { isMobile, currentStep, smartyStreetExtractAddress, useExtractedAddress, formAddress: { fullName, zipCode, addressLine1, addressLine2, city, state } } = this.state;
    return (
      <Container>
        <Box position='relative' width={['100%', '500px']} minHeight='546px' background='white' p={4}>
          { currentStep == 0 && <Fragment>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>Shipping Address</Box>
            <CloseButton onClick={onClose}>×</CloseButton>
          </Box>
          <form onSubmit={this.onSubmit}>
            <Box fontSize={3} color='#616161' mt={3} color='forecolor.2' />
            <Box display='flex' width={1}>
              <Box flex={1}>
                <StandardLabel>Full name</StandardLabel>
                <StandardInput
                  placeholder={(this.state.errorFullName && !isMobile) ? 'Please enter your full name' : this.state.errorFullName ? 'Your full name': ''}
                  value={fullName}
                  onChange={ev => this.updateState('fullName', ev.target.value)}
                  error={this.state.errorFullName}
                />
              </Box>
            </Box>

            <StandardLabel>Address</StandardLabel>
            <StandardInput
              placeholder={(this.state.errorAddressLine1 && !isMobile) ? 'Please enter your address' : this.state.errorAddressLine1 ? 'Your address': ''}
              value={addressLine1}
              error={this.state.errorAddressLine1}
              onChange={ev => this.updateState('addressLine1', ev.target.value)}
            />
            <StandardInput
              value={addressLine2}
              onChange={ev => this.updateState('addressLine2', ev.target.value)}
            />
            <Box display='flex' width={1}>
              <Box flex={1} mr={2}>
                <StandardLabel>City</StandardLabel>
                <StandardInput
                  placeholder={(this.state.errorCity && !isMobile) ? 'Please enter your city' : this.state.errorCity ? 'Your city': ''}
                  value={city}
                  error={this.state.errorCity}
                  onChange={ev => this.updateState('city', ev.target.value)}
                />
              </Box>
              <Box flex={1} ml={2}>
                <StandardLabel>State</StandardLabel>
                <StandardInput
                  placeholder={(this.state.errorState && !isMobile) ? 'Please enter your state' : this.state.errorState ? 'Your state': ''}
                  value={state}
                  error={this.state.errorState}
                  onChange={ev => this.updateState('state', ev.target.value)}
                />
              </Box>
            </Box>
            <Box display='flex' width={1}>
              <Box flex={1} mr={2}>
                <StandardLabel>Zip Code</StandardLabel>
                <StandardInput
                  value={zipCode}
                  onChange={ev => this.updateState('zipCode', ev.target.value)}
                  error={this.state.errorZipCode}
                />
              </Box>

              <Box flex={1} ml={2}>
                <StandardLabel>Country</StandardLabel>
                <StandardInput
                  disabled
                  color='#717171'
                  value='United States'
                />
              </Box>


            </Box>
            <Box width={1} display='flex' justifyContent='center' mt={2}>
              <ActionButton
                mr={2}
                onClick={this.extractAddress}>
                Next
              </ActionButton>
            </Box>
          </form>
          </Fragment>
          }
          { currentStep == 1 &&
            <Fragment>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box onClick={this.onBackClickHandler}> {'< Back'} </Box>
                <CloseButton onClick={onClose}>×</CloseButton>
              </Box>
              <Box>We found the following USPS validated address:</Box>
              <Box mb='40px'>
              { smartyStreetExtractAddress &&
                <SuggestBox>
                  <Box display='flex' alignItems='center'>
                    <input type='radio' checked={true===useExtractedAddress} onChange={() => this.setState({ useExtractedAddress: true })} />
                    <SuggestLine
                      checked={true===useExtractedAddress}
                      onClick={() => this.setState({ useExtractedAddress: true })} >
                      {smartyStreetExtractAddress.firstLine}{`, ${smartyStreetExtractAddress.lastLine}`}
                    </SuggestLine>
                  </Box>
                </SuggestBox>
              }
              </Box>
              <Box mt={4}>
                Not your address? Continue with: <br />
              </Box>
              <SuggestBox>
                <Box display='flex' alignItems='center'>
                  <input type='radio' checked={false===useExtractedAddress} onChange={() => this.setState({ useExtractedAddress: false })} />
                  <SuggestLine
                    checked={false===useExtractedAddress}
                    onClick={() => this.setState({ useExtractedAddress: false })} >
                    {`${addressLine1} ${addressLine2}, ${city}, ${state}, ${zipCode}`}
                  </SuggestLine>
                </Box>
              </SuggestBox>



              <Box
                position='absolute'
                left={0}
                bottom='32px'
                width={1}
                display='flex'
                justifyContent='center'
                px={4}
                mt={2}>
                <ActionButton onClick={() => this.doneHandler()}>OK</ActionButton>
              </Box>
            </Fragment>
          }
          {currentStep == 2 &&
            <Fragment>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box onClick={this.onBackClickHandler}> {'< BACK'} </Box>
                <CloseButton onClick={onClose}>×</CloseButton>
              </Box>
              
              <Box mt={4}>
                    Sorry, we could not find a USPS validated address.



                  </Box>
                  <Box mt={4}>
                    Continue with: <br />
                  </Box>
                  <SuggestBox>
                    <Box display='flex' alignItems='center'>
                      <input type='radio' checked={true} onChange={() => this.useAddress(false)} />
                      <SuggestLine
                        checked={true}
                        onClick={() =>  true} >
                        {`${addressLine1} ${addressLine2}, ${city}, ${state}, ${zipCode}`}
                      </SuggestLine>
                    </Box>
                  </SuggestBox>

                  <Box
                    position='absolute'

                    bottom='32px'

                    display='flex'
                    justifyContent='center'
                  >
                    <ActionButton onClick={this.doneHandler}>OK</ActionButton>
                  </Box>


            </Fragment>

          }
        </Box>
      </Container>
    );
  }

}

export default ShippingAddressDialog;
