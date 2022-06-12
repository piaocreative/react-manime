import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AuthWallHOC from '../../components/AuthWallHOC'
import Box from '../../components/styled/Box';
import {pageLinks} from '../../utils/links'
import AccountMenu from '../../components/profile/AccountMenu';
import AccountMenuPanel, { ProfileContainer } from '../../components/profile/AccountMenuPanel';
import AccountManiMoney from '../../components/profile/AccountManiMoney';
import TopHeader from '../../components/profile/TopHeader'; 
import ProfileTab from '../../components/profile/overview/ProfileTab';
import Profile from '../../components/profile/overview/Profile';
import InviteFriendPanel from '../../components/profile/overview/InviteFriendPanel';
import  LoadingAnimation from '../../components/LoadingAnimation';
import { getProfileOverview } from 'api/profile';
import log from 'utils/logging';

const ProfileBox = styled(Box)`
  background-color: #f6f4ee;
  padding: 52px;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 52px;
  margin-bottom: 52px;
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProfileOverview = ({ userData, isMobileView, globalProps }) => {
  const [openMani, setOpenMani] = useState(true);
  const [maniProfileOverview, setManiProfileOverview] = useState({});
  const [pediProfileOverview, setPediProfileOverview] = useState({});
  const [loading, setLoading] = useState(false);

  const initProfileOverview = async () => {
    try {
      setLoading(true);
      const userDataInfo = await getProfileOverview(userData.identityId);
      const profiles = userDataInfo.Profiles || [];
      const maniProfile = profiles.find(profile => profile.profileType === 'Manis');
      const pediProfile = profiles.find(profile => profile.profileType === 'Pedis');
      setManiProfileOverview(maniProfile?.profileOverview);
      setPediProfileOverview(pediProfile?.profileOverview);
    } catch(err) {
      log.error(`[overview][initProfileOverview] ` + err, {err});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userData?.identityId) {
      initProfileOverview();
      if (Router.router.query.profileType === 'Pedis') {
        setOpenMani(false);
      }
    }
  }, [userData?.identityId]);

  if (typeof window === 'undefined') {
    return null;
  }

  if (isMobileView) {
    return (
      
      <>
        <TopHeader />
        <Box background='#f4f4f4' textAlign='center'>
          <AccountMenuPanel userData={userData} showMenu={false} />
          <Box fontFamily='avenirHeavy' mt='28px' mb='16px' letterSpacing='4px'>
            MY FIT PROFILE
          </Box>
          <Box pb='24px' fontSize='12px'>
            Keep improving your fit profile and get $5
          </Box>
        </Box>
        <ProfileTab isManiActive={openMani} setOpenMani={setOpenMani} />
        {loading ?
        <Box p='24px' background='#f8f1ed'>
          <LoadingAnimation isLoading background='#f8f1ed' />
        </Box>:
          <>
            {openMani ?
              <Profile profileOverview={maniProfileOverview} isManiProfile />:
              <Profile profileOverview={pediProfileOverview} />
            }
            <InviteFriendPanel />
          </>
        }
        <AccountMenu />
      </>
 
      
   );
  }

  return (
    <>
      <TopHeader />
      <ProfileContainer>
        <Box background='#f4f4f4'>
          <AccountMenuPanel userData={userData} showMenu />
        </Box>
        <div>
          {loading ?
            <LoadingAnimation isLoading background='#f8f1ed' />:
            <>
              <ProfileBox>
                <Profile profileOverview={maniProfileOverview} isManiProfile />
                <Profile profileOverview={pediProfileOverview} />
              </ProfileBox>
              <InviteFriendPanel />
            </>
          }
        </div>
      </ProfileContainer>
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default ManimeStandardContainer(AuthWallHOC(connect(mapStateToProps)(ProfileOverview)));

export const getStaticProps = async () => await getGlobalProps();
