import React from 'react';
import Router from 'next/router'
import styled from 'styled-components';

import Box from 'components/styled/Box';
import { StandardOutlinedButton } from 'components/styled/StyledComponents';
import ProductItem from 'components/ProductItem';
import hotProducts from 'components/landing/LandingHotListSection/HotProducts';
import { pageLinks } from 'utils/links';

const Container = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px 16px 0;
`;

const ActionButton = styled(StandardOutlinedButton)`
  position: absolute;
  transform: translate(-50%, 0);
  left: 50%;
  bottom: 17px;
  width: max(calc(100% - 120px), 180px);
  height: 32px;
  border: 1px solid #2C4349;
  letter-spacing: 2px;
  font-size: 12px;
  background: #ffffff20;
  color: #2C4349;
  font-family: 'avenirMedium';
  &:hover {
    transition: ease-out 0.3s;
  }
`;

const BrowseAllDesigns = ({ trackFunnelAction, trackFunnelActionProjectFunnel}) => {
  const clickHandler = () => {
    // trackFunnelAction('A. Landing Page - HotList - BrowseAll');
    trackFunnelActionProjectFunnel('A. Landing Page - HotList - BrowseAll');
    Router.push(pageLinks.SetupDesign.url);
  }

  return (
    <Box position='relative'>
      <Box style={{visibility: 'hidden'}}>
      {(hotProducts && hotProducts.length > 0) &&
        <ProductItem
        landing
        productItemData={hotProducts[0]}
      />
      }
      </Box>
      <Container>
        <img
          style={{objectFit: 'cover', width: '100%', height: '100%'}}
          src='https://d1b527uqd0dzcu.cloudfront.net/web/landing-browse-all.jpg'
          alt='back' />
      </Container>
      <ActionButton onClick={clickHandler}>
        BROWSE ALL DESIGNS
      </ActionButton>
    </Box>
  );
};

export default BrowseAllDesigns;