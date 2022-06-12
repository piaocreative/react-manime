import React, { Component } from 'react';
import { Auth } from '@aws-amplify/auth';
import { PageBox } from './styled/StyledComponents';
import AuthWallHOC from '../components/AuthWallHOC';
import PasswordInputPage from './password/PasswordInput';
import PasswordDonePage from './password/PasswordDone';
import { trackFunnelActionProjectFunnel,  } from '../utils/track';
import log from 'utils/logging'
class ChangePasswordPage extends Component {
  state = {
    currentStep: 0,
    passwordChangeStatus: '',
  }

  changePasswordHandler = (oldPassword, newPassword) => {
    const { currentStep } = this.state;

    trackFunnelActionProjectFunnel('changePasswordHandler');
    this.setState({passwordChangeStatus: ''});
    Auth.currentAuthenticatedUser()
    .then(user => {
      return Auth.changePassword(user, oldPassword, newPassword);
    })
    .then(data => {
      this.setState({
        currentStep: currentStep + 1
      });
    })
    .catch(err => {
      const errResponse = 'Old password is incorrect. Try again.';
      this.setState({passwordChangeStatus: errResponse});
      log.error(`[ChangePasswordFlow] failed to change password ${err}`, {
        err
      })

    });
  }

  onNextHandler = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  }

  render () {
    const { currentStep, passwordChangeStatus } = this.state;
    return (
      <PageBox>
      {
        currentStep === 0 ?
        <PasswordInputPage
          isChangeFlow
          status={passwordChangeStatus}
          onNext={this.changePasswordHandler} />
        : currentStep === 1 ?
        <PasswordDonePage isChangeFlow />
        : <div />
      }
      </PageBox>
    );
  }
}

export default AuthWallHOC(ChangePasswordPage);
