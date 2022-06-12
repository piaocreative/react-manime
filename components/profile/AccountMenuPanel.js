import React from 'react';
import styled from 'styled-components';
import Box from '../../components/styled/Box';
import AccountMenu from './AccountMenu';
import AccountManiMoney from './AccountManiMoney';
import AccountMobileMenu from './AccountMobileMenu';

const AccountMenuPanel = ({ userData, showInfo=true, showMenu=true }) => {
  return (
    <Box background='#f4f4f4'>
      {showInfo && <AccountManiMoney userData={userData} />}
      {!showMenu && <AccountMobileMenu />}
      {showMenu && <AccountMenu />}
    </Box>
  );
};

export const ProfileContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: 320px auto;
    grid-gap: 52px;
    padding: 0 24px;
  }
`;

export default AccountMenuPanel;