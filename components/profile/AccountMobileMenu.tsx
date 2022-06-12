import React, { memo, useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Box from '../styled/Box';
import { useSelector } from 'react-redux';
import log from 'utils/logging'
import { pageLinks, profileLinks } from '../../utils/links';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  overflow-x: auto;
  height: 56px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  background-color: #fff;
  & > a {
    height: 100%;
    &:focus {
      outline: none;
    }
  }
`;

const LinkItem = styled.div`
  display: grid;
  place-items: center;
  border-bottom: 3px solid;
  white-space: nowrap;
  height: 100%;

  outline: none;
  border-color: ${props => props.active ? '#f7bfa0': 'transparent'};
  font-family: ${props => props.active ? 'avenirHeavy': 'avenirBook'};
  &:focus {
    outline: none;
  }
  margin-left: 12px;
  margin-right: 12px;
  @media (min-width: 414px) {
    margin-left: 16px;
    margin-right: 16px;
  }

`;

const links = [
  {
    label: 'Fit Profile',
    link: pageLinks.Profile.Account.url,
  },
  ...profileLinks
];

const AccountMobileMenu = () => {
  const [selectedItemLink, setSelectedItemLink] = useState('');
  const userData = useSelector((state : any) => state.userData);
  const providerName = userData?.providerName || '';
  const isCognitoUser = !providerName.includes('google') && !providerName.includes('facebook');
  const visibleLinks = isCognitoUser ? links : links.filter(item => item.link !== pageLinks.Profile.ChangePassword.url);
  
  const ref = useRef();

  useEffect(() => {
    if (ref?.current) {
      setSelectedItemLink(Router.pathname);
      const selectedIndex = visibleLinks.findIndex(link => link.link === Router.pathname);
      try {
        const element = ref.current || { children: []};
        const childList = element.children;
        childList[selectedIndex].focus();
      } catch (err) {
        log.error(`[AccountMobileMenu][useEffect] ref?.current caught error: ` + err, {err}) ;
      }
    }
  }, [ref?.current]);

  return (
    <Container ref={ref}>
      {visibleLinks.map((item, index) => (
        <Link key={index} href={item.link}>
          <a>
            <LinkItem key={index} active={item.link === selectedItemLink}>
              {item.label}
            </LinkItem>
          </a>
        </Link>
      ))}
    </Container>
  );
};

export default memo(AccountMobileMenu);