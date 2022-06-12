
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import StandardButton from '../../styled/StandardButton';
import { StandardLabel, StandardInput, StandardInputBox } from '../../styled/StyledComponents';
import Box from '../../styled/Box';
import { trackFlowMixpanel, track } from '../../../utils/track';
import { smartyStreetExtract } from 'api/util';

import { Address } from '../../../types';
import log from '../../../utils/logging'


const TitleBox = styled(Box)`
  font-family: AvenirLight;
  font-size: 23px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 3.23;
  letter-spacing: 3.83px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  text-transform: uppercase;
  padding-top: 22px;
    height: 57px;
    margin-bottom: 35px;
  background-color: #f3f1ea;
`
const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled ? '#eee' : '#2c4349'};
  text-transform: 'uppercase';
  height: 40px;
  &:hover {
    background: ${props => props.disabled ? '#eee' : '#F7BFA0'};
  }
  margin-bottom: 12px;
  width: 100%;
`;


const WhereToShip = styled(Box)` 
text-align: center;
    line-height: 20px;
    text-transform: uppercase;
    font-family: 'avenirHeavy';
    font-size: 12px;
    letter-spacing: 4px;
`

const ShippingConstraints = styled(Box)` 
    text-align: center;
    padding-top: 15px;
    font-size: 12px;
    font-family: 'avenirBook';
    font-style: italic;
`

const DetailsHeader = styled(Box)` 
    text-transform: uppercase;
    font-size: 12px;
    font-family: 'avenirHeavy';
    padding-top: 20px;
`

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

  flex-grow: 1;
  padding: 4px;
  display: flex;
  align-items: center;
  background: ${props => props.checked && '#F7BFA0'};
  &:hover {
    border-bottom: 1.5px solid #f7bfa0;
  }
`;

const CloseButton = styled(Box)`
  cursor: pointer;
  font-size: 32px;
`;

