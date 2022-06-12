import { Fragment, Component } from 'react';
import classNames from 'classnames';

import ShippingAddressDialog from './ShippingAddressDialog';
import ConfirmDialog from './ConfirmDialog';
import { DarkButton, OutlinedDarkButton } from '../components/basic/buttons';

import style from '../static/components/checkout/address-bar.module.css';

const checkedIconSrc = '/static/icons/checked-icon.svg';
const unCheckedIconSrc = '/static/icons/unchecked-icon.svg';

class ShippingAddressBox extends Component {
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

  openConfirmDialogHandler = ev => {
    ev.stopPropagation();
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

    const dialogData = { shippingAddressId, addressLine1, addressLine2, city, state, zipCode, fullName };
    const isDefault = userData.defaultShippingAddressId === shippingAddressId;
    const DeliverButton = isDefault ? DarkButton : OutlinedDarkButton;

    return (
      <Fragment>
        <div className={classNames(style.container, isDefault && style.defaultBorder)} onClick={onSelect}>
          {/* TODO: hard coded country name */}
          <img
            className={style.checkIcon}
            src={isDefault ? checkedIconSrc: unCheckedIconSrc} alt='checkbox' />
          <div className={style.addressLabel}>
            <span className={style.fullName}>{fullName}</span>{`, ${addressLine1} ${addressLine2} ${city}`} <br />
            {state} {zipCode}, United States <br />
          </div>
          <div className={style.editRemoveColumn}>
            <div
              className={style.actionButton}
              onClick={ev => this.updateState('isDialogOpened', true)}>
              Edit
            </div>
            <div
              className={style.actionButton}
              onClick={this.openConfirmDialogHandler}>
              Remove
            </div>
          </div>
        </div>
        <ConfirmDialog
          opened={isConfirmDialogOpened}
          closed={this.closeConfirmDialogHandler}
          confirmed={this.props.onRemove} />
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

export default ShippingAddressBox;
