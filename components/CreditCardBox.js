import { Component } from 'react';
import classNames from 'classnames';

import ConfirmDialog from '../components/ConfirmDialog';
import { OutlinedDarkButton } from '../components/basic/buttons';

import style from '@styles/checkout/creditcard-box.module.css';

const visaImagePath = '/static/images/visa.png';
const masterImagePath = '/static/images/master.png';

const checkedIconSrc = '/static/icons/checked-icon.svg';
const unCheckedIconSrc = '/static/icons/unchecked-icon.svg';

class CreditCardBox extends Component {
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
    const { isConfirmDialogOpened } = this.state;
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
      <>
        <div className={classNames(style.container, isSelected && style.defaultCard)} onClick={onSelect}>
          <img src={isSelected ? checkedIconSrc: unCheckedIconSrc} alt='checked' />
          {typeof brand == 'string' && brand.toLowerCase() === 'visa' ?
            <img className={style.iconImage} src={visaImagePath} alt={brand} /> :
            <img className={style.iconImage} src={masterImagePath} alt={brand} />
          }
          <div className={style.desktopOnly}>{`Ending in ${last4}`}</div>
          <div className={style.mobileOnly}>{last4}</div>
          <div className={style.removeButton} onClick={this.openConfirmDialogHandler}>Remove</div>
          {!isSelected ?
            <OutlinedDarkButton passedClass={style.selectButton} onClick={() => onSelect(order)}>
              Select
            </OutlinedDarkButton>:
            <div className={style.defaultLabel}>DEFAULT</div>
          }
        </div>
        {isConfirmDialogOpened &&
          <ConfirmDialog
            opened={isConfirmDialogOpened}
            closed={this.closeConfirmDialogHandler}
            confirmed={this.props.onRemove} />
        }
      </>
    );
  }
}

export default CreditCardBox;
