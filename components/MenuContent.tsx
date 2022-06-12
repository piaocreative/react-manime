import style from '@styles/menu/menu-content.module.css';
import { SET_CART_SIDEBAR, SET_MENU_SIDEBAR } from 'actions';
import AccountIcon from 'components/icons/AccountIcon';
import GiftIcon from 'components/icons/GiftIcon';
import ManiBagIcon from 'components/icons/ManiBagIcon';
import Box from 'components/styled/Box';
import { Img } from 'components/styled/StyledComponents';
import constants from 'constants/index';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { KeyValue } from 'types';
import { getProductCounts } from 'utils/cartUtils';
import { pageLinks } from 'utils/links';

const Container = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
  overflow-y: auto;
  min-height: calc(var(--vh, 1vh) * 100);
  font-family: 'avenirBook';
  text-transform: uppercase;
`;

const Line = styled(Box)`
  width: 100%;
  height: 2px;
  background-color: #474746;
  opacity: ${props => props.opacity || 0.08};
`;

const MenuBox = styled(Box)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 14px;
  font-family: ${props => (props.fontFamily ? props.fontFamily : props.isOpened && 'avenirBlack')};
  letter-spacing: 2px;
  margin-bottom: ${props => (props.isOpened ? '8px' : props.mb ? props.mb : '0px')};
  & span {
    font-family: ${props =>
      props.fontFamily ? props.fontFamily : props.isOpened && 'avenirBlack'};
  }
`;

const MenuList = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  letter-spacing: 2px;
  border-left: 2px solid #f7bfa0;
  padding-left: 20px;
`;

const SubMenuList = styled(MenuList)`
  border-left: none;
  padding-left: 16px;
`;

const ActionButton = styled(Box)`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: #fff;
  letter-spacing: 2px;
  font-size: 14px;
  text-transform: uppercase;
`;

const InviteButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: #f5ded1;
  letter-spacing: 2px;
  font-size: 14px;
  padding-left: 29px;
  border: none;
  outline: none;
  text-transform: uppercase;
  & > div {
    letter-spacing: 1px;
  }
`;

const CenterBox = styled(Box)`
  position: absolute;
  transform: translate(-50%, 0);
  left: calc(50% + 10px);
  white-space: nowrap;
`;

const ArrowImg = styled(Img)`
  transform: ${props => props.isOpened && 'rotate(180deg)'};
`;

const QuantityBox = styled(Box)`
  position: absolute;
  top: 12px;
  left: 12px;
  letter-spacing: 0px;
  transform: translate(-50%, 0);
  font-size: 13px;
  color: #f7bfa0;
`;

const CloseBox = styled(Box)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 28px;
`;

const MenuItemTag = styled(Box)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.mb || '0px'};
  font-family: ${props => props.bold && 'avenirHeavy'};
`;

const Span = styled.span`
  text-align: center;
  font-size: 16px;
  width: 14px;
`;

const NewBadge = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 32px;
  height: 14px;
  font-size: 8px;
  font-family: 'avenirHeavy';
  color: #f7bfa0;
  margin-left: 8px;
  margin-right: auto;
  text-transform: uppercase;
`;

const theme = { collapse: style.collapse, content: style.content };
const subTheme = { collapse: style.collapse };
const arrowImg = '/static/icons/arrow-down.svg';

interface GenericObject {
  [key: string]: any;
}

interface ShopMenuItem {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Environment?: string;
    Menu?: string;
    Section?: string;
    'Section Name'?: string;
    'Menu Name'?: string;
    Type?: string;
    Link?: string;
    Tag?: string;
    Active?: boolean;
    'Start Date'?: string;
    'End Date'?: string;
    'Left Image Link'?: string;
    'Right Image'?: Array<any>;
    'Right Video URL'?: string;
    Style?: string;
    Color?: string;
    'Background Color'?: string;
  };
}

const newBadge = <NewBadge>new</NewBadge>;

const ButtonGroupBox = styled(Box)`
  display: grid;
  grid-gap: 24px;
  margin-top: auto;
