import AppFooter from 'components/AppFooter';
import CartSideBar from 'components/CartSideBar';
import AppHeader from 'components/header/AppHeader';
import { Container, ContentBox } from 'components/header/Common';
import HowToMenu from 'components/menu/HowToMenu';
import LearnMenu from 'components/menu/LearnMenu';
import ShopMenu from 'components/menu/ShopMenu';
// import { trackFunnelActionProjectFunnel } from '../utils/track';
import MenuSideBar from 'components/MenuSideBar';
import Box from 'components/styled/Box';
import dynamic from 'next/dynamic';
import Router, { withRouter } from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { bannedFooterPages, bannedHeaderPages, pageLinks } from 'utils/links';
import { scrollToTop } from 'utils/scroll';
import { theme } from 'utils/theme';
import youtubeLinks from 'utils/youtubeLinks';
import { UI_SET_KEY_VALUE } from '../actions';

const VideoDialog = dynamic(() => import('./video-dialog/VideoDialog'));
const JoinWaitListPopup = dynamic(() =>
  import('./design/popup/JoinWaitListPopup/JoinWaitListPopup')
);

const MENULIST = ['Shop', 'Gift', 'How To', 'About'];

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

class AppWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      // Refactor below into layer component
      uploadImageName: '',
      toggleCart: false,
      primaryPromotionHeight: props.globalProps?.promoBarList?.length > 0 ? 30 : -1,
      secondaryPromotionHeight: props.globalProps?.promoBarList?.length > 0 ? 30 : -1,
      activeVariant: '',
      showLeapDayModal: false,
      selectedMenu: '',
      hideTopBarPage: false,
      stepDirection: VERTICAL,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async componentDidMount() {
    const hideTopBarPage = this.checkHideTopBarPage(window.location.pathname);
    this.props.dispatchSetUIKeyValue('isVideoDialogOpen', false);
    this.setState({ hideTopBarPage });
    // trackFunnelActionProjectFunnel('X - refreshed page');

    this.updateWindowDimensions();
    this.updateUrlHandler(window.location.pathname);

    this.prevScrollY = window.scrollY;
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('scroll', this.scrollHandler);

    Router.events.on('routeChangeComplete', url => {
      this.updateUrlHandler(url);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('scroll', this.scrollHandler);
  }

  updateUrlHandler = url => {
    if (![pageLinks.SetupDesign.url, pageLinks.Home.url].includes(url)) {
      scrollToTop();
    }
    if (this.checkHideTopBarPage(url)) {
      this.setState({
        primaryPromotionHeight: 0,
        secondaryPromotionHeight: 0,
      });
    }
  };

  updateWindowDimensions() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      this.setState({
        stepDirection: VERTICAL,
      });
    } else {
      this.setState({
        stepDirection: HORIZONTAL,
      });
    }
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  checkHideTopBarPage = url => {
    if (
      url.includes(pageLinks.Checkout.url) ||
      url.includes(pageLinks.ManiFitting.url) ||
      url.includes(pageLinks.PediFitting.url) ||
      url.includes(pageLinks.GroupGift.url) ||
      url.includes(pageLinks.GuidedFitting.url) ||
      url.includes(pageLinks.Refit.url)
    ) {
      return true;
    }
  };

  scrollHandler = event => {
    if (!document.getElementById('header')) return;
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      document.getElementById('header').style.boxShadow = 'rgba(0, 0, 0, 0.15) 0px 1px 3px 0px';
    } else {
      document.getElementById('header').style.boxShadow = 'none';
    }

    const window = event.currentTarget;
    if (this.state.primaryPromotionHeight >= 0) {
      if (this.prevScrollY > window.scrollY + 20) {
        if (!this.state.hideTopBarPage) {
          this.setState({ primaryPromotionHeight: 30 });
        }
      } else if (this.prevScrollY + 20 < window.scrollY) {
        this.setState({ primaryPromotionHeight: 0 });
      }
    }

    if (this.state.secondaryPromotionHeight >= 0) {
      if (this.prevScrollY > window.scrollY + 20) {
        if (!this.state.hideTopBarPage) {
          this.setState({ secondaryPromotionHeight: 30 });
        }
      } else if (this.prevScrollY + 20 < window.scrollY) {
        this.setState({ secondaryPromotionHeight: 0 });
      }
    }
    this.prevScrollY = window.scrollY;
  };

  clickMenuHandler = name => () => {
    this.setState({ selectedMenu: name });
  };

  closePromotionHandler = () => {
    this.setState({ primaryPromotionHeight: -1 });
  };

  closeSecondaryPromotionHandler = () => {
    this.setState({ secondaryPromotionHeight: -1 });
  };

  closeDialogHandler = () => {
    this.props.dispatchSetUIKeyValue('isVideoDialogOpen', false);
  };

  closeJoinWaitList = () => {
    this.props.dispatchSetUIKeyValue('joinWaitList', { productId: '', open: false });
  };

  render() {
    const { uiData } = this.props;
    const pathname = this.props.router.pathname;
    const fullpath = this.props.router.asPath;
    const {
      selectedMenu,
      hideTopBarPage,
      stepDirection,
      primaryPromotionHeight,
      secondaryPromotionHeight,
    } = this.state;
    const openJoinWaitList = ((uiData || {}).joinWaitList || {}).open;
    const productIdJoinWaitList = ((uiData || {}).joinWaitList || {}).productId || '';
    const product = ((uiData || {}).joinWaitList || {}).product || undefined;
    const hideHeader =
      ([pageLinks.ManiFitting.url, pageLinks.PediFitting.url, pageLinks.GuidedFitting.url].includes(
        pathname
      ) &&
        stepDirection === VERTICAL) ||
      [pageLinks.GroupGift.url, pageLinks.SubscriptionsRedemption.url].includes(pathname) ||
      fullpath.includes('currentPage=%2Fgift%2Fgroup');

    const showHeader = !bannedHeaderPages.includes(pathname);
    const showFooter = !bannedFooterPages.includes(pathname);

    return (
      <ThemeProvider theme={theme}>
        <>
          <CartSideBar />
          <MenuSideBar globalProps={this.props.globalProps} />
          {uiData.isVideoDialogOpen && (
            <VideoDialog
              url={youtubeLinks.HowToApplyLongVideo}
              playMode={uiData.isVideoDialogOpen}
              onClose={this.closeDialogHandler}
            />
          )}
          <Container>
            <Box
              position="relative"
              minHeight="100vh"
              width="100%"
              height="100%"
              display="flex"
              bg="#fff"
              flexDirection="column"
            >
              <AppHeader
                globalProps={this.props.globalProps}
                uiData={uiData}
                clickMenuHandler={this.clickMenuHandler}
                primaryPromotionHeight={primaryPromotionHeight}
                secondaryPromotionHeight={secondaryPromotionHeight}
                closePromotionHandler={this.closePromotionHandler}
                closeSecondaryPromotionHandler={this.closeSecondaryPromotionHandler}
                selectedMenu={selectedMenu}
                stepDirection={stepDirection}
                showFooterHeader={showHeader}
                hideHeader={hideHeader}
                pathname={pathname}
              />

              <ContentBox
                mt={hideHeader ? 0 : ['58px', '70px']}
                mb={hideTopBarPage ? 0 : ['58px', '70px']}
                pathname={pathname}
              >
                {selectedMenu === MENULIST[0] ? (
                  <ShopMenu
                    onClose={this.clickMenuHandler('')}
                    globalProps={this.props.globalProps}
                  />
                ) : selectedMenu === MENULIST[2] ? (
                  <HowToMenu
                    onClose={this.clickMenuHandler('')}
                    globalProps={this.props.globalProps}
                  />
                ) : selectedMenu === MENULIST[3] ? (
                  <LearnMenu
                    onClose={this.clickMenuHandler('')}
                    globalProps={this.props.globalProps}
                  />
                ) : null}
                {this.props.children}
              </ContentBox>
              {openJoinWaitList && (
                <JoinWaitListPopup
                  globalProps={this.props.globalProps}
                  opened={openJoinWaitList}
                  onClose={this.closeJoinWaitList}
                  productId={productIdJoinWaitList}
                  product={product}
                />
              )}
              {showFooter && <AppFooter pathname={pathname} />}
              <div
                id="layoutPortal"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Container>
        </>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  uiData: state.uiData,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppWrapper));
