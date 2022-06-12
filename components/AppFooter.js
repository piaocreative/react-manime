import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { pageLinks } from 'utils/links';
import Box from './styled/Box';
import { Img } from './styled/StyledComponents';

const Footer = styled(Box)`
  z-index: 10;
  box-sizing: border-box;
  flex-wrap: wrap;
  bottom: 0;
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
  background-color: rgba(44, 67, 73, 1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
  width: 100%;
  font-size: 15px;

  @media (min-width: 768px) {
    padding-left: 70px;
    padding-right: 70px;
  }

  @media (max-width: 479px) {
    padding-bottom: ${props => (props.isProdDetail ? '100px' : '20px')};
  }
`;

const Logo = styled(Img)`
  width: auto;
  cursor: pointer;
  user-select: none;
`;

const CustomLink = styled.a`
  color: #fff;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  &: hover {
    text-decoration: none;
  }
`;

const A = styled.span`
  cursor: pointer;
  color: #fff;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  &: hover {
    text-decoration: none;
  }
`;

const MailA = styled.a`
  cursor: pointer;
  color: #fff;
  white-space: nowrap;
  text-decoration: none;
  &: hover {
    text-decoration: none;
  }
`;

const A2 = styled(A)`
  text-align: center;
  text-transform: none;
  @media (min-width: 480px) {
    text-align: left;
  }
`;

