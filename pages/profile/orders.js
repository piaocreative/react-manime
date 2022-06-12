import AuthWallHOC from 'components/AuthWallHOC';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import OrderList from 'components/OrderList';
import AccountMenuPanel, { ProfileContainer } from 'components/profile/AccountMenuPanel';
import TopHeader from 'components/profile/TopHeader';
import Box from 'components/styled/Box';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const ProfileContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: center;
  margin-left: 0;
  background: #fcf9f7;
`;

const ProfileContentTitleBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7c0a0;
  width: 100%;
  height: 88px;
  letter-spacing: 2px;
`;

const ProfileOrder = ({ userData, isMobileView, globalProps }) => {
  return (
    <>
      <TopHeader />
      <ProfileContainer>
        <AccountMenuPanel userData={userData} showInfo showMenu={!isMobileView} />
        <ProfileContentContainer overflow="auto" position="relative">
          <ProfileContentTitleBox>ORDER HISTORY</ProfileContentTitleBox>
          <OrderList />
        </ProfileContentContainer>
        {isMobileView && <AccountMenuPanel userData={userData} showInfo={false} showMenu />}
      </ProfileContainer>
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default ManimeStandardContainer(AuthWallHOC(connect(mapStateToProps)(ProfileOrder)));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
