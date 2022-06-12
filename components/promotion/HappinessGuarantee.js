import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Box from '../styled/Box';
import { pageLinks } from '../../utils/links';

const HappyBox = styled(Box)`
  position: fixed;
  width: 100%;
  z-index: 100;
  height: 30px;
  font-size: 14px;
  color: #2c4349;
  background: #e6ddd6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseBox = styled(Box)`
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: #2c4349;
  cursor: pointer;
`;

const HowtoLink = styled(Box)`
  text-decoration: underline;
  cursor: pointer;
  font-family: 'avenirMedium';
  color: #2c4349;
  @media (max-width: 340px) {
    margin-right: 32px;
  }
`;

const HappinessGuarantee = ({top, height, onClose}) => (
  <HappyBox style={{top: top, height: height}}>
    <Link href={pageLinks.Faq.url}>
      <HowtoLink>100% HAPPINESS GUARANTEED</HowtoLink>
    </Link>
    <CloseBox onClick={onClose}>×</CloseBox>
  </HappyBox>
);

export default HappinessGuarantee;