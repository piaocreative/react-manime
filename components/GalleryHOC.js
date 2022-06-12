import React, { useEffect, useState, useCallback } from 'react';
import Router from 'next/router';
import { connect, useSelector } from 'react-redux';
import { PageContainer } from 'components/styled/StyledComponents';
import Box from 'components/styled/Box';
import FilterPanel from 'components/design/filter/FilterPanel_V2';
import SortPanel from 'components/design/sort/SortPanel';
import FilteredTagsLine from 'components/design/filter/FilteredTagsLine_V2';
import GallerySubHeader from 'components/header/GallerySubMenuHeader';
import JoinWaitListBanner from 'components/promotion/JoinWaitListBanner';
import { track, trackFunnelActionProjectFunnel } from 'utils/track';
import { scrollToTop } from 'utils/scroll';
import { getNailProducts } from 'api/product';
import { SET_CART_SIDEBAR, SET_PRODUCTS_DATA, SET_FLOW } from '../actions';
import { compareBySortOrderShopPage, sortByList } from 'utils/galleryUtils';
import toggleLoading from 'utils/toggleLoading';

import log from 'utils/logging';

const pageNamesWithSubHeader = ['All', 'Manis', 'Pedis', 'Essentials'];

const joinWaitListProduct = {
  extraFields: {
    waitListTemplate: undefined,
  },
};

export default function GalleryHOC(WrappedComponent, pageName, hideItems) {
  const Container = props => {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showSortPanel, setShowSortPanel] = useState(false);
    const [tags, setTags] = useState([]);
    const [productType, setProductType] = useState(null);
    const [sortIndex, setSortIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [displayProductsCount, setDisplayProductsCount] = useState(0);
    const [filter, setFilter] = useState('');
    const showTopMenu = props.showTopMenu;
    const nailProducts = useSelector((state) => state.productsData.products)
    const products = (nailProducts||[]).filter(product => product.images.length > 0 && product.images[0]);

    const toggleTagHandler = tag => {
      if (tags.includes(tag)) {
        const newTags = tags.filter(item => item !== tag);
        setTags(newTags);
      } else {
        setTags([...tags, tag]);
      }
    };

    const toggleFilterPanelHandler = () => {
      setShowFilterPanel(prevState => !prevState);
    };

    const toggleSortPanelHandler = () => {
      setShowSortPanel(!showSortPanel);
    };

    const changeSortHandler = index => {
      setSortIndex(index);
      toggleSortPanelHandler();
    };

    const clearTags = () => setTags([]);

    const init = useCallback(async () => {
      scrollToTop();
      toggleLoading(false);

      props.dispatchSetFlow(undefined);

      const url = new URL(window.location.href);
      const action = url.searchParams.get('action');
      if (action === 'cartOpen') {
        await props.dispatchSetCartSideBar(true);
      }

      setLoading(false);

      trackFunnelActionProjectFunnel(`A. Entered ${pageName} page`);

      if (window.location.hash) {
        setTimeout(() => {
          Router.push(Router.asPath);
          window.scrollTo(window.scrollX, window.scrollY - 100);
        }, 100);
      }
    }, []);

    useEffect(() => {
      init();
    }, []);

    const checkProductTags = useCallback(
      productTags => {
        if (tags.length === 0) return true;
        if (!Array.isArray(productTags)) return true;
        const colorTags = tags.filter(tag => tag.color);
        const styleTags = tags.filter(tag => !tag.color);
        const checkColor = colorTags.find(item => productTags.includes(item.tag));
        const checkStyle = styleTags.find(item => productTags.includes(item.tag));

        return (colorTags.length === 0 || checkColor) && (styleTags.length === 0 || checkStyle);
      },
      [tags]
    );

    const tagList = tags.map(item => item.tag);

    return (
      <PageContainer>
        {pageNamesWithSubHeader.includes(pageName) ? (
          <GallerySubHeader />
        ) : (
          showTopMenu && <GroupGiftSubHeader />
        )}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={1}
          minHeight="calc(100vh - 70px)"
        >
          <Box
            position="relative"
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            background={showTopMenu ? 'white' : '#FCF9F7'}
            width="100%"
            minHeight="70px"
            py={'20px'}
            px={'20px'}
            mb="20px"
          >
            <Box
              fontSize={['16px', '24px']}
              letterSpacing="2px"
              alignSelf="center"
              py="2px"
              style={{ textTransform: 'uppercase' }}
            >
              {pageName && `Shop ${pageName}`}
            </Box>
            {!hideItems && !showTopMenu && (
              <Box fontSize={['12px', '14px']} pl="20px" pt="6px" alignSelf="center" py="2px">
                {displayProductsCount} items{' '}
              </Box>
            )}

            <Box ml="auto" display="flex" alignItems="center" width={[1, 'unset']}>
              <Box
                position="relative"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border="1px solid #474746"
                width={['calc(50% - 10px)', '164px']}
                height="32px"
                px="8px"
                mr="20px"
                style={{ cursor: 'pointer' }}
                onClick={toggleSortPanelHandler}
              >
                <Box fontSize={['14px', '16px']}>
                  {sortIndex === 0 ? 'Sort By' : sortByList[sortIndex].label}
                </Box>
                <img
                  src="/static/icons/arrow-down-icon.svg"
                  style={{ transform: showSortPanel && 'rotate(180deg)' }}
                  alt="arrow-down"
                />
                {showSortPanel && (
                  <SortPanel
                    sortIndex={sortIndex}
                    sortList={sortByList}
                    changeSortHandler={changeSortHandler}
                    onClose={toggleSortPanelHandler}
                  />
                )}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                alignSelf="center"
                border="1px solid #474746"
                width={['calc(50% - 10px)', '164px']}
                height="32px"
                px="8px"
                onClick={toggleFilterPanelHandler}
                style={{ cursor: 'pointer' }}
              >
                <Box fontSize={['14px', '16px']}>Filter</Box>
                <img
                  src={
                    !showFilterPanel
                      ? '/static/icons/menu-icon.svg'
                      : '/static/icons/close-dark-icon.svg'
                  }
                  alt="filter-menu"
                />
              </Box>
            </Box>
            {showFilterPanel && (
              <FilterPanel
                tags={tags}
                tagList={tagList}
                onToggleTag={toggleTagHandler}
                onClose={toggleFilterPanelHandler}
                onClear={clearTags}
              />
            )}
          </Box>
          <FilteredTagsLine tags={tags} onToggleTag={toggleTagHandler} clearTags={clearTags} />
          {pageNamesWithSubHeader.includes(pageName) &&
            joinWaitListProduct.extraFields.waitListTemplate && (
              <JoinWaitListBanner
                bgColor="#1a2423"
                mobileBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-mobile-banner.jpg?v=1617641055"
                desktopBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-desktop-banner.jpg?v=1617641054"
                product={joinWaitListProduct}
              />
            )}
          <WrappedComponent
            {...props}
            filter={filter}
            productType={productType}
            nailProducts={products}
            tags={tagList}
            checkProductTags={checkProductTags}
            sortIndex={sortIndex}
            loading={loading}
            displayProductsCount={displayProductsCount}
            setDisplayProductsCount={setDisplayProductsCount}
          />
        </Box>
      </PageContainer>
    );
  };

  const mapStateToProps = state => ({
    productsData: state.productsData.products,
  });

  const mapDispatchToProps = dispatch => ({
    dispatchSetFlow: flowName => dispatch(SET_FLOW(flowName)),
    dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
    dispatchSetProducts: nailProducts => dispatch(SET_PRODUCTS_DATA(nailProducts)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Container);
}
