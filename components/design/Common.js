//

import styled from 'styled-components';
import Box from '../styled/Box';
import { Img } from '../styled/StyledComponents';

export const ThinBannerBox = styled(Box)`
  background-color: ${props => (props.bg ? props.bg : '#e1e1df')};
  width: 100%;
  height: ${props => (props.mobileURL ? '148px' : '100px')};
  background-size: cover;
  background-image: ${props => (props.mobileURL ? `url('${props.mobileURL}')` : 'none')};
  background-repeat: no-repeat;
  margin-bottom: -30px;
  background-position: 86% 0%;
  @media (min-width: 768px) {
    background-size: cover;
    background-position: center right;
    background-image: ${props => (props.desktopURL ? `url('${props.desktopURL}')` : 'none')};
    height: ${props => (props.mobileURL ? '200px' : '100px')};
    margin-bottom: -40px;
  }
`;

export const ThinGreenBannerBox = styled(Box)`
  background-color: ${props => (props.bg ? props.bg : '#2c4349')};
  width: 100%;
  height: 148px;
  margin-bottom: -30px;
  background-position: 86% 0%;
  @media (min-width: 768px) {
    height: 200px;
    margin-bottom: -40px;
  }
`;

export const BannerBox = styled(Box)`
  background-color: ${props => (props.bg ? props.bg : '#ebeae6')};
  color: ${props => (props.fg ? props.fg : 'rgb(44, 67, 73)')};
  width: 100%;
  min-height: 420px;
  height: ${props => (props.height ? props.height : '60vh')};
  background-size: cover;
  background-image: ${props => props.mobileURL && `url('${props.mobileURL}')`};
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: -30px;
  background-position: bottom;
  @media (min-width: 768px) {
    height: ${props => (props.height ? props.height : '50vh')};
    margin-bottom: -40px;
    background-position: 100% 0%;
    background-image: ${props => props.desktopURL && `url('${props.desktopURL}')`};
  }

  @media (min-width: 1540px) {
    background-position: 100% 0%;
  }
`;

export const BuilderPageHeader = ({ pageInfo }) => {
  const pageData = pageInfo?.data;
  const mobileURL = pageData?.headerImageMobile || pageData?.headerImageMobileUrl;
  const desktopURL = pageData?.headerImageDesktop || pageData?.headerImageDesktopUrl;
  const bg = pageData?.headerBackgroundColor;
  const fg = pageData?.headerTextColor;
  const title = pageData?.headerTitle;
  const subtitle = pageData?.headerSubtitle;

  return mobileURL || desktopURL || title || subtitle ? (
    <BannerBox
      bg={bg || '#ebeae6'}
      fg={fg || 'rgb(44, 67, 73)'}
      mobileURL={mobileURL}
      desktopURL={desktopURL}
    >
      <CustomTitleBox>
        {title}
        <DescriptionBox maxWidth={['60%', 'unset']}>{subtitle}</DescriptionBox>
      </CustomTitleBox>
    </BannerBox>
  ) : null;
};

export const BannerCenterBox = ({ isMobileView, mobileURL, desktopURL, bg, children, ...rest }) => (
  <Box width={1} position="relative" background={bg} minHeight="100px" {...rest}>
    <Img
      style={{ objectFit: 'contain' }}
      width={1}
      src={isMobileView ? mobileURL : desktopURL}
      alt="banner-box"
      mb="-30px"
    />
    <Box position="absolute" width={1} left="0" top="0" bottom="0">
      {children}
    </Box>
  </Box>
);

export const ThinTitleBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: ${props => (props.width ? props.width : '40%')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : 'unset')};
  font-size: 16px;
  letter-spacing: 2px;
  text-align: left;
  height: 34px;
  margin-top: 50px;
  margin-left: 12px;
  @media (min-width: 768px) {
    align-items: flex-start;
    margin-left: 32px;
    font-size: 20px;
    margin-top: unset;
    display: flex;
    width: 40%;
    max-width: unset;
    height: 100%;
  }
`;

export const TitleBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  font-size: 23px;
  letter-spacing: 2px;
  text-align: center;
  align-items: center;
  height: 34px;
  margin-top: ${props => props.marginTop || '40px'};
  padding-top: ${props => props.paddingTop || '0'};
  // text-transform: uppercase;
  @media (min-width: 768px) {
    align-items: flex-start;
    margin-left: 10%;
    font-size: 28px;
    margin-top: unset;
    display: flex;
    width: 40%;
    height: 100%;
  }
  @media (min-width: 1024px) {
    margin-left: ${props => (props.marginLeft ? props.marginLeft : '15%')};
  }
`;