type FormAddress = {
  line1: string,
  line2: string,
  fullName: string,
  city: string,
  zip: string,
  state: string,
  country: string,
  email: string,
  notes: string
}
const ModalContainer = styled(Box)`
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
export const InitialShippingAddress: Address = {
  line1: '',
  line2: '',
  city: '',
  zip: '',
  state: '',
  country: 'US',
}
class ShippingAddressForm extends React.Component<{
  callback: Function,
  title: string, props?: any, shippingForm: Address,
  preLaunchDateString?: string,
}, any> {

  constructor({shippingForm = InitialShippingAddress, callback, title, ...props}){
    super({shippingForm, callback, title, props});
    this.state = {

      shippingAddressId: null,
      formAddress: shippingForm,
      smartyStreetExtractAddress: null,
      errorCity: false,
      errorState: false,
      errorZipCode: false,
      errorFullName: false,
      errorEmail: false,
      errorNotes: false,
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
    }
  }

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

  componentDidUpdate(prevProps, prevState) {


    if (prevState.smartyStreetExtractAddress !== this.state.smartyStreetExtractAddress) {

      this.useAddress(true)
    } else if (prevState.formAddress !== this.state.formAddress) {
      this.useAddress(false)
    }

  }

  extractAddress = async ev => {
    ev.preventDefault();
    const { line1, line2, city, state, zip } = this.state.formAddress;

    this.setState({ errorCity: !city, errorState: !state, errorZipCode: !zip, errorAddressLine1: !line1 });

    const isValid = zip != '' && city != '' && state != '';
    if (!isValid) return;

    let addressString = `${line1} ${line2} ${city} ${state} ${zip}`;
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
      let plus4 =  (components || {}).plus4_code || '';

      if(plus4!=='')
        plus4 = `-${plus4}`
      const delivery_line_1 = (output || {}).delivery_line_1 || '';
      const last_line = (output || {}).last_line || '';

      // addressString = extractedAddress.delivery_line_1 + ' ' + extractedAddress.last_line;

      if (!secondary_designator) secondary_designator = '';
      if (!secondary_number) secondary_number = '';
      const addressLine1Value = `${primary_number}${street_predirection} ${street_name} ${street_suffix}${street_postdirection}`;
      await this.setState({
        smartyStreetExtractAddress: {
          line1: line1.toLowerCase().includes('po box') ? delivery_line_1 || addressLine1Value : addressLine1Value,
          line2: `${secondary_designator} ${secondary_number}`,
          city: city_name,
          zip: `${zipcode}${plus4}`,
          state: state_abbreviation
        }
      });
      // log.info(3232);
      // log.info(this.state);
    } catch (err) {
      log.error('[ShippingAddressForm] Could not find address with extraction ' + err, { err });
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
    trackFlowMixpanel('3', 'doneHandler');
    let validated = true;

    // if (!Number.isInteger(Number(this.state.zipCode)) || this.state.zipCode === '') {
    //   validated = false;
    //   this.setState({ errorZipCode: true });
    // } else {
    //   this.setState({ errorZipCode: false });
    // }

    if (validated) {



    }
  };

  componentDidMount() {

    if (window.innerWidth >= 768) {
      this.setState({ isMobile: false });
    }
    this.useAddress(false)

  }

  useAddress(isExtracted = false) {
    const addressToUse: FormAddress = isExtracted ? this.state.smartyStreetExtractAddress : this.state.formAddress


    const address: Address = {
      country: "US",
      ...addressToUse
    }
    this.props.callback(address)
    this.setState({ useExtractedAddress: isExtracted })
  }


  render() {
    const { preLaunchDateString } = this.props;
    const { isMobile, currentStep, smartyStreetExtractAddress, useExtractedAddress, formAddress: { zip, line1, line2, city, state } } = this.state;

    return (

      <Box  pt={0} maxWidth='480px'>

        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <WhereToShip style={{ textAlign: 'center' }}>Where should we ship?</WhereToShip>
          <ShippingConstraints>Delivery in 3-4 business days{preLaunchDateString ? `, starting ${preLaunchDateString}`: ''}.</ShippingConstraints>
          <DetailsHeader>Recipient Shipping Details</DetailsHeader>



          <form onSubmit={this.extractAddress}>
            <Box fontSize={3} color='#616161' mt={3} />


            <StandardLabel>Address</StandardLabel>
            <StandardInput
              placeholder={(this.state.errorAddressLine1 && !isMobile) ? 'Please enter your address' : this.state.errorAddressLine1 ? 'Your address' : 'Address Line 1'}
              value={line1}
              error={this.state.errorAddressLine1}
              onChange={ev => this.updateState('line1', ev.target.value)}
            />
            <StandardInput
              value={line2}
              placeholder={'Address Line 2 (opt)'}
              onChange={ev => this.updateState('line2', ev.target.value)}
            />
            <Box display='flex' width={1}>
              <Box flex={1} mr={2}>
                <StandardLabel>City</StandardLabel>
                <StandardInput
                  placeholder={(this.state.errorCity && !isMobile) ? 'Please enter your city' : this.state.errorCity ? 'Your city' : ''}
                  value={city}
                  error={this.state.errorCity}
                  onChange={ev => this.updateState('city', ev.target.value)}
                />
              </Box>
              <Box flex={1} ml={2}>
                <StandardLabel>State</StandardLabel>
                <StandardInput
                  placeholder={(this.state.errorState && !isMobile) ? 'Please enter your state' : this.state.errorState ? 'Your state' : ''}
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
                  value={zip}
                  onChange={ev => this.updateState('zip', ev.target.value)}
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
            <Box width={1} display='flex' justifyContent='center' >
              <ActionButton

                onClick={this.extractAddress}>
                Next
              </ActionButton>
            </Box>
          </form>

          {currentStep == 1 &&
            <ModalContainer>
              <Box position='relative' width={['100%', '500px']} minHeight='546px' background='white' p={4} display={"flex"} style={{ flexDirection: 'column' }} justifyContent={"space-between"}>
                <div>
                <Box alignItems='center'>
                  <Box onClick={this.onBackClickHandler} style={{ paddingBottom: '10px', paddingTop: '10px' }}> {'< Back'} </Box>

                </Box>
                <Box>We found the following USPS validated address:</Box>
                <Box mb='40px'>
                  {smartyStreetExtractAddress &&
                    <SuggestBox>
                      <Box display='flex' alignItems='center'>
                        <input type='radio' checked={true === useExtractedAddress} onChange={() => this.useAddress(true)} />
                        
                        <SuggestLine alignSelf='center'
                          checked={true === useExtractedAddress}
                          onClick={() => this.useAddress(true)} >
                          {`${smartyStreetExtractAddress.line1} 
                            ${smartyStreetExtractAddress.line2} 
                            ${smartyStreetExtractAddress.city}, 
                            ${smartyStreetExtractAddress.state} 
                            ${smartyStreetExtractAddress.zip}`}
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
                    <input type='radio' checked={false === useExtractedAddress} onChange={() => this.useAddress(false)} />
                    <SuggestLine
                      checked={false === useExtractedAddress}
                      onClick={() => this.useAddress(false)} >
                      {`${line1} ${line2}, ${city}, ${state}, ${zip}`}
                    </SuggestLine>
                  </Box>
                </SuggestBox>

                </div>


                <ActionButton onClick={() => this.props.callback(undefined, true)}>OK</ActionButton>

              </Box>
            </ModalContainer>
          }
          {currentStep == 2 &&

            <ModalContainer>

              <Box position='relative' width={['100%', '500px']} minHeight='546px' background='white' p={4} display={"flex"} style={{ flexDirection: 'column' }} justifyContent={"space-between"}>
                <div>
                  <Box alignItems='center'>
                    <Box onClick={this.onBackClickHandler} style={{ paddingBottom: '10px', paddingTop: '10px' }}> {'< Back'} </Box>

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
                        onClick={() => this.useAddress(false)} >
                        {`${line1} ${line2}, ${city}, ${state}, ${zip}`}
                      </SuggestLine>
                    </Box>
                  </SuggestBox>


                </div>
                <div>
                <ActionButton onClick={this.onBackClickHandler}>EDIT ADDRESS</ActionButton>
                <ActionButton onClick={() => this.props.callback(undefined, true)}>OK</ActionButton>
                </div>
              </Box>
            </ModalContainer>

          }
        </Box>
      </Box>

    );
  }

}

export default ShippingAddressForm;