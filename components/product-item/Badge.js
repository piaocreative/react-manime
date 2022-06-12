import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Box from '../styled/Box';
import { pageLinks } from 'utils/links';

const BadgeBox = styled(Box)`
  position: absolute;
  width: 64px;
  top: 20px;
  right: 4px;
  background: #f7bfa0;
  text-align: center;
  font-size: 12px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 32px;
  text-transform: uppercase;
  @media (min-width: 480px) {
    font-size: 14px;
    width: 80px;
    padding: 3px 0;
  }

  @media (min-width: 768px) {
    right: 0px;
  }
`;

const RedBadgeBox = styled(Box)`
  position: absolute;
  min-width: 48px;
  top: 20px;
  right: 4px;
  background: #cf221c;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 24px;
  text-transform: uppercase;
  @media (min-width: 480px) {
    min-width: 64px;
    min-height: 32px;
    font-size: 14px;
    padding: 3px 0;
  }

  @media (min-width: 768px) {
    right: 0px;
  }
`;

const GrayBox = styled(BadgeBox)`
  background: #f2f3f4;
  border: none;
`;

const NewBadgeBox = styled(BadgeBox)`
  width: 48px;
  height: 24px;
  min-height: unset;
  top: 16px;
  @media (min-width: 480px) {
    top: 20px;
    font-size: 14px;
    width: 64px;
    height: 32px;
  }
`;

const SoldOutBox = styled(BadgeBox)`
  width: 70px;
  height: 24px;
  min-height: unset;
  background: #2c4349;
  color: #fff;
  top: 16px;
  @media (min-width: 480px) {
    top: 20px;
    font-size: 14px;
    width: 84px;
    height: 32px;
  }
`;

const FlashSaleBox = styled(BadgeBox)`
  width: 52px;
  color: #fff;
  background-color: #d30047;
  @media (min-width: 480px) {
    width: 64px;
  }
`;

const SecondBadgeBox = styled(NewBadgeBox)`
  top: ${props => (props.first ? '16px' : '46px')};
  background: #fff;
  border: 1px solid #2c4349;
  @media (min-width: 480px) {
    top: ${props => (props.first ? '20px' : '60px')};
  }
`;

const BackToStockBadgeBox = styled(BadgeBox)`
  background: #fff;
  border: 1px solid #f7bfa0;
`;

const Badge = ({ isOutOfStock, tags, productName, isArchived }) => {
  const isComingSoon = tags?.includes('coming soon');
  const isNew = tags?.includes('new');
  const isMatte = tags?.includes('matte');
  const isSheer = tags?.includes('sheer');
  const isThreeOne = tags?.includes('3+1');
  const isLastChance = tags?.includes('last chance');
  const isDeal = tags?.includes('deal');
  const isBackInStock = tags?.includes('backinstock');
  const isFlashSale = tags?.includes('flash-sale');

  if (isComingSoon) {
    return <BadgeBox>Coming Soon</BadgeBox>;
  } else if (isOutOfStock) {
    return <SoldOutBox>Sold Out</SoldOutBox>;
  } else if (isFlashSale) {
    return null;
    // return (
    //   <Link href={pageLinks.FlashSale.url}>
    //     <a>
    //       <FlashSaleBox>Flash <br /> Sale</FlashSaleBox>
    //     </a>
    //   </Link>
    // );
  } else if (productName === 'MP Bundle') {
    return <BadgeBox>Limited Number</BadgeBox>;
  } else if (isLastChance) {
    return <BadgeBox>Last Chance</BadgeBox>;
  } else if (isDeal) {
    return <RedBadgeBox>Deal</RedBadgeBox>;
  } else if (isBackInStock) {
    return (
      <BackToStockBadgeBox>
        Back In <br />
        Stock
      </BackToStockBadgeBox>
    );
  }

  return (
    <>
      {isNew && <NewBadgeBox>NEW</NewBadgeBox>}
      {isMatte && <SecondBadgeBox first={!isNew}>Matte</SecondBadgeBox>}
      {isThreeOne && <SecondBadgeBox first={!isNew}>{'3 + 1'}</SecondBadgeBox>}
    </>
  );
};

export default Badge;
