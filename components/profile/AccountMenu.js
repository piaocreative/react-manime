import { Auth } from '@aws-amplify/auth';
import { SET_FLOW, SET_PRODUCTS_DATA } from 'actions';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { externalLinks, pageLinks, profileLinks } from 'utils/links';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import { OutlinedDarkButton } from '../basic/buttons';
import ArrowIcon from '../icons/ArrowIcon';
import Box from '../styled/Box';

const links = [
  {
    label: 'My Fit Profile',
    link: pageLinks.Profile.Account.url,
  },
  ...profileLinks,
];

const Container = styled(Box)`
  display: grid;
  width: 100%;
  background-color: #f4f4f4;
  padding: 32px 40px;
`;

const ListBox = styled(Box)`
  display: grid;
  grid-gap: 24px;
  border-left: 1px solid;
  border-color: ${props => props.theme?.colors?.primary};
  padding-left: 24px;
  font-size: 14px;
  margin-bottom: 32px;
`;

const LinkItem = styled(Box)`
  cursor: pointer;
  display: grid;
  grid-template-columns: auto auto;
  place-items: baseline;
  letter-spacing: 1px;
  white-space: nowrap;
  text-transform: uppercase;
  font-family: ${props => props.active && 'avenirHeavy'};
  &:hover {
    font-family: 'avenirHeavy';
  }
  & > svg {
    transform: rotate(-90deg);
    margin-left: auto;
  }
`;

const AccountMenu = props => {
  const [selectedItemLink, setSelectedItemLink] = useState();
  const [isCognitoUser, setIsCognitoUser] = useState();

  useEffect(() => {
    setSelectedItemLink(Router.pathname);
  }, []);

  useEffect(() => {
    if (props.userData.isAuth) {
      const providerName = props.userData?.providerName || '';
      const isCognito = !providerName.includes('google') && !providerName.includes('facebook');
      setIsCognitoUser(isCognito);
    }
  }, [props.userData.isAuth]);

  const logoutHandler = () => {
    trackFunnelActionProjectFunnel(`AccountMenu logoutHandler`);
    props.dispatchResetUserData();

    Auth.signOut().finally(() => {
      if (isCognitoUser) {
        Router.push('/');
      }
    });
  };
  // let manageSubscriptionLink = null;
  // if (props.userData.recurlyAuthToken) {
  //   manageSubscriptionLink = (
  //     <>
  //       <Link href={`${externalLinks.SubscriptionManage.url}/${props.userData.recurlyAuthToken}`}>
  //         <a target="_blank">
  //           <LinkItem active={false}>
  //             {externalLinks.SubscriptionManage.label} {<ArrowIcon color="forecolor.4" />}
  //           </LinkItem>
  //         </a>
  //       </Link>
  //     </>
  //   );
  // }
  const visibleLinks = isCognitoUser
    ? links
    : links.filter(item => item.link !== pageLinks.Profile.ChangePassword.url);

  const subscriberLinks = props.userData.recurlyAuthToken
    ? visibleLinks
    : visibleLinks.filter(item => item.link !== pageLinks.Profile.ManageSubscription.url);

  return (
    <Container>
      <Box fontSize="14px" fontFamily="avenirHeavy" mb="32px" letterSpacing="2px">
        ACCOUNT MENU
      </Box>
      <ListBox>
        {subscriberLinks.map((item, index) => (
          <Link key={index} href={item.link}>
            <a>
              <LinkItem key={index} active={item.link === selectedItemLink}>
                {item.label} {item.link !== selectedItemLink && <ArrowIcon color="forecolor.4" />}
              </LinkItem>
            </a>
          </Link>
        ))}
        {/* {manageSubscriptionLink} */}
      </ListBox>
      <OutlinedDarkButton onClick={logoutHandler}>LOG OUT</OutlinedDarkButton>
    </Container>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

const mapDispatchToProps = dispatch => ({
  dispatchResetUserData: () => dispatch({ type: 'RESET_USER_DATA' }),
  dispatchSetFlow: flowName => dispatch(SET_FLOW(flowName)),
  dispatchSetProducts: products => dispatch(SET_PRODUCTS_DATA(products)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu);
