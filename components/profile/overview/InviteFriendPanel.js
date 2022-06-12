import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Box from '../../styled/Box';
import { WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import constants from '../../../constants';

const Container = styled(Box)`
  display: grid;
  place-content: flex-start;
  background-color: #ebdad0;
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/design-every-occasionv3.jpg');
  background-position: right;
  background-repeat: no-repeat;
  background-size: contain;
  height: 140px;
  grid-gap: 12px;
  padding: 20px;
  margin: 20px 16px 30px;
  & > button {
    border: none;
  }
  @media (min-width: 768px) {
    background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-friend.jpg');
    background-size: cover;
    grid-column-start: 2;
    grid-column-end: 3;
    place-items: baseline;
    padding: 60px 40px;
    margin: 0;
    height: 164px;
    grid-gap: 40px;
    grid-template-columns: auto auto auto;
    & > button {
      min-width: 210px;
    }
  }

  @media (min-width: 768px) {

  }
`;

const InviteFriendPanel = () => {
  const inviteHandler = () => {
    Router.push(pageLinks.Profile.Friends.url);
  };
  
  return (
    <Container>
      <Box fontSize={[14, 16]} fontFamily='avenirHeavy' letterSpacing='4px' style={{textTransform: 'uppercase'}}>Give ${constants.referral.NORMAL_REFERREE_CREDIT}, Get ${constants.referral.NORMAL_REFERRER_CREDIT}</Box>
      <Box fontSize={[14, 16]}>Share with friends and earn free manis</Box>
      <WhiteButton onClick={inviteHandler}>REFER A FRIEND</WhiteButton>
    </Container>
  );
};

export default InviteFriendPanel;