const CustomTitleBox = styled(TitleBox)`
  height: unset;
  @media (min-width: 768px) {
    height: 100%;
  }
`;

export const CenterTitleBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  font-size: 23px;
  letter-spacing: 2px;
  text-align: center;
  align-items: center;
  height: 34px;
  margin-top: 50px;
  text-transform: uppercase;
  @media (min-width: 768px) {
    font-size: 28px;
    margin-top: 70px;
  }
`;

export const ThinDescriptionBox = styled(Box)`
  font-size: 12px;
  margin-top: 8px;
  letter-spacing: 0.5px;
  p {
    color: inherit;
    background-color: inherit;
  }
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

export const DescriptionBox = styled(Box)`
  font-size: 13px;
  margin-top: 8px;
  letter-spacing: 0;
  text-transform: none;
  p {
    color: inherit;
    background-color: inherit;
  }
  @media (min-width: 768px) {
    text-align: ${props => props.textAlign || 'left'};
    font-size: 17px;
  }
`;

export const FlashSaleBannerBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => (props.bg ? props.bg : '#d30047')};
  width: 100%;
  height: 220px;
  margin-bottom: -30px;
  background-position: bottom;
  padding: 16px 16px 32px 16px;
  @media (min-width: 768px) {
    flex-direction: row;
    height: 240px;
    margin-bottom: -40px;
    padding: 16px 32px;
  }
