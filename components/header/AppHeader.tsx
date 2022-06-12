import { Auth } from '@aws-amplify/auth';
import { SET_CART_SIDEBAR, SET_MENU_SIDEBAR, UI_SET_KEY_VALUE } from 'actions';
import BagLogo from 'components/BagLogo';
import PromotionBars from 'components/header/PromotionBars';
import GiftIcon from 'components/icons/GiftIcon';
import MenuIcon from 'components/icons/MenuIcon';
import Box from 'components/styled/Box';
import { Img } from 'components/styled/StyledComponents';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { checkManiBag } from 'utils/cartUtils';
import { imageLinks, pageLinks } from 'utils/links';
import log from 'utils/logging';
import css from '../../static/header.module.css';
import {
  AccountButton,
  CheckoutHeader,
  CustomNavItem,
  CustomNavItemWithoutMenu,
  DesktopView,
  GiftBox,
  Logo,
  MenuToggler,
  MobileView,
  NavbarBrand,
  OnlyLogoHeader,
  ShopBox,
  SignInButton,
  TopNavbar,
} from './Common';

const MENULIST = ['Shop', 'Gift', 'How To', 'About'];

const SpaceBox = styled(Box)`
  transition: all 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  -webkit-transition-delay: 0.3s;
`;

function AppHeader(props) {
  const onClick = (ev, authPage) => {
    ev.preventDefault();
    const currentPage = Router?.asPath || '//';

    if (currentPage.indexOf(pageLinks.Auth.url) > -1) {
      return;
    }

    Auth.currentAuthenticatedUser()
      .then(result => {
        log.info(result);
        let pathName;

        if (!props.userData || props.userData.identityId == '') {
          Auth.signOut().finally(() => {
            props.dispatchResetUserData();
          });
          Router.push({
            pathname: pageLinks.Auth.url,
            query: { currentPage },
          });
        } else if (checkValidFitStatus()) {
          pathName = pageLinks.SetupDesign.url;
          Router.push({
            pathname: pathName,
          });
        } else {
          pathName = pageLinks.GuidedFitting.url;
          Router.push({
            pathname: pathName,
          });
        }
      })
      .catch(err => {
        let query = { currentPage };

        Router.push({
          pathname: pageLinks.Auth.url,
          query,
        });
      });
  };

  const checkValidFitStatus = () => {
    const { statusLeftFingers, statusLeftThumb, statusRightFingers, statusRightThumb, statusSide } =
      props.userData;
    if (
      statusLeftFingers &&
      statusLeftThumb &&
      statusRightFingers &&
      statusRightThumb &&
      statusSide
    )
      return true;
    return false;
  };

  const toggle = () => {
    const { isMenuOpen } = props.uiData;
    props.dispatchSetMenuSideBar(!isMenuOpen);
  };

  const openBagHandler = () => {
    const { isCartOpen } = props.uiData;
    if (isCartOpen) {
      props.dispatchSetCartSideBar(false);
      return;
    }
    props.dispatchSetCartSideBar(true);
  };

  const { pathname, mainCartData, clickMenuHandler, showFooterHeader, hideHeader } = props;

  const {
    primaryPromotionHeight,
    secondaryPromotionHeight,
    selectedMenu,
    closePromotionHandler,
    closeSecondaryPromotionHandler,
    altHeader,
  } = props;
  const isAuth = typeof window !== 'undefined' ? (props.userData || {}).isAuth || false : false;

  const checkout = mainCartData?.cart;

  const { countOfProducts: quantity } = checkManiBag(checkout, props?.userData?.totalOrders);

  const header = (
    <>
      <TopNavbar
        id="header"
        color="white"
        light
        expand="md"
        mt={`${primaryPromotionHeight + secondaryPromotionHeight}px`}
      >
        {!hideHeader && (
          <NavbarBrand style={{ flexGrow: 1 }}>
            <Link href="/">
              <a>
                <Logo
                  height={['20px', '20px', '26px']}
                  ml={['4px', '10px']}
                  src={imageLinks.Logo.url}
                  alt="ManiMe Logo"
                />
              </a>
            </Link>
          </NavbarBrand>
        )}

        {showFooterHeader && (
          <>
            <MobileView>
              <Link href={pageLinks.SetupDesign.url}>
                <a>
                  <ShopBox>{pageLinks.SetupDesign.label}</ShopBox>
                </a>
              </Link>
              <Box alignItems="center" justifyContent="center" onClick={openBagHandler}>
                <BagLogo quantity={quantity} mr="12px" location="header-mobile" />
              </Box>
              <MenuToggler onClick={toggle}>
                <MenuIcon />
              </MenuToggler>
            </MobileView>

            <DesktopView>
              <Link href={pageLinks.SetupDesign.url}>
                <a data-testid={`${pageLinks.SetupDesign.label}-link`}>
                  <CustomNavItem
                    mx={2}
                    onMouseEnter={clickMenuHandler(MENULIST[0])}
                    isSelected={selectedMenu === MENULIST[0]}
                  >
                    <Box
                      className={css.navBarSectionLink}
                      fontSize={'14px'}
                      textAlign="center"
                      pt="2px"
                    >
                      {pageLinks.SetupDesign.label}
                    </Box>
                  </CustomNavItem>
                </a>
              </Link>
              <CustomNavItemWithoutMenu mx={2} isSelected={selectedMenu === MENULIST[1]}>
                <Link href={pageLinks.Gift.url}>
                  <a>
                    <GiftBox
                      className={css.navBarSectionLink}
                      onMouseEnter={clickMenuHandler(MENULIST[1])}
                      onMouseLeave={clickMenuHandler('')}
                    >
                      <GiftIcon style={{ marginBottom: 8 }} />
                      &nbsp;{pageLinks.Gift.label}
                    </GiftBox>
                  </a>
                </Link>
                <Box width="100%" position="absolute" bottom={'-4px'} height="18px" />
              </CustomNavItemWithoutMenu>
              <Link href={pageLinks.HowToApply.url}>
                <a>
                  <CustomNavItem
                    mx={2}
                    onMouseEnter={clickMenuHandler(MENULIST[2])}
                    isSelected={selectedMenu === MENULIST[2]}
                  >
                    <Box
                      className={css.navBarSectionLink}
                      position="relative"
                      fontSize={'14px'}
                      textAlign="center"
                      display="flex"
                      justifyContent="center"
                    >
                      <Box position="relative" pt="2px" letterSpacing="1px">
                        How To
                      </Box>
                    </Box>
                  </CustomNavItem>
                </a>
              </Link>
              <CustomNavItem
                mx={2}
                onMouseEnter={clickMenuHandler(MENULIST[3])}
                isSelected={selectedMenu === MENULIST[3]}
              >
                <Box
                  color="#2c4349"
                  className={css.navBarSectionLink}
                  position="relative"
                  fontSize={'14px'}
                  textAlign="center"
                  display="flex"
                  justifyContent="center"
                >
                  <Box position="relative" pt="2px">
                    About
                  </Box>
                </Box>
              </CustomNavItem>

              <CustomNavItem onMouseEnter={clickMenuHandler('')}>
                {!isAuth ? (
                  <SignInButton data-testid="signin-button" onClick={onClick}>
                    Sign In
                  </SignInButton>
                ) : (
                  <Link href={pageLinks.Profile.Account.url}>
                    <a>
                      <AccountButton data-testid="account-button">
                        <Img
                          src={imageLinks.User.url}
                          style={{
                            width: 'auto',
                            height: '20px',
                            marginRight: '12px',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        />
                        <Box
                          mr="6px"
                          letterSpacing="1px"
                          fontSize={['14px', '14px']}
                          color="#2c4349"
                        >
                          ACCOUNT
                        </Box>
                      </AccountButton>
                    </a>
                  </Link>
                )}
              </CustomNavItem>
              <CustomNavItem>
                <Box
                  mr="-16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={openBagHandler}
                  data-testid="manibag-toggle"
                >
                  <BagLogo quantity={quantity} location="header-desktop" />
                </Box>
              </CustomNavItem>
            </DesktopView>
          </>
        )}
        {pathname === pageLinks.Checkout.url && (
          <CheckoutHeader>{pageLinks.Checkout.label}</CheckoutHeader>
        )}
      </TopNavbar>
    </>
  );

  const headerWithPromotionBar =
    !hideHeader || altHeader ? (
      <>
        <PromotionBars
          globalProps={props.globalProps}
          primaryPromotionHeight={primaryPromotionHeight}
          closePromotionHandler={closePromotionHandler}
          secondaryPromotionHeight={secondaryPromotionHeight}
          closeSecondaryPromotionHandler={closeSecondaryPromotionHandler}
        />
        {header}
      </>
    ) : null;

  const flowName = ((props || {}).uiData || {}).flowName || '';
  const mainHeader = (
    <>
      {flowName == 'events' ? hideHeader ? null : <OnlyLogoHeader /> : headerWithPromotionBar}

      <SpaceBox
        height={
          primaryPromotionHeight + secondaryPromotionHeight > 0 && !hideHeader
            ? `${primaryPromotionHeight + secondaryPromotionHeight}px`
            : '0px'
        }
      />
    </>
  );

  return <>{mainHeader}</>;
}

const mapStateToProps = state => ({
  userData: state.userData,
  uiData: state.uiData,
  mainCartData: state.mainCartData,
  groupGiftData: state.groupGiftData,
});

const mapDispatchToProps = dispatch => ({
  dispatchResetUserData: () => dispatch({ type: 'RESET_USER_DATA' }),
  dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
  dispatchSetMenuSideBar: isOpen => dispatch(SET_MENU_SIDEBAR(isOpen)),
  dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
