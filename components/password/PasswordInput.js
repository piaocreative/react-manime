import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../styled/Box';
import { StandardInput } from '../styled/StyledComponents';
import { HalfBox, Line, BackBox } from '../auth/styled';
import { LoadingButton } from '../styled/StandardButton';
import { PrimaryButton } from '../basic/buttons';
import TopPanel from './TopPanel';
import { pageLinks } from '../../utils/links';
import constants from '../../constants';

const ResetBox = styled.span`
  cursor: pointer;
  padding-left: 4px;
  text-decoration: underline;
  color: #FF8181;
`;

class PasswordInputPage extends Component {
  state = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    status: ''
  }

  inputChangeHandler = ev => {
    this.setState({[ev.target.name]: ev.target.value});
  }

  resetPasswordHandler = () => {
    Router.push(pageLinks.ForgotPassword.url);
  }

  changePasswordHandler = ev => {
    ev.preventDefault();
    const { onNext } = this.props;
    const { oldPassword, newPassword } = this.state;
    if (newPassword.length < 6) {
      this.setState({status: constants.messages.INVALID_PASSWORD_LENGTH});
      return;
    } else {
      this.setState({status: ''});
    }
    onNext(oldPassword, newPassword);
  }

  render () {
    const { status, oldPassword, newPassword } = this.state;
    const { status: errorResonse, loading } = this.props;
    return (
      <Fragment>
        <TopPanel isChangeFlow />
        <HalfBox p={['0 12px', 0]} mt={['-100px', 0]} position='relative' decoration>
          <Box
            width='100%'
            // height='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            // textAlign='center'
            background='#FBFAF7'
            p={[4, 4, '12% 20%']}
            py='60px'>
            <form>
              <Box mb='32px' textAlign='justify' fontSize='20px'>Choose your new password.</Box>
              <Box mb={2}>It has to be at least 6 characters long.</Box>
              <StandardInput
                width={1}
                name='oldPassword'
                value={oldPassword}
                type='password'
                autoComplete='old-password'
                // maxWidth='240px'
                underlined
                placeholder='Old Password'
                onChange={this.inputChangeHandler} />
              <StandardInput
                width={1}
                name='newPassword'
                value={newPassword}
                type='password'
                autoComplete='new-password'
                // maxWidth='240px'
                underlined
                placeholder='New Password'
                onChange={this.inputChangeHandler} />
              <Box py={1} color='forecolor.6'>{status}</Box>
                {(!status && errorResonse) && <Box py={1} color='forecolor.6'>{errorResonse} <br />
                  Forgot password?
                  <ResetBox onClick={this.resetPasswordHandler}>Let's reset it</ResetBox>
                </Box>}
              <Box height='20px' />
              <LoadingButton
                width={1}
                height='32px'
                disabled={loading}
                style={{margin: '0 auto'}}
                onClick={this.changePasswordHandler}>CHANGE PASSWORD
              </LoadingButton>
            </form>
          </Box>
        </HalfBox>
      </Fragment>
    );
  }
}

export default PasswordInputPage;