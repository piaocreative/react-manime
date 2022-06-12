import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Box from '../styled/Box';

const InviteLink = styled(Box)`
  text-decoration: underline;
  cursor: pointer;
  color: #fff;
  @media (max-width: 340px) {
    margin-right: 32px;
  }
`;

const Container = styled(Box)`
  position: fixed;
  z-index: 100;
  width: 100%;
  background-color: ${props => (props.backgroundColor || '#2c4349')};
  background-image: ${props => (props.backgroundImage || '')};
  color: ${props => (props.color || '#fff')};
  display: flex;
  justify-content: center;
  place-items: center;

  transition: all .3s ease-in-out,-webkit-transform .3s ease-in-out;
  -webkit-transition-delay: .3s;

  font-size: 12px;
  white-space: nowrap;

  & div {
    color: ${props => (props.color || '#fff')};
    text-align: center;
  }
  @media (min-width: 768px) {
    font-size: 15px;
    & > div {
      max-width: unset;
    }
  }
`;

const Img = styled.img`
  cursor: pointer;
  position: absolute;
  right: 8px;
  z-index: 200;
`;


const SecondaryPromotionBar = ({ mt, contents, height=30, onClose }) => {
  if (!contents?.cards?.length) return null;
  return (
    <Container
      mt={mt}
      height={height}
      backgroundColor={contents?.backgroundColor}
      backgroundImage={contents?.backgroundImage}
      color={contents?.textColor}>
      <Box color='forecolor.0' letterSpacing={[0, '1px']}>
        {contents.cards[0].content} &nbsp;
      </Box>
      <Link href={contents.cards[0].redirectUrl}>
        <a>
          <InviteLink>{contents.cards[0].redirectLabel}</InviteLink>
        </a>
      </Link>
      {contents?.canClose &&
        <Img src='/static/icons/close-dark-icon.svg' alt='close' onClick={onClose} />
      }
    </Container>
  );
};

export default SecondaryPromotionBar;