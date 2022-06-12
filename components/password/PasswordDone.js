import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import { pageLinks } from '../../utils/links';
import { HalfBox } from '../auth/styled';
import Box from '../styled/Box';
import { StyledStandardDarkButton } from '../styled/StyledComponents';
import DoneTopPanel from './DoneTopPanel';

class PasswordDone extends Component {
  render() {
    const { isChangeFlow } = this.props;
    return (
      <Fragment>
        <DoneTopPanel />
        <HalfBox p={['0 12px', 0]} mt={['-100px', 0]} position="relative" decoration>
          <Box
            width="100%"
            // height='100%'
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            background="#FBFAF7"
            p={[4, 4, '12% 20%']}
            py="60px"
          >
            <Box mb="60px" textAlign="justify">
              <Box fontSize="20px">You're one step closer to a beautiful mani!</Box>
              <br />
              For security purposes, you'll need to log back in with your new password.
            </Box>
            <StyledStandardDarkButton
              width={1}
              height="32px"
              onClick={ev => {
                ev.preventDefault();
                Router.push(pageLinks.Login.url);
              }}
            >
              LOG IN WITH MY NEW PASSWORD
            </StyledStandardDarkButton>
            {/* <StyledStandardDarkButton
              width={1}
              height="32px"
              onClick={ev => {
                ev.preventDefault();
                Router.push(pageLinks.Home.url);
              }}
            >
              GALLERY
            </StyledStandardDarkButton>
            <Box height="16px" />
            <StyledStandardDarkButton
              width={1}
              height="32px"
              onClick={ev => {
                ev.preventDefault();
                Router.push(pageLinks.Profile.Account.url);
              }}
            >
              ACCOUNT
            </StyledStandardDarkButton> */}
          </Box>
        </HalfBox>
      </Fragment>
    );
  }
}

export default PasswordDone;
