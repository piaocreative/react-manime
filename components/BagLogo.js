import React from 'react';
import styled from 'styled-components';
import Box from './styled/Box';
import { Img } from './styled/StyledComponents';
import {useRouter} from 'next/router'

const NumberBox = styled(Box)`
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #F7BFA0;
  letter-spacing: 0;
  font-size: 15px;

  @media (min-width: 768px) {
    top: 22px;
  }
`;

const ContainerBox = styled(Box)`
  position: relative;
  cursor: pointer;
`;

const BagLogo = ({ quantity, location, ...rest }) => {
  const router = useRouter();

  return (
    <ContainerBox {...rest} >
      <Img
        width='30px'
        height={'36px'}
        src='/static/icons/bot-bag2.svg'
        alt='nail-bag'
         />
      <NumberBox data-testid=
      {`manibag-count-${location}`}>{quantity >= 1 ? quantity : 0}</NumberBox>
    </ContainerBox>
  );
}

export default BagLogo;
