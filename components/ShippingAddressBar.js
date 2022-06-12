import { Fragment, Component } from 'react';
import styled from 'styled-components';

import Box from './styled/Box';
import { Input, StandardInput, StandardLabel, StandardButton_2 } from '../components/styled/StyledComponents';
import ShippingAddressDialog from './ShippingAddressDialog';
import ConfirmDialog from './ConfirmDialog';
import log from '../utils/logging'
const EditButton = styled(StandardLabel)`
  position: absolute;
  right: 40px;
  top: 20px;
  cursor: pointer;
`;

const CheckBox = styled(Input)`
  margin-top: 10px;
  margin-right: 20px;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const RemoveButton = styled(StandardButton_2)`
  cursor: pointer;
  margin-left: -6px;
  margin-top: -16px;
  background: transparent;
`;

const AddressDisplayBox = styled(StandardInput)`
  height: 54px;
  padding-right: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => props.background ? props.background : 'transparent'};
  border: none;
`;

const MobileEditIcon= styled(Box)`
  width: 32px;
  height: 32px;
  text-align: center;
  margin-top: -10px;
  margin-right: -6px;
  padding-top: 4px;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  background: #D8D8D8;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

class ShippingAddressBar extends Component {
  state = {
    isDialogOpened: false,
    isConfirmDialogOpened: false,
    addressLine1: '',
    addressLine2: '',
    // description: '',
    fullName: '',
    city: '',
    zipCode: '',
    state: '',
    country: '',
  }

  openConfirmDialogHandler = () => {
    this.updateState('isConfirmDialogOpened', true);
  }

  closeConfirmDialogHandler = () => {
    this.updateState('isConfirmDialogOpened', false);
  }


  closeDialogHandler = () => {
    this.updateState('isDialogOpened', false);
  }

  updateState = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  setDataHandler = (data) => {
    this.setState({...data});
    this.props.onChange(data);
  }

  initialize = () => {
    const { data } = this.props;
    const { addressLine1, addressLine2, addressCity, addressState, addressZip, name, shippingAddressId } = data;
    this.setState({
      shippingAddressId,
      addressLine1,
      addressLine2,
      fullName: name || `${this.props.userData.name.firstName} ${this.props.userData.name.lastName}`,
      city: addressCity || '',
      zipCode: addressZip || '',
      state: addressState || '',
    });
  }

  componentDidMount () {
    this.initialize();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.initialize();
    }
  }

  render () {
    const { userData, isSelected, order, onSelect } = this.props;
    const { isDialogOpened, isConfirmDialogOpened, addressLine1, addressLine2, city, state, zipCode, fullName, shippingAddressId } = this.state;
    let value = '';
    try {
      const { name } = userData;
      value = `${fullName}, ${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zipCode}`;
    } catch (error) {
      log.info(error);
    }

    const dialogData = { shippingAddressId, addressLine1, addressLine2, city, state, zipCode, fullName };

    return (
      <Fragment>
        <Box display='flex' position='relative'>
          <CheckBox type='radio' checked={isSelected} onChange={()=>onSelect(order)}/>
          <AddressDisplayBox
            multiline
            mb={0}
            ml='20px'
            background={isSelected ? '#F7BFA0' : null}
            color={!isSelected ? '#474746' : null}
            onChange={() => {}}
            onClick={() => onSelect(order)}
            value={value} />
          <EditButton onClick={ev => this.updateState('isDialogOpened', true)}>
            <Box display={['none', 'block']} style={{textDecoration: 'underline'}}>Edit</Box>
            <MobileEditIcon display={['block', 'none']}>i</MobileEditIcon>
          </EditButton>
          <RemoveButton onClick={this.openConfirmDialogHandler}>
            <Box fontSize='36px' mt='-28px' height='28px'>×</Box>
          </RemoveButton>
          <ConfirmDialog
            opened={isConfirmDialogOpened}
            closed={this.closeConfirmDialogHandler}
            confirmed={this.props.onRemove} />
        </Box>
        <div dataCustom='testoutput' ></div>
        {isDialogOpened &&
          <ShippingAddressDialog
            opened={isDialogOpened}
            onDataChange={data => this.setDataHandler(data)}
            onClose={this.closeDialogHandler}
            data={dialogData} />}
      </Fragment>
    );
  }
}

export default ShippingAddressBar;
