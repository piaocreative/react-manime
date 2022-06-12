import React from 'react';
import styled from 'styled-components';
import Box from '../../components/styled/Box';

const ManiMoneyBox = styled(Box)`
  height: 144px;
  background-color: ${props => props.theme?.colors?.white};
  text-align: center;
  font-size: 14px;
  letter-spacing: 1px;

  @media (min-width: 768px) {
    background-color: #f4f4f4;
    transform: unset;
  }
`;

const AccountAvatar = styled.img`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
`;

const ManiMoney = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1e1db;
  height: 30px;
  padding: 0 18px 0 20px;
  width: 260px;
  margin: 0 auto;
  white-space: nowrap;
  & > span {
    font-family: avenirHeavy;
  }

  & > img {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    transform: translate(-50%, 0)
  }
`;

const AccountManiMoney = ({ userData, showCredits }) => {

  const firstName = userData?.name?.firstName || '';
  const lastName = userData?.name?.lastName || '';
  const credits = userData?.credits || 0;

  return (
    <ManiMoneyBox>
      <AccountAvatar
        src='/static/icons/profile/mani-account.svg'
        alt='account-avatar' />
      <Box pt='52px' mb='8px' fontSize='16px' fontFamily='gentiumBasic' fontWeight='Bold'>{firstName} {lastName}</Box>
      <Box mb='8px'>{userData.email} </Box>
      <ManiMoney>
        <img src='/static/icons/orange-dollar-bubble.svg' alt='credits' />
        You have&nbsp;<span>${credits.toFixed(2)}</span>&nbsp;ManiMoney
      </ManiMoney>
    </ManiMoneyBox>
  );
};

export default AccountManiMoney;