import FilteredTagsLine from 'components/design/filter/FilteredTagsLine_V2';
import FilterPanel from 'components/design/filter/FilterPanel_V2';
import SortPanel from 'components/design/sort/SortPanel';
import JoinWaitListBanner from 'components/promotion/JoinWaitListBanner';
import Box from 'components/styled/Box';
import useGetNailProducts from 'hooks/useGetNailProducts';
import React, { useCallback, useEffect, useState } from 'react';
import { sortByList } from 'utils/galleryUtils';

const pageNamesWithSubHeader = ['All', 'Manis', 'Pedis', 'Essentials'];

const joinWaitListProduct = {
  extraFields: {
    waitListTemplate: undefined,
  },
};

export default function FilterBar({
  pageName = '',
  setProductsCallback,
  background = '#FCF9F7',
  additionalFilters = undefined,
}) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortIndex, setSortIndex] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [filters, setFilters] = useState([]);

  const displayableProductFilter = useCallback(
    product => {
      const step1 = product.productType !== 'Other';
      //  && product.quantity > 0 + process.env.OUT_OF_STOCK_THRESHOLD;
      let step2 = true;
      if (additionalFilters) {
        step2 = additionalFilters(product);
      }
      return step1 && step2;
    },
    [additionalFilters]
  );

  const { result: fullProductSet } = useGetNailProducts(
    displayableProductFilter,
    sortByList[sortIndex].comp
  );

  useEffect(() => {
    const temp = filteredProducts.sort(sortByList[sortIndex].comp);
    setFilteredProducts([...temp]);
  }, [sortIndex]);

  useEffect(() => {
    if (fullProductSet && fullProductSet.length > 0) {
      const tempArray = fullProductSet.sort(sortByList[sortIndex].comp);
      if (tempArray.length !== filteredProducts.length) {
        setFilteredProducts(tempArray);
      }
    }
  }, [fullProductSet]);

  useEffect(() => {
    setProductsCallback(filteredProducts);
    console.log('FilterBar use effect for filteredProducts called');
  }, [filteredProducts]);

  useEffect(() => {
    const temp = fullProductSet.filter(product => {
      if (filters.length === 0) return true;
      if (!Array.isArray(product.tags)) return true;
      const colorTags = filters.filter(tag => tag.color);
      const styleTags = filters.filter(tag => !tag.color);
      const checkColor = colorTags.find(item => product.tags.includes(item.tag));
      const checkStyle = styleTags.find(item => product.tags.includes(item.tag));

      return (colorTags.length === 0 || checkColor) && (styleTags.length === 0 || checkStyle);
    });
    setFilteredProducts([...temp]);
  }, [filters]);

  const toggleTagHandler = tag => {
    if (filters.includes(tag)) {
      const newTags = filters.filter(item => item !== tag);
      setFilters(newTags);
    } else {
      setFilters([...filters, tag]);
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

  const clearTags = () => setFilters([]);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" width={1}>
        <Box
          position="relative"
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          background={background}
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
          <Box
            fontSize={['12px', '14px']}
            pl={pageName === '' ? 0 : '20px'}
            pt="6px"
            alignSelf="center"
            py="2px"
          >
            {filteredProducts.length} items{' '}
          </Box>
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
              tags={filters}
              onToggleTag={toggleTagHandler}
              onClose={toggleFilterPanelHandler}
              onClear={clearTags}
            />
          )}
        </Box>
        <FilteredTagsLine tags={filters} onToggleTag={toggleTagHandler} clearTags={clearTags} />
        {pageNamesWithSubHeader.includes(pageName) &&
          joinWaitListProduct.extraFields.waitListTemplate && (
            <JoinWaitListBanner
              bgColor="#1a2423"
              mobileBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-mobile-banner.jpg?v=1617641055"
              desktopBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-desktop-banner.jpg?v=1617641054"
              product={joinWaitListProduct}
            />
          )}
      </Box>
    </>
  );
}
