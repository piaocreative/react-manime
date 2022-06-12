import React from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';

const Container = styled(Box)`
  position: relative;
  width: 100%;
  height: 380px;
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  background-color: #29444b;
  background-image: url('/static/images/profile-overview-top1.jpg');
  @meida (min-width: 1024px){
    height: 346px;
  }
`;

const TextBox = styled(Box)`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100px
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px 0 0;
  text-align: center;

  @media (min-width: 1024px) {
    position: absolute;
    left: 0;
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 0 0 40px; 
  }
`;

const TitleBox = styled(Box)`
  font-size: 24px;
  color: #fff;
  letter-spacing: 2px;
  font-family: 'avenirLight';
  text-transform: uppercase;
  @media(min-width: 1024px) {
    font-size: 35px;
  }
`;

const DescriptionBox = styled(Box)`
  font-size: 13px;
  color: #fff;
  letter-spacing: 2px;
  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

const ProfileOverviewHeader = ({ firstName }) => {
  return (
    <Container>
      <TextBox>
        <TitleBox fontSize='35px'>HI {firstName} </TitleBox>
        <DescriptionBox>GOOD TO SEE YOU BACK</DescriptionBox>
      </TextBox>
    </Container>
  );
}

export default ProfileOverviewHeader;