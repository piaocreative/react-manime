import styled from 'styled-components';
import Box from '../../styled/Box';

export const ImageBgBox = styled(Box)`
  position: relative;
  width: calc(100% - 32px);
  height: calc(100vh - 180px);
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  overflow-x: auto;
  background-color: #fafafa;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
  background-size: cover;
  background-position: center;

  @media (min-width: 480px) {
    height: 60vh; //calc(60vh - 70px);
    align-items: flex-start;
  }

  @media (min-width: 768px) {
    background-position: right;
    width: 100%;
    height: 70vh;
    min-height: 520px;
    margin: 0;
    background-position: top right;
  }
`;