const AppFooter = ({ position = 'absolute', visibility = 'visible' }) => {
  const router = useRouter();
  return (
    <Footer
      position={position}
      style={{ visibility: visibility }}
      flexDirection={['column', 'row', 'row']}
      width="100%"
      isProdDetail={router.pathname.includes(pageLinks.ProductDetail.url)}
      py={['20px', '40px']}
    >
      <Box
        width={['100%', '50%', '50%', '25%']}
        display="flex"
        mb={[4, 3]}
        justifyContent={'space-between'}
        alignItems={['center', 'flex-start']}
        flexDirection="column"
      >
        <Link href={pageLinks.Home.url}>
          <a>
            <Logo
              alt="ManiMe Logo"
              height={['20px', '25px', '40px']}
              mt={[3, 0]}
              mb={3}
              src="/static/images/white-logo.png"
              alt="ManiMe Logo"
            />
          </a>
        </Link>
        <Box color="white" display="flex" flexDirection="column" justifyContent="space-between">
          <Box color="white" style={{ cursor: 'default' }} textAlign={['center', 'left']}>
            © 2021 ManiMe
          </Box>
          <Link href={pageLinks.Privacy.url}>
            <a>
              <A2>Privacy Policy</A2>
            </a>
          </Link>
          <Link href={pageLinks.Terms.url}>
            <a>
              <A2>Terms of Use</A2>
            </a>
          </Link>
        </Box>
      </Box>
      <Box
        width={['100%', '50%', '50%', '25%']}
        textAlign={['center', 'left']}
        mt={[2, 3]}
        mb={[3, 3]}
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Box mb={3}>
          <Link href={pageLinks.HowToApply.url}>
            <a>
              <A mb={3}>How To</A>
            </a>
          </Link>
        </Box>
        <Box mb={3}>
          <Link href={pageLinks.AboutUs.url}>
            <a>
              <A>{pageLinks.AboutUs.label}</A>
            </a>
          </Link>
        </Box>
        <Box mb={[0, 3]}>
          <Link href={pageLinks.Faq.url}>
            <a>
              <A>{pageLinks.Faq.label}</A>
            </a>
          </Link>
        </Box>
      </Box>
      <Box
        width={['100%', '50%', '50%', '25%']}
        color="white"
        display="flex"
        textAlign={['center', 'left']}
        mt={[2, 3]}
        mb={[3, 3]}
        flexDirection="column"
        fontFamily="sansSerif"
      >
        <Box mb={3}>
          <CustomLink href={'https://www.instagram.com/manime.co/?hl=en'}>Instagram</CustomLink>
        </Box>
        <Box mb={3}>
          <CustomLink href={'https://www.facebook.com/ManiMe.co/'}>Facebook</CustomLink>
        </Box>
        <Box mb={3}>
          <CustomLink href={pageLinks.Blog.url}>{pageLinks.Blog.label}</CustomLink>
        </Box>
      </Box>
      <Box
        width={['100%', '50%', '50%', '25%']}
        textAlign={['center', 'left']}
        mt={[2, 3]}
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Box
          mb={[3, 3, 2]}
          color="white"
          style={{ cursor: 'default' }}
          display="flex"
          alignItems="center"
          justifyContent={['center', 'center', 'flex-start']}
          mx={['auto', 'auto', 'unset']}
          width={['90%', '90%', 'unset']}
        >
          <Box
            display={['block', 'block', 'none']}
            height="1px"
            width="90%"
            background="white"
            mx="auto"
          />
          <Box
            px={['12px', '12px', 0]}
            mb={2}
            color="white"
            fontFamily={['avenirBlack', 'unset']}
            style={{ whiteSpace: 'nowrap' }}
          >
            CONTACT US
          </Box>
          <Box
            display={['block', 'block', 'none']}
            height="1px"
            width="90%"
            background="white"
            mx="auto"
          />
        </Box>
        <Box mb={1} color="white" style={{ cursor: 'default' }}>
          CUSTOMER HAPPINESS
        </Box>
        <Box display="flex" flexDirection={['column', 'column', 'row']} flexWrap="wrap">
          <Box mb={2} mr={[0, 0, 3]}>
            <MailA href={'mailto:care@manime.co'}>
              <svg
                width="14.648"
                height="11.762"
                viewBox="0 0 14.648 11.762"
                style={{ marginRight: '12px' }}
              >
                <g transform="translate(14.439 0.2) rotate(90)">
                  <path
                    d="M0,.684v12.28a.693.693,0,0,0,.7.684h9.358a.693.693,0,0,0,.7-.684V.684a.693.693,0,0,0-.7-.684H.7A.693.693,0,0,0,0,.684Z"
                    transform="translate(0.3 0.291)"
                    fill="none"
                    stroke="#fff"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,0,5.486,6.092a.734.734,0,0,1,0,.987L0,13.174"
                    transform="translate(0.472 0.528)"
                    fill="none"
                    stroke="#fff"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,0,4.392,4.877"
                    transform="translate(6.402 8.914)"
                    fill="none"
                    stroke="#fff"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,4.879,4.392,0"
                    transform="translate(6.453 0.478)"
                    fill="none"
                    stroke="#fff"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                  />
                </g>
              </svg>
              {'care@manime.co'}
            </MailA>
          </Box>
          <Box mb={3} color="white" fontSize="14px" style={{ cursor: 'default' }}>
            <svg
              width="14.326"
              height="14.327"
              viewBox="0 0 14.326 14.327"
              style={{ marginRight: '16px' }}
            >
              <g transform="translate(14.077 0.25) rotate(90)">
                <path
                  d="M.65,6.5a.65.65,0,1,1,.65-.651A.651.651,0,0,1,.65,6.5Zm0-2.6a.651.651,0,1,1,.65-.652A.652.652,0,0,1,.65,3.9Zm0-2.6A.651.651,0,1,1,1.3.652.651.651,0,0,1,.65,1.3Z"
                  transform="translate(6.259 3.656)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
                <path
                  d="M0,6.658a6.661,6.661,0,0,0,9.974,5.776l2.664.858a.52.52,0,0,0,.654-.656l-.858-2.664A6.659,6.659,0,1,0,0,6.658Z"
                  transform="translate(0.25 0.251)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
              </g>
            </svg>
            {'(213) 340 - 0364'}
          </Box>
        </Box>
        <Box mb={1} color="white" style={{ cursor: 'default' }}>
          PR + PARTNERSHIPS
        </Box>
        <Box mb={[4, 4, 0]}>
          <MailA href={'mailto:care@manime.co'}>
            <svg
              width="14.648"
              height="11.762"
              viewBox="0 0 14.648 11.762"
              style={{ marginRight: '12px' }}
            >
              <g transform="translate(14.439 0.2) rotate(90)">
                <path
                  d="M0,.684v12.28a.693.693,0,0,0,.7.684h9.358a.693.693,0,0,0,.7-.684V.684a.693.693,0,0,0-.7-.684H.7A.693.693,0,0,0,0,.684Z"
                  transform="translate(0.3 0.291)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
                <path
                  d="M0,0,5.486,6.092a.734.734,0,0,1,0,.987L0,13.174"
                  transform="translate(0.472 0.528)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
                <path
                  d="M0,0,4.392,4.877"
                  transform="translate(6.402 8.914)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
                <path
                  d="M0,4.879,4.392,0"
                  transform="translate(6.453 0.478)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
              </g>
            </svg>
            {'press@manime.co'}
          </MailA>
        </Box>
        <Box
          display={['block', 'block', 'none']}
          height="1px"
          width="90%"
          background="white"
          mx="auto"
          mb={4}
        />
      </Box>
    </Footer>
  );
};

const RealFooter = ({ pathname }) => (
  <>
    <AppFooter />
    <AppFooter position="relative" visibility="hidden" />
  </>
);

export default RealFooter;
