import { Auth } from '@aws-amplify/auth';
import constants from 'constants/index';
import React, { Component } from 'react';
import log from 'utils/logging';
import { track } from 'utils/track';
import ConfirmCodeInputPage from '../password/ConfirmCodeInput';
import PasswordDonePage from '../password/PasswordDone';
import SendEmailPage from '../password/SendEmail';
import { PageBox } from '../styled/StyledComponents';

type ForgotPasswordState = {
  currentStep: number;
  recoverStatus: string;
  passwordChangeStatus: string;
  confirmCode: string;
  loading: boolean;
};

type ForgotPasswordProps = {
  email: string;
  onChangeEmail: Function;
};

class ForgotPasswordPage extends Component<ForgotPasswordProps, ForgotPasswordState> {
  state = {
    currentStep: 0,
    recoverStatus: '',
    passwordChangeStatus: '',
    confirmCode: '',
    loading: false,
  };

  onRecoverPasswordHandler = ev => {
    ev.preventDefault();
    const { email } = this.props;
    const { currentStep, loading } = this.state;
    if (loading) {
      return;
    }
    this.setState({ loading: true });
    Auth.forgotPassword(email)
      .then(async data => {
        this.setState({
          currentStep: currentStep + 1,
          recoverStatus: '',
          loading: false,
        });
        track('forgotPassword in ForgotPasswordFlow.js', this.state, null, { customObj: data });
      })
      .catch(err => {
        this.setState({
          recoverStatus: err.message,
          loading: false,
        });
        log.error('[ForgotPasswordFlow] forgotPassword in ForgotPassword.js', {
          state: this.state,
          err,
        });
      });
  };

  onVerifyCodeHandler = (code, newPassword) => {
    const { email } = this.props;
    if (newPassword && newPassword.length < 6) {
      this.setState({ passwordChangeStatus: constants.messages.INVALID_PASSWORD_LENGTH });
      return;
    }
    this.setState({ passwordChangeStatus: '' });

    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(data => {
        const { currentStep } = this.state;
        this.setState({
          currentStep: currentStep + 1,
          loading: false,
          passwordChangeStatus: '',
        });
        track('forgotPasswordConfirmHandler in ForgotPasswordFlow.js', this.state, null, {
          customObj: data,
        });
      })
      .catch(err => {
        this.setState({
          passwordChangeStatus: err.message,
          loading: false,
        });
        log.error('[ForgotPasswordFlow] forgotPasswordConfirmHandler in ForgotPasswordFlow.js', {
          state: this.state,
          err,
        });
      });
  };

  forgotPasswordConfirmHandler = newPassword => {
    const { email } = this.props;
    const { confirmCode, currentStep, loading } = this.state;
    if (loading) {
      return;
    }
    Auth.forgotPasswordSubmit(email, confirmCode, newPassword)
      .then(data => {
        track('forgotPasswordConfirmHandler in ForgotPasswordFlow.js', this.state, null, {
          customObj: data,
        });
        this.setState({
          currentStep: currentStep + 1,
          passwordChangeStatus: '',
          loading: false,
        });
      })
      .catch(err => {
        this.setState({
          passwordChangeStatus: err.message,
          loading: false,
        });
        log.error('[ForgotPasswordFlow] forgotPasswordConfirmHandler in ForgotPasswordFlow.js', {
          state: this.state,
          err,
        });
      });
  };

  onNextHandler = ev => {
    try {
      ev.preventDefault();
    } catch (error) {
      // no op
    }
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  render() {
    const { email, onChangeEmail } = this.props;
    const { currentStep, recoverStatus, passwordChangeStatus, loading } = this.state;
    return (
      <PageBox>
        {currentStep === 0 ? (
          <SendEmailPage
            status={recoverStatus}
            loading={loading}
            email={email}
            onChangeEmail={() => onChangeEmail({ success: true })}
            onNext={this.onRecoverPasswordHandler}
          />
        ) : currentStep === 1 ? (
          <ConfirmCodeInputPage
            email={email}
            passwordChangeStatus={passwordChangeStatus}
            onBack={() => {
              this.setState({ currentStep: 0, passwordChangeStatus: '' });
            }}
            onNext={this.onVerifyCodeHandler}
          />
        ) : currentStep === 2 ? (
          <PasswordDonePage />
        ) : (
          <div />
        )}
      </PageBox>
    );
  }
}

export default ForgotPasswordPage;
