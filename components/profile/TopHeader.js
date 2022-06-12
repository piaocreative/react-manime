import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Box from '../../components/styled/Box';

const Header = styled(Box)`
  background-color: ${props => props.theme?.colors?.teal};
  color: ${props => props.theme?.colors?.white};
  height: 160px;
  font-size: 12px;
  text-align: center;
  margin: 0;
  letter-spacing: 2px;
  & > p {
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${props => props.theme?.colors?.white};
    font-size: 20px;
    padding: 30px 0 16px;
    margin: 0;
  }
  @media (min-width: 768px) {
    height: 240px;
    font-size: 18px;
    margin: 0 0 -50px;
    & > p {
      padding: 60px 0 24px;
      font-size: 28px;
    }
  }  
`;

const TopHeader = ({ userData }) => {
  const firstName = userData?.name?.firstName || '';
  return (
    <>
      <Header>
        <p>Hi {firstName}</p>
        Good to see you back
      </Header>
    </>
  );
}

const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(TopHeader);