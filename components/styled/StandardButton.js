import React from 'react';
import { StyledStandardButton, StyledStandardDarkButton } from './StyledComponents';

import { track, trackFlowMixpanel } from '../../utils/track';

export default class StandardButton extends React.Component {
  _isMounted = false;

  constructor(props) {

    let replace = false;
    if(props.replace === undefined){
      replace = true;
    }
    super(props);
    this.state = {
      disabled: false,
      replace
    };
  }
  componentDidMount() {
    this._isMounted = true;
  }

  click = ev => {
    const waitTime = this.props.waitTime ? this.props.waitTime : 3000;

    if (this.disable) {
      ev.preventDefault();
      return;
    }

    this.disable = true;
    this.setState({ disabled: true });
    this.props.onClick && this.props.onClick(ev);
    setTimeout(() => {
      this.disable = false;
      if (this._isMounted) this.setState({ disabled: false });
    }, waitTime);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { onClick, disabled, ...props } = this.props;
    return (
      <StyledStandardButton {...props} onClick={this.click} disabled={disabled || this.state.disabled}>
        {this.props.children}
      </StyledStandardButton>
    );
  }
}

export class LoadingButton extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }
  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading != this.props.loading) {
      // this.props.dispatchSetIsLoading(this.props.loading);
      // mixpanel.track(`call fn to dispatchSetIsLoading(${this.props.loading}).`);
    }
  }

  click = ev => {
    ev.preventDefault();
    // trackFlowMixpanel('1', 'Standard Button Initiated');

    if (this.disable) {
      return;
    }

    this.disable = true;
    // trackFlowMixpanel('2', 'Standard Button Click Handlers Initiated');

    this.setState({ disabled: true });
    this.props.onClick && this.props.onClick(ev);

    const waitTime = this.props.waitTime ? this.props.waitTime : 3000;
    setTimeout(() => {
      this.disable = false;
      if (this._isMounted) this.setState({ disabled: false });
    }, waitTime);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { onClick, disabled, ...props } = this.props;
    return (
      <StyledStandardButton {...props} onClick={this.click} disabled={disabled || this.state.disabled}>
        {this.props.children}
        {/* { this.props.loading &&
          <LoadingModal isLoading={true} />
        } */}
        {/* <LoadingModal isLoading={this.props.loading} /> */}
      </StyledStandardButton>
    );
  }
}


export class PaymentLoadingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.enableByToggle != prevProps.enableByToggle)
      this.enableButton();
    if (this.props.disableByToggle != prevProps.disableByToggle)
      this.disableButton();
  }

  click = ev => {
    ev.preventDefault();
    // trackFlowMixpanel('1', 'Payment Standard Button Initiated');

    if (this.disable) {
      return;
    }

    this.disable = true;
    // trackFlowMixpanel('2', 'Payment Standard Button Click Handlers Initiated');

    this.setState({ disabled: true });
    this.props.onClick && this.props.onClick(ev);
  };

  enableButton = () => {
    this.disable = false;
    this.setState({ disabled: false });
  }

  disableButton = () => {
    this.disable = true;
    this.setState({ disabled: true });
  }

  render() {
    const { onClick, disabled, ...rest } = this.props;
    return (
      <StyledStandardDarkButton onClick={this.click} disabled={disabled || this.state.disabled} {...rest}>
        {(this.state.disabled && this.state.replace)?
          'ORDERING...' : this.props.children
          
        }
      </StyledStandardDarkButton>
    );
  }
}

