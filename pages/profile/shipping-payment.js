import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Box from '../../components/styled/Box';
import TopHeader from '../../components/profile/TopHeader';
import AccountMenuPanel, { ProfileContainer } from '../../components/profile/AccountMenuPanel';
import ShippingAddress from '../../components/checkout/Shipping';
import Payment from '../../components/checkout/Payment';
import AuthWallHOC from '../../components/AuthWallHOC'
const ProfileOrderContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  margin-left: 0;
  margin-top: 20px;
  padding: 8px;
  background: #FCF9F7;
  @media (min-width: 767px) {
    margin-top: 40px;
    padding: 20px;
  }
`;

const ProfileRenderBox = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  flex-grow: 1;
  background: #FCF9F7;
  padding: 8px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const ProfileShippingPayment = ({ userData, isMobileView, globalProps }) => {
  return (
    
          <>
      <TopHeader />
      <ProfileContainer>
        <AccountMenuPanel userData={userData} showInfo showMenu={!isMobileView} />
        <div>
          <ProfileRenderBox>
            <Box fontSize='16px' mt='20px' color='forecolor.1' textAlign='center'>SHIPPING INFO</Box>
            <ShippingAddress profile hideActions onNext={() => {}} />
          </ProfileRenderBox>
          <ProfileOrderContainer>
            <Box fontSize='16px' mt='20px' color='forecolor.1'>BILLING INFO</Box>
            <Payment profile hideActions onBack={() => {}}/>
          </ProfileOrderContainer>
        </div>
        {isMobileView &&
          <AccountMenuPanel userData={userData} showInfo={false} showMenu />
        }
      </ProfileContainer>
    </>

    
  );
}; 

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData
});

export default ManimeStandardContainer(AuthWallHOC(connect(
  mapStateToProps,
)(ProfileShippingPayment)));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
