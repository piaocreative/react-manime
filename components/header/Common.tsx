import React from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';
import { StandardOutlinedButton, Img } from '../styled/StyledComponents';
import { pageLinks, imageLinks } from '../../utils/links';
import Link from 'next/link'


const NoMarginPages = [
  pageLinks.Home.url,
  pageLinks.Auth.url,
  pageLinks.SetupDesign.url,
  pageLinks.SetupManiDesign.url,
  pageLinks.SetupPediDesign.url,
  pageLinks.ShopEssentials.url,
  pageLinks.NewProduct.url,
  pageLinks.ShopLastChance.url,
  pageLinks.ShopBundles.url,
  pageLinks.ShopArchive.url,
  pageLinks.FlashSale.url,
  pageLinks.Gift.url,
  pageLinks.GiftBundle.url,
  pageLinks.BuilderRoot.url,
  pageLinks.GuidedFitting.url,
  pageLinks.HowToApply.url,

];

function pageHasNoMargins(path:string){
  let noMargin = !!path.match(/collection/) || 
    !!path.match(/designer/) ||
    !!path.match(/profile/) ||
    !!path.match(/group/) ||
    !!path.match(/shop/) ||
    !!path.match(/telfar/) ||
    !!path.match(/subscription/)

  if(noMargin){
    return true;
  }
  else {
    return NoMarginPages.includes(path)
  }
}
export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`;

export const ContentBox = styled(Box)`
  margin-left: ${props => pageHasNoMargins(props.pathname) ? 0: '16px'};
  margin-right: ${props => pageHasNoMargins(props.pathname) ? 0: '16px'};
  @media (min-width: 768px) {
    margin-left: 70px;
    margin-right: 70px;
  }
`;

export const GiftBox = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 14px;
  text-align: center;
  padding-top: 3px;
  height: 70px;
`;

export const NavbarBrand = styled(Box)`
  display: flex;
`;

export const Logo = styled(Img)`
  width: auto;
  cursor: pointer;
  user-select: none;
`;

export const TopNavbar = styled(Box)`
  z-index: 100;
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background: white;
  padding-left: 16px;
  padding-right: 16px;
  transition: margin-top .3s ease-in-out,-webkit-transform .3s ease-in-out;
  -webkit-transition-delay: .3s;
  @media (min-width: 480px) {
    height: 70px;
  }
  @media (min-width: 768px) {
    height: 70px;
    padding-left: 70px;
    padding-right: 70px;
  }
`;

export const CustomNavItem = styled.div`
  height: 100%;
  margin-left: 16px;
  margin-right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-top: 3px solid transparent;
  border-bottom: ${props => props.isSelected ? '3px solid #F7BFA0': '3px solid transparent'};
  padding: 0 2px;
  text-transform: uppercase;
  @media (max-width: 767px) {
    margin: 10px 0px;
    display: block;
  }

  & div {
    font-family: 'avenirMedium';
  }
`;

export const CustomNavItemWithoutMenu = styled(CustomNavItem)`
  position: relative;
  border-top: 4px solid transparent;
  border-bottom: ${props => props.isSelected ? '4px solid #F7BFA0': '4px solid transparent'};
`;

export const MobileView = styled(Box)`
  display: flex;
  align-items: center;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const DesktopView = styled(Box)`
  display: none;
  background: #fff;
  height: 100%;
  @media (min-width: 768px) {
    display: flex;
  }
`;

export const MenuToggler = styled(Box)`
  cursor: pointer;
  display: flex;
  // @media (min-width: 768px) {
  //   display: none;
  // }
`;

export const CustomLink = styled.a`
  &:hover {
    text-decoration: none;
  }
`;

export const CheckoutHeader = styled(Box)`
  position: absolute;
  transform: translate(-50%, 0%);
  left: 50%;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const BagBox = styled(Box)`
  display: flex;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const ShopBox = styled(Box)`
  display: flex;
  font-size: 19px;
  margin-right: 16px;
  padding-top: 2px;
  cursor: pointer;
  text-transform: uppercase;
  // @media (min-width: 768px) {
  //   display: none;
  // }
`;

export const NavBackBox = styled(Box)`
  background: white;
  position: absolute;
  opacity: 0.5;
  z-index: 100;
  width: 100vw;
  height: 100%;
`;

export const SubHeaderBar = styled(Box)`
  background: #F8F1ED;
  position: fixed;
  z-index: 100;
  height: 58px;
  width: calc(100% - 140px);
  transition: ease-out 0.3s;
  justify-content: center;
  align-items: center;
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
`;

export const SubHeaderDarkOverlay = styled(Box)`
  display: none;
  margin-top: 70px;
  position: fixed;
  width: 100%;
  height: 100vh;
  background: #2C4349;
  opacity: 0.8;
  z-index: 100;
  @media (min-width: 768px) {
    display: block;
  }
`;

export const SignInButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  letter-spacing: 2px;
  border: 1px solid;
  border-color: #F4DED1;
  background: #F4DED1;
  color: #2C4349;
  padding: 2px 20px 0;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  text-transform: uppercase;
  &:hover {
    background: #F4ECE7;
    border-color: #F4ECE7;
  }
`;

export const AccountButton = styled(StandardOutlinedButton)`
  margin-top: 1px;
  border: 1px solid #474746;
  width: 160px;
  height: 32px;
  font-size: 14px;
  text-transform: uppercase;
`;


export const OnlyLogoHeader = () => (
  <TopNavbar id='header' color='white' light expand='md'>
    <NavbarBrand style={{flexGrow: 1}}>
      <Link href={pageLinks.GuidedFitting.url}>
        <Logo
          height={['20px', '20px', '26px']}
          ml={['4px', '10px']}
          // mb={['4px', 0]}
          src={imageLinks.Logo.url} />
      </Link>
    </NavbarBrand>
  </TopNavbar>
);
