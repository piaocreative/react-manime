import { Auth } from '@aws-amplify/auth';
import Box from 'components/styled/Box';
import { StandardOutlinedButton } from 'components/styled/StyledComponents';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { pageLinks, profileLinks } from 'utils/links';

const ProfileListBox = styled(Box)`
  width: 100%;
  height: auto;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 768px) {
    width: ${props => (props.isNarrow ? '320px' : '400px')};
    min-width: 320px;
  }
`;

const LinkItem = styled(Box)`
  padding: 16px 8px;
  white-space: nowrap;
  text-align: center;
  letter-spacing: 2px;
  color: #2c4349;
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    background: #f7bfa0;
  }
`;

const Line = styled(Box)`
  width: 80%;
  height: 1.5px;
  background-color: #d8d8d8;
  margin-top: 20px;
  margin-bottom: 1px;
  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const LogoutButton = styled(StandardOutlinedButton)`
  margin-top: 10px;
  margin-bottom: 20px;
  color: #c0c0c0;
  border: 1px solid #c0c0c0;
  &:hover {
    color: #2c4349;
    border: 1px solid #2c4349;
  }
  @media (min-width: 768px) {
    margin-top: 40px;
  }
`;

const DesktopBox = styled(Box)`
  display: none;
  width: 100%;
  flex-direction: column;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const MobileBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 768px) {
    display: none;
  }
`;

const ProfileBox = styled(Box)`
  cursor: pointer;
  margin-top: 28px;
  @media (min-width: 768px) {
    margin-top: 60px;
  }
`;

const EmailBox = styled(Box)`
  margin-top: 5px;
  margin-bottom: 0;
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const ProfileMenu = props => {
  const [selectedItemLink, setSelectedItemLink] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuClickHandler = () => {
    setIsMenuOpen(false);
  };

  const logoutHandler = () => {
    Auth.signOut().finally(() => {
      if (window['dataLayer']) {
        window['dataLayer'].push({
          event: 'signOut',
          customerId: null,
          customerEmailSHA1: null,
          customerPhoneSHA1: null,
          customerEmailSHA256: null,
          customerPhoneSHA256: null,
        });
      }
      props.dispatchResetUserData();

      if (props?.userData?.providerName === 'cognito') {
        Router.push(pageLinks.signOut.url);
      }
    });
  };

  useEffect(() => {
    setSelectedItemLink(Router.pathname);
  }, []);

  const { userData, isNarrow } = props;
  const fullName = userData.name ? `${userData.name.firstName} ${userData.name.lastName}` : '';
  const providerName = userData.providerName || '';
  const isCognito = !providerName.includes('google') && !providerName.includes('facebook');
  const displayLinks = isCognito
    ? profileLinks
    : profileLinks.filter(item => item.link !== pageLinks.Profile.ChangePassword.url);

  // if (!userData || !userData.isAuth) {
  //   return null;
  // }
  return (
    <ProfileListBox isNarrow={isNarrow}>
      <Link href={pageLinks.Profile.Account.url}>
        <ProfileBox fontSize={14} color="forecolor.1">
          PROFILE
        </ProfileBox>
      </Link>
      {(!isNarrow || true) && (
        <Box
          letterSpacing="1px"
          fontSize={'30px'}
          fontFamily="gentiumBasic"
          textAlign="center"
          fontStyle="italic"
          color="forecolor.1"
        >
          {fullName}
        </Box>
      )}
      <EmailBox color="forecolor.1">{userData.email}</EmailBox>
      <Line />

      <DesktopBox
        textAlign="center"
        display="flex"
        flexDirection={['column']}
        overflow={['scroll', 'auto']}
        width="100%"
      >
        {displayLinks.map((item, index) => (
          <Link key={index} href={item.link}>
            <a>
              <LinkItem
                background={selectedItemLink === item.link && '#F7BFA0'}
                key={index}
                whiteSpace="nowrap"
                onClick={menuClickHandler}
              >
                {item.label}
              </LinkItem>
            </a>
          </Link>
        ))}
      </DesktopBox>
      <MobileBox flexDirection="column">
        <LinkItem
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          MENU
          <img
            src="/static/icons/arrow-down-icon.svg"
            style={{ transform: isMenuOpen && 'rotate(180deg)', marginLeft: 12 }}
          />
        </LinkItem>
        {isMenuOpen &&
          displayLinks.map((item, index) => (
            <Link key={index} href={item.link}>
              <a>
                <LinkItem key={index} whiteSpace="nowrap" onClick={menuClickHandler}>
                  {item.label}
                </LinkItem>
              </a>
            </Link>
          ))}
      </MobileBox>
      <LogoutButton px="16px" color="#C0C0C0" border="1px solid #C0C0C0" onClick={logoutHandler}>
        LOG OUT
      </LogoutButton>
    </ProfileListBox>
  );
};

const mapStateToProps = state => {
  userData: state.userData;
};

const mapDispatchToProps = dispatch => ({
  dispatchResetUserData: () => dispatch({ type: 'RESET_USER_DATA' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
