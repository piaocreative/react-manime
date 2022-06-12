import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Box from '../styled/Box';

const Container = styled(Box)`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
  background: #F9F9F9;
  overflow: hidden;
  flex-grow: 1;
  height: 600px;
  position: relative;
  overflow: hidden;
  // minHeight='300px'
  & > div {
    width: 100%;
    max-height: 400px;
  }
  @media (min-width: 768px) {
    height: 400px;
    margin-top: 0;
    margin-left: 40px;
    flex-direction: row;
    & > div {
      width: 50%;
    }
  }
`;

const RenderImage = styled.img`
  position: absolute;
  left: 50%;
  height: 80%;
  transform: translate(-50%, 20%);
  bottom: 0;
  object-fit: cover;
  @media (min-width: 480px) {
    left: 75%;
    height: 100%;
    transform: translate(-50%, 20%);
  }
`;

const ProfileGreeting = ({userData}) => (
  <Container>
    <Box display='flex' justifyContent='center' alignItems='center' p={3}>
      <Box textAlign='center' pl={[0, '40px']} zIndex={1}>
        <Box fontSize='35px' letterSpacing='2px' color='primary.0'>HI {userData && userData.isAuth && typeof userData.name.firstName == 'string' && userData.name.firstName.toUpperCase()}</Box>
        <Box fontSize='20px' color='primary.0' opacity={0.5} letterSpacing='4px' fontFamily='gentiumBasic' >
          Your nails are <br />
          beautiful, and so<br />
          are you
        </Box>

      </Box>
    </Box>
    {/* <Box position='relative' overflow='hidden' minHeight='300px'> */}
      <RenderImage src='https://d1b527uqd0dzcu.cloudfront.net/web/profile-render.png' alt='manime-greeting' />
    {/* </Box> */}
  </Container>
);

const mapStateToProps = state => ({
  userData: state.userData
});
export default connect(mapStateToProps, null)(ProfileGreeting);