`;

const MenuItem = ({
  href = undefined,
  mb = undefined,
  children = undefined,
  mainCartData = undefined,
  textTransform = undefined,
  isPreview = false,
  ...rest
}) => {
  let hrefAlt;
  if (!href) {
    const router = useRouter();
    if (Object.entries(router.query).length > 0) {
      hrefAlt = { pathname: router?.pathname, query: router.query };
    }
  }
  return (
    <Link href={href || hrefAlt || ''} prefetch={false}>
      <a
        style={{ marginBottom: mb || '18px', textTransform }}
        data-testid={isPreview ? 'preview-menu-list-link' : 'menu-list-link'}
      >
        <MenuItemTag {...rest}>{children}</MenuItemTag>
      </a>
    </Link>
  );
};

const isInEnvironment = environment => row => row?.fields?.Environment === environment;
const isInMenu = menuName => row => row?.fields?.['Menu Name']?.includes(menuName);
const isInSection = sectionId => row => row?.fields?.Section?.includes(sectionId);
const isType = menuType => row => row?.fields?.Type === menuType;
const hasName = name => row => row?.fields?.Name === name;
const isPreview = row => row?.fields?.Preview === 1;

const MenuContent = ({
  dispatchSetMenuSideBar,
  dispatchSetCartSideBar,
  userData,
  mainCartData,
  globalProps,
}) => {
  const [isByDesignerOpened, setIsByDesignerOpened] = useState(false);
  const [isByCollectionOpened, setIsByCollectionOpened] = useState(false);
  const [isShopByOpened, setIsShopByOpened] = useState(false);
  const [isHowToOpened, setIsHowToOpened] = useState(false);
  const [isLearnOpened, setIsLearnOpened] = useState(false);

  // console.log({ globalProps });
  const menuInfo = JSON.parse(globalProps?.menuInfo || '[]');
  const mobileMenuItems = menuInfo.filter(isInEnvironment('Mobile'));
  const shopAllMenuInfo = mobileMenuItems.filter(hasName('Shop All'))?.[0];
  const shopAllItems = mobileMenuItems.filter(isInMenu('Shop All')).filter(isType('Item'));
  const browseBySections = mobileMenuItems.filter(isInMenu('Browse By')).filter(isType('Section'));
  const byDesignerSectionInfo = browseBySections.filter(
    item => item?.fields?.Name === 'By Designer'
  )?.[0];
  const designerItems = mobileMenuItems
    .filter(isInSection(byDesignerSectionInfo?.id))
    .filter(isType('Item'));

  const signInHandler = () => {
    const currentPage = Router?.asPath || '//';

    if (currentPage.indexOf(pageLinks.Auth.url) > -1) {
      Router.push(pageLinks.Auth.url);
    }
    let query = { currentPage };

    Router.push({
      pathname: pageLinks.Auth.url,
      query,
    });

    closeHandler();
  };

  const closeHandler = () => dispatchSetMenuSideBar(false);
  const toggleCollectionHandler = () => setIsByCollectionOpened(opened => !opened);
  const toggleDesignHandler = () => setIsByDesignerOpened(opened => !opened);
  const toggleHowToHandler = () => setIsHowToOpened(opened => !opened);
  const toggleLearnHandler = () => setIsLearnOpened(opened => !opened);
  const toggleShopByHandler = () => setIsShopByOpened(opened => !opened);

  const openCartHandler = () => {
    dispatchSetCartSideBar(true);
    closeHandler();
  };

  const openFriendHandler = () => {
    Router.push(pageLinks.Profile.Friends.url);
    closeHandler();
  };

  const quantity = useMemo(() => getProductCounts(mainCartData?.cart), [userData, mainCartData]);

  const shopAllMenuItems = shopAllItems.map(item => {
    return {
      url: item?.fields?.Link,
      label: item?.fields?.Name,
      isNew: item?.fields?.Tag?.toLowerCase() === 'new',
      color: item?.fields?.Color,
      backgroundColor: item?.fields?.BackgroundColor,
    };
  });

  return (
    <Container px="30px" py="44px">
      <CloseBox onClick={closeHandler}>
        <img src="/static/icons/close-dark-icon.svg" />
      </CloseBox>
      <Link href={pageLinks.SetupDesign.url}>
        <a>
          <MenuBox onClick={closeHandler} fontFamily="avenirBlack">
            <span onClick={closeHandler}>Shop All</span>
          </MenuBox>
        </a>
      </Link>
      {shopAllMenuItems?.map((item, index) => (
        <Link href={item.url} key={item.label}>
          <a>
            <MenuBox onClick={closeHandler}>
              <Box
                display="flex"
                alignItems="center"
                style={{
                  color: item.color,
                  backgroundColor: isPreview(item) ? '#ddf' : item.backgroundColor,
                  border: isPreview(item) && '1px dotted #007',
                }}
              >
                {item.label} {isPreview(item) && 'PREVIEW'}
                {item.isNew && newBadge}
              </Box>
            </MenuBox>
          </a>
        </Link>
      ))}
      <Line my={2} />

      <MenuBox mb={isShopByOpened && '8px'} onClick={toggleShopByHandler} isOpened={isShopByOpened}>
        Browse By
        <ArrowImg src={arrowImg} isOpened={isShopByOpened} alt="arrow" />
      </MenuBox>
      <Collapse isOpened={isShopByOpened} theme={theme}>
        <MenuList data-testid="menu-list">
          <MenuItem href={pageLinks.SetupManiDesign.url} onClick={closeHandler}>
            {pageLinks.SetupManiDesign.label}
          </MenuItem>
          <MenuItem href={pageLinks.SetupPediDesign.url} onClick={closeHandler}>
            {pageLinks.SetupPediDesign.label}
          </MenuItem>
          <MenuItem onClick={toggleDesignHandler}>
            Designer <Span>{isByDesignerOpened ? '−' : '+'}</Span>
          </MenuItem>
          <Collapse isOpened={isByDesignerOpened} theme={subTheme}>
            <SubMenuList>
              {designerItems.map(item => (
                <MenuItem
                  key={item?.id}
                  href={item?.fields?.Link}
                  onClick={closeHandler}
                  textTransform="none"
                  isPreview={isPreview(item)}
                  style={{
                    backgroundColor: isPreview(item) ? '#ddf' : item.backgroundColor,
                    border: isPreview(item) && '1px dotted #007',
                  }}
                >
                  {item?.fields?.Name}
                  {item?.fields?.Tag?.toLowerCase() === 'new' && newBadge}
                </MenuItem>
              ))}
            </SubMenuList>
          </Collapse>
          <MenuItem href={pageLinks.ShopBundles.url} onClick={closeHandler}>
            {pageLinks.ShopBundles.label}
          </MenuItem>
          <MenuItem mb="0px" href={pageLinks.ShopArchive.url} onClick={closeHandler}>
            {pageLinks.ShopArchive.label}
          </MenuItem>
        </MenuList>
      </Collapse>

      <Link href={pageLinks.Gift.url}>
        <a>
          <MenuBox onClick={closeHandler}>
            <Box display="flex" alignItems="center">
              <GiftIcon style={{ marginBottom: 6 }} /> &nbsp; GIFT
            </Box>
          </MenuBox>
        </a>
      </Link>
      <MenuBox onClick={toggleHowToHandler} isOpened={isHowToOpened}>
        How To
        <ArrowImg src={arrowImg} isOpened={isHowToOpened} alt="arrow" />
      </MenuBox>
      <Collapse isOpened={isHowToOpened} theme={theme}>
        <MenuList>
          <MenuItem href={pageLinks.HowToApply.url} onClick={closeHandler}>
            {pageLinks.HowToApply.label}
          </MenuItem>
          <MenuItem mb={'0px'} href={pageLinks.HowItWorks.url} onClick={closeHandler}>
            {pageLinks.HowItWorks.label}
          </MenuItem>
        </MenuList>
      </Collapse>
      <MenuBox onClick={toggleLearnHandler} isOpened={isLearnOpened} mb="12px">
        About
        <ArrowImg src={arrowImg} isOpened={isLearnOpened} alt="arrow" />
      </MenuBox>
      <Collapse isOpened={isLearnOpened} theme={theme}>
        <MenuList>
          <MenuItem href={pageLinks.AboutUs.url} onClick={closeHandler}>
            {pageLinks.AboutUs.label}
          </MenuItem>
          <MenuItem href={pageLinks.Blog.url} onClick={closeHandler}>
            {pageLinks.Blog.label}
          </MenuItem>
          <MenuItem mb={'0px'} href={pageLinks.Faq.url} onClick={closeHandler}>
            {pageLinks.Faq.label}
          </MenuItem>
        </MenuList>
      </Collapse>

      <ButtonGroupBox>
        {userData.isAuth ? (
          <Link href={pageLinks.Profile.Account.url}>
            <a className={style.firstButton}>
              <ActionButton pl="32px" onClick={closeHandler}>
                <AccountIcon />
                <CenterBox>Account</CenterBox>
              </ActionButton>
            </a>
          </Link>
        ) : (
          <ActionButton passedClass={style.firstButton} pl="32px" onClick={signInHandler}>
            <AccountIcon />
            <CenterBox>Sign In</CenterBox>
          </ActionButton>
        )}
        <ActionButton pl="29px" onClick={openCartHandler}>
          <span style={{ position: 'relative' }}>
            <ManiBagIcon />
            <QuantityBox>{quantity}</QuantityBox>
          </span>
          <CenterBox>Mani Bag</CenterBox>
        </ActionButton>
        <InviteButton onClick={openFriendHandler}>
          <img
            src="/static/icons/dollar-bubble-transparent.svg"
            className={style.inviteIcon}
            alt="invite"
          />
          <CenterBox letterSpacing="0px">
            Get ${constants.referral.NORMAL_REFERRER_CREDIT}, Give $
            {constants.referral.NORMAL_REFERREE_CREDIT}
          </CenterBox>
        </InviteButton>
      </ButtonGroupBox>
    </Container>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
  mainCartData: state.mainCartData,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetMenuSideBar: isOpen => dispatch(SET_MENU_SIDEBAR(isOpen)),
  dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuContent);
