import { Fragment, Component } from 'react';
import styled from 'styled-components';

import Box from './styled/Box';
import { Input, StandardInput, StandardLabel, StandardButton_2 } from '../components/styled/StyledComponents';
import ConfirmDialog from '../components/ConfirmDialog';


const Container = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
  height: 54px;
  align-items: center;
`;

const EditButton = styled(StandardLabel)`
  position: absolute;
  text-decoration: underline;
  right: 12px;
  cursor: pointer;
`;

const CheckBox = styled(Input)`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const IconImage = styled.img`
  width: 52px;
  height: 36px;
`;

const RemoveButton = styled(StandardButton_2)`
  cursor: pointer;
  margin-left: 8px;
  background: transparent;
`;

const NameBox = styled(Box)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
`;

const visaImagePath = '/static/images/visa.png';
const masterImagePath = '/static/images/master.png';

class CreditCardBar extends Component {
  state = {
    isOpenedDialog: false,
    isConfirmDialogOpened: false,
    addressLine1: '',
    addressLine2: '',
    description: '',
    city: '',
    zipCode: '',
    state: '',
    country: '',
    data: null
  }

  closeConfirmDialogHandler = () => {
    this.setState({isConfirmDialogOpened: false});
  }

  openConfirmDialogHandler = () => {
    this.setState({isConfirmDialogOpened: true});
  }

  render() {
    const { order, onSelect, isSelected, paymentData, onOpenDialog } = this.props;
    const { data, isConfirmDialogOpened } = this.state;
    if (!paymentData) {
      return null;
    }
    const {
      card: {
        brand='Visa',
        last4='0000'
      },
      name
    } = paymentData;
    return (
      <Box display='flex' mb='3'>
        <Container>
          <CheckBox type='radio' checked={isSelected} onChange={() => onSelect(order)} />
          <Container
            px={['1', '3']}
            background={isSelected ? '#F7BFA0' : null}
            color={!isSelected ? '#474746' : null}
            onClick={() => onSelect(order)}>
            {typeof brand == 'string' && brand.toLowerCase() === 'visa' ?
              <IconImage src={visaImagePath} alt={brand} /> :
              <IconImage src={masterImagePath} alt={brand} />
            }
            <Box display='flex'>
              <Box display={['none', 'block']} ml='2' fontWeight='400'>Ending in</Box>
              <Box ml='2'>{last4}</Box>
            </Box>
            {/* <Box mx='2'>|</Box> */}
            <NameBox>{name}</NameBox>
          </Container>
          <EditButton onClick={() => onOpenDialog(paymentData)}>Edit</EditButton>
        </Container>
        <RemoveButton mr='1' onClick={this.openConfirmDialogHandler}>X</RemoveButton>
        {isConfirmDialogOpened &&
          <ConfirmDialog
            opened={isConfirmDialogOpened}
            closed={this.closeConfirmDialogHandler}
            confirmed={this.props.onRemove} />
        }
      </Box>
    );
  }
}

export default CreditCardBar;
