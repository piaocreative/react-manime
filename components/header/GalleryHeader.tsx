import React, { useEffect, useState, useCallback } from 'react';

import FilterPanel from 'components/design/filter/FilterPanel_V2';
import FilteredTagsLine from 'components/design/filter/FilteredTagsLine_V2';
import SortPanel from 'components/design/sort/SortPanel';
import Box from 'components/styled/Box';

import { sortByList } from 'utils/galleryUtils';

const GalleryHeader = props => {
  const {hideItems, pageName, showTopMenu, sortIndex, setSortIndex, tags, setTags, displayProductsCount} = props;
  
  // const [displayProductsCount, setDisplayProductsCount] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);

  const changeSortHandler = (index) => {
    setSortIndex(index);
    toggleSortPanelHandler();
  };

  const clearTags = () => setTags([]);
  const toggleFilterPanelHandler = () => setShowFilterPanel((prevState) => !prevState)
  const toggleSortPanelHandler = () => setShowSortPanel(!showSortPanel);

  const toggleTagHandler = (tag) => {
    if (tags.includes(tag)) {
      const newTags = tags.filter((item) => item !== tag);
      setTags(newTags);
    } else {
      setTags([...tags, tag]);
    }
  };

  const tagList = tags.map((item) => item.tag);

  return (
    <>
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
        <Box
          fontSize={['12px', '14px']}
          pl="20px"
          pt="6px"
          alignSelf="center"
          py="2px"
        >
          {displayProductsCount} items{' '}
        </Box>
      )}

      <Box
        ml="auto"
        display="flex"
        alignItems="center"
        width={[1, 'unset']}
      >
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
          onToggleTag={toggleTagHandler}
          onClose={toggleFilterPanelHandler}
          onClear={clearTags}
        />
      )}
    </Box>
    <FilteredTagsLine
      tags={tags}
      onToggleTag={toggleTagHandler}
      clearTags={clearTags}
    />
    {/* {pageNamesWithSubHeader.includes(pageName) &&
      joinWaitListProduct.extraFields.waitListTemplate && (
        <JoinWaitListBanner
          bgColor="#1a2423"
          mobileBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-mobile-banner.jpg?v=1617641055"
          desktopBgImg="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/marrow-desktop-banner.jpg?v=1617641054"
          product={joinWaitListProduct}
        />
      )} */}
    {/* <WrappedComponent
      {...props}
      filter={filter}
      productType={productType}
      nailProducts={nailProducts}
      tags={tagList}
      checkProductTags={checkProductTags}
      sortIndex={sortIndex}
      loading={loading}
      displayProductsCount={displayProductsCount}
      setDisplayProductsCount={setDisplayProductsCount}
    /> */}
    </>
  )
}

export default GalleryHeader;