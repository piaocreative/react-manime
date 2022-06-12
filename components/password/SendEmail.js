import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import Box from '../styled/Box';
import {
  PageBox,
  StandardInput,
  StyledStandardDarkButton,
} from '../styled/StyledComponents';
import { LoadingButton } from '../styled/StandardButton';
import { PrimaryButton } from '../basic/buttons';
import TopPanel from './TopPanel';
import { HalfBox, Line, BackBox } from '../auth/styled';

class SendEmailPage extends Component {
  state = {
    emailToSend: '',
  };

  inputChangeHandler = (ev) => {
    const { onChangeEmail } = this.props;
    onChangeEmail(ev.target.value.toLowerCase());
  };

  render() {
    const { status, loading, email, onNext } = this.props;
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
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            background="#FBFAF7"
            p={[3, 5]}
            // px={[4, '20%']}
            // py={['48px', '70px']}
          >
            <BackBox onClick={() => Router.push('/auth')}>
              <img src="/static/icons/back.svg" /> BACK
            </BackBox>
            <Box maxWidth={['100%', '420px']}>
              <div style={{ visibility: 'hidden' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <Box
                position="relative"

                mb="16px"
                display="flex"
                flexDirection="row"
                width="100%"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Line />
                <Box
                  fontWeight="500"
                  textAlign="center"
                  fontSize={4}
                  fontFamily="avenirBook"
                  letterSpacing="2px"
                  style={{ cursor: 'default' }}
                  mx={3}
                >
                  <span>
                    Enter Your Email
                    {this.props.isModal && (
                      <>
                        <br />
                        to be able to vote
                      </>
                    )}
                  </span>
                </Box>
                <Line />
              </Box>
              <StandardInput

                error={status || !email}
                width={'100%'}
                name="email"
                value={email}
                underlined
                placeholder="Type your e-mail here"
                onChange={this.inputChangeHandler}
              />
              <Box minHeight={[0, '40px']} mb="12px" color="forecolor.6">
                {status}
              </Box>
              <StyledStandardDarkButton
                width={'100%'}
                disabled={loading}
                height="32px"
                onClick={onNext}
              >
                RECOVER PASSWORD
              </StyledStandardDarkButton>
            </Box>
          </Box>
        </HalfBox>
      </Fragment>
    );
  }
}

export default SendEmailPage;
