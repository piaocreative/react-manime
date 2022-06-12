import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';
import { StandardInput, StyledStandardDarkButton } from '../styled/StyledComponents';
import { LoadingButton } from '../styled/StandardButton';
import { HalfBox, BackBox } from '../auth/styled';
import { PrimaryButton } from '../basic/buttons';
import TopPanel from './TopPanel';

// const MyBackBox = styled(BackBox)`
//   left: 40px;
//   @media (min-width: 480px) {
//     left: 20%;
//   }
// `;

class ConfirmCodeInput extends Component {
  state = {
    verificationCode: '',
    newPassword: '',
  };

  inputChangeHandler = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  onBackClickHandler = (ev) => {
    ev.preventDefault();
    const { onBack } = this.props;
    onBack();
  };

  render() {
    const { email, passwordChangeStatus, onNext, onBack } = this.props;
    const { verificationCode, newPassword } = this.state;
    return (
      <Fragment>
        <TopPanel />
        <HalfBox
          p={['0 12px', 0]}
          mt={['-100px', 0]}
          position="relative"
          decoration
        >
          <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start "
             alignItems='center'
            // textAlign='center'
            background="#FBFAF7"
            p={[3, 5]}

          >
            <BackBox onClick={this.onBackClickHandler}>
              <img src="/static/icons/back.svg" alt="back" />
              BACK
            </BackBox>
            <Box maxWidth={['100%', '420px']}>
              <div style={{ visibility: 'hidden' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <Box width={1} textAlign="justify" my="32px">
                If an account exists, you should have received an email to{' '}
                {email} with a verification code.
              </Box>
              <Box mb="16px">Please enter the verification code</Box>
              <StandardInput
                error={passwordChangeStatus && !verificationCode}
                width={1}
                name="verificationCode"
                value={verificationCode}
                // maxWidth='240px'
                underlined
                placeholder="Verification code *"
                onChange={this.inputChangeHandler}
              />
              <Box mb="16px" textAlign="justify">
                Now choose your new password. <br />
                It has to be at least 6 characters long.
              </Box>
              <StandardInput
                error={
                  passwordChangeStatus &&
                  (!newPassword || newPassword.length < 6)
                }
                width={1}
                name="newPassword"
                value={newPassword}
                type="password"
                autoComplete="new-password"
                // maxWidth='240px'
                underlined
                placeholder="New Password *"
                onChange={this.inputChangeHandler}
              />
              <Box minHeight={[0, '40px']} color="forecolor.6" py={1}>
                {passwordChangeStatus}
              </Box>

              <StyledStandardDarkButton
                width={1}
                height="32px"
                disabled={!verificationCode || !newPassword}
                onClick={(ev) =>{
                  ev.preventDefault();
                  onNext(verificationCode.split(' ').join(''), newPassword)
                }
                }
              >
                CONTINUE
              </StyledStandardDarkButton>
            </Box>
          </Box>
        </HalfBox>
      </Fragment>
    );
  }
}

export default ConfirmCodeInput;
