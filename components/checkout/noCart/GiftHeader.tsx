import React from 'react';
import styled from 'styled-components';
import Box from '../../../components/styled/Box';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/gifting-banner-mobile-v3.jpg?v=1635823407');

  justify-content: center;
  align-content: center;
  margin-bottom: ${props => (props.collapse ? '-200px' : '50px')};
  min-height: ${props => (props.collapse ? '241px' : '163px')};

  @media (min-width: 1024px) {
    background-image: ${props =>
      props.collapse
        ? `url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/gifting-banner-collapse-desktop-v3.jpg?v=1635823995')`
        : `url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/gifting-banner-desktop-v3.jpg?v=1635823407')`};

    flex-direction: row;
    justify-content: space-around;
    align-content: center;
  }
`;

const SectionBox = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: AvenirBook;
  align-items: center;
  justify-content: center;
  height: auto;
  text-align: center;
  @media (min-width: 1024px) {
    height: 188px;
    padding-top: 0px;
    flex-direction: row;
    justify-content: space-around;
    text-align: left;
  }
`;

const Img = styled.img`
  width: 206px;
  height: 150px;
  object-fit: cover;

  display: ${props => {
    const s = props.canHide ? 'none' : 'flex';
    return s;
  }};

  margin-bottom: -50px;
  @media (min-width: 1024px) {
    width: 350px;
    height: 256px;
    display: flex;
  }
`;

function GiftHeader({
  title,
  canHide,
  image,
  collapse,
}: {
  title: string;
  canHide: boolean;
  image: string;
  collapse: boolean;
}) {
  return (
    <Container collapse={collapse}>
      {image && (
        <SectionBox px={['0px', '0px', '50px']} pt={[canHide ? 0 : '30px']}>
          {!collapse && (
            <Box fontSize={['23px', '28px']} width={'100%'} style={{ textTransform: 'uppercase' }}>
              {title}
            </Box>
          )}
        </SectionBox>
      )}
      {image && !collapse && (
        <SectionBox px={'24px'}>
          <Img src={image} alt="gift" canHide={canHide} />{' '}
        </SectionBox>
      )}
    </Container>
  );
}

export default GiftHeader;
