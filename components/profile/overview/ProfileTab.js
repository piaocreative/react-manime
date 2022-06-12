import React from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';
import ManiProfileIcon from '../../icons/profile/ManiProfileIcon';
import PediProfileIcon from '../../icons/profile/PediProfileIcon';

const Tab = styled(Box)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  place-content: center;
  width: 50%;
  height: 100%;
  background-color: ${props => props.active? props.theme.colors.white: '#f4f4f4'};
  border-bottom: ${props => props.active? '3px solid #f7bfa0': '3px solid transparent'};
  font-family: ${props => !props.active? 'avenirBook': 'avenirHeavy'};
  font-size: 12px;
  letter-spacing: 2px;
  & svg {
    min-width: 32px;
    margin-right: 8px;
  }
`;

const ProfileTab = ({ isManiActive, setOpenMani }) => {
  const openMani = () => {
    setOpenMani(true);
  };

  const openPedi = () => {
    setOpenMani(false);
  };

  return (
    <Box width={1} height={'54px'} display='flex'>
      <Tab active={isManiActive} onClick={openMani}>
        <ManiProfileIcon color={isManiActive ? '#f7bda3': '#bdc3c5'}/>
        MANI PROFILE 
      </Tab>
      <Tab active={!isManiActive} onClick={openPedi}>
        <PediProfileIcon color={!isManiActive ? '#f7bda3': '#bdc3c5'} />
        PEDI PROFILE
      </Tab>
    </Box>
  );
};

export default ProfileTab;