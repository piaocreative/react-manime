import AuthWallHOC from 'components/AuthWallHOC';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import EntitlementList from 'components/EntitlementList';
import AccountMenuPanel, { ProfileContainer } from 'components/profile/AccountMenuPanel';
import TopHeader from 'components/profile/TopHeader';
import Box from 'components/styled/Box';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const ProfileSubscriptionContainer = styled(Box)`
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
  text-transform: uppercase;
`;

const ProfileSubscription = ({ userData, isMobileView, globalProps }) => {
  // get subscription and entitlement info for display
  console.log({ at: 'ProfileSubscription', userData });
  return (
    <>
      <TopHeader />
      <ProfileContainer>
        <AccountMenuPanel userData={userData} showInfo showMenu={!isMobileView} />
        <ProfileSubscriptionContainer overflow="auto" position="relative">
          <ProfileContentTitleBox>Subscription</ProfileContentTitleBox>
          <EntitlementList />
        </ProfileSubscriptionContainer>
      </ProfileContainer>
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default ManimeStandardContainer(AuthWallHOC(connect(mapStateToProps)(ProfileSubscription)));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();