`;

export const SummerNostalgiaThinHeader = ({
  bg = '#d3e2e9',
  title = 'Summer Nostalgia',
  description = 'Every summer has a story.',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-summer-nostalgia-mobile.jpg?v=1626419849"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-summer-nostalgia-desktop.jpg?v=1626419849"
  >
    <ThinTitleBox width="50%" maxWidth="180px">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SummerPicnicThinHeader = ({
  bg = '#f0eced',
  title = 'Summer Picnic',
  description = 'Al fresco manis & pedis',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-summer-picnic2-mobile.jpg?v=1624044863"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-summer-picnic2-desktop.jpg?v=1624044863"
  >
    <ThinTitleBox width="50%" maxWidth="180px">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const PrideCapsuleThinHeader = ({ bg = '#f6f6f6', title = 'PRIDE Capsule' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/desgin-thin-pride-capsule-mobile.jpg?v=1621025852"
    desktopURL="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/desgin-thin-pride-capsule-desktop.jpg?v=1621025814"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>
        With JVN x MEI <br />
        In celebration of ALL love
      </ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const MarrowCapsuleThinHeader = ({
  bg = '#d1937d',
  title = 'ManiMe x Marrow',
  description = 'Manis & Matrimony',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-marrow-capsule-mobile.jpg?v=1617957038"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-marrow-capsule-desktop.jpg?v=1617957038"
  >
    <ThinTitleBox color="#fff">
      {title} <br />
      <ThinDescriptionBox color="#fff">{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SpringForwardThinHeader = ({
  bg = '#44a1bb',
  title = 'Spring Forward',
  description = 'Blooming with freshly picked manis.',
  ...rest
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-spring-forward-mobile.jpg?v=1616093815"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-spring-forward-desktop.jpg?v=1616093815"
    {...rest}
  >
    <ThinTitleBox width="40%" color="#fff">
      {title} <br />
      <ThinDescriptionBox color="#fff">{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const XOCapsuleThinHeader = ({
  bg = '#e2aca7',
  title = 'XO Capsule',
  description = 'Love comes in mani forms.',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-xo-capsule-mobile.jpg?v=1611562384"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-xo-capsule-desktop.jpg?v=1611562383"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const RemixThinHeader = ({
  bg = '#adc2c3',
  title = '',
  description = 'Our favorite manis, remixed.',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/desgin-thin-remix-mobile.jpg?v=1610546766"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-remix-desktop.jpg?v=1610546766"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const XFashionThinHeader = ({ bg = '#e9d6cf', title = '', description = 'Description' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-xfashion-mobile.jpg?v=1604582476"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-xfashion-desktop.jpg?v=1604582476"
  >
    <ThinTitleBox width="40%">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const CreepyThinHeader = ({ bg = '#181818', title = '', description = 'Description' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-creepy-capsule-mobile.jpg?v=1602686897"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-creepy-capsule-desktop.jpg?v=1602686897"
  >
    <ThinTitleBox width="40%" color="forecolor.4">
      {title} <br />
      <ThinDescriptionBox color="forecolor.4">{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const BYNThinHeader = ({
  bg = '#d29d7e',
  title = '',
  description = 'Description',
  ...rest
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-byn-mobile.jpg?v=1599922174"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-byn-desktop1.jpg?v=1600714227"
    {...rest}
  >
    <ThinTitleBox width="40%">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const CareCollectionThinHeader = ({
  bg = '#f5ddcb',
  title = '',
  description = 'Description',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-care-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-care.jpg"
  >
    <ThinTitleBox width="60%">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const DreamyEscapeThinHeader = ({
  bg = '#f8edf5',
  title = '',
  description = 'Description',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-dreamy-mobile.jpg?v=1595439933"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-dreamy.jpg?v=1595439933"
  >
    {/* mobileURL='https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-dreamy-mobile.jpg'
    desktopURL='https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-dreamy.jpg' */}
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const ButterflyThinHeader = ({
  bg = '#e1e1df',
  title = '',
  description = 'Description',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-butterfly-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-bufferfly.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const MPHandThinHeader = ({
  bg = '#ebeae6',
  title = '',
  description = 'Designs by @mpnails',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-mp100.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-mp100.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const PedisBannerThinHeader = ({ bg = '#d5f1fc', title = '', description = '' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/pedi-banner-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/pedi-banner-desktop.jpg"
  >
    <ThinTitleBox width="50%">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SolidThinHeader = ({
  bg = '#ebeae6',
  title = '',
  description = 'Designs by @mpnails',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-solid-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-solid-desktop.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SolidPedisThinHeader = ({ bg = '#ecf1fc', title = '', description = '' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/solid-pedi-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/solid-pedi-desktop.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const Signature0721ThinHeader = ({
  bg = '#ebeae6',
  title = '',
  description = 'Designs by @mpnails',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/web/design-thin-signature-v2-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-signature-v2-desktop.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SignatureThinHeader = ({
  bg = '#ebeae6',
  title = '',
  description = 'Designs by @mpnails',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-signature-v2-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-signature-v2-desktop.jpg"
  >
    <ThinTitleBox>
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const EssentialsThinHeader = ({
  bg = '#f1efe2',
  title = '',
  description = 'Designs by @mpnails',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://d1b527uqd0dzcu.cloudfront.net/mobile/design-thin-essentials-mobile.jpg"
    desktopURL="https://d1b527uqd0dzcu.cloudfront.net/web/design/design-thin-essentials.jpg"
  >
    <ThinTitleBox maxWidth="160px">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const GlowUpThinHeader = ({ bg = '#f1eacd', title = '', description = '' }) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-glow-up-mobile-v2.jpg?v=1607066076"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-glow-up-desktop-v2.jpg?v=1607066076"
  >
    <ThinTitleBox width="50%" maxWidth="180px">
      {title} <br />
      <ThinDescriptionBox>
        {description || (
          <>
            Break up with 2020 - <br />
            Have a fling with these manis.
          </>
        )}
      </ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const BHMThinHeader = ({
  bg = '#1c2524',
  title = '',
  description = 'Honor the Black community with looks designed exclusively by Black nail artists.',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-bhm-mobile.jpg?v=1613118284"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-bhm-desktop.jpg?v=1613118284"
  >
    <ThinTitleBox width="50%" maxWidth="184px" color="#fff">
      {title} <br />
      <ThinDescriptionBox color="#fff">{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);

export const SignatureCapsuleThinHeader = ({
  bg = '#f9f3f3',
  title = 'Signature Capsule',
  description = 'Freshen up with naturally inspired looks.',
}) => (
  <ThinBannerBox
    bg={bg}
    mobileURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-signature-capsule-mobile.jpg?v=1615133386"
    desktopURL="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/design-thin-signature-capsule-desktop.jpg?v=1615133387"
  >
    <ThinTitleBox width="50%" maxWidth="184px">
      {title} <br />
      <ThinDescriptionBox>{description}</ThinDescriptionBox>
    </ThinTitleBox>
  </ThinBannerBox>
);
