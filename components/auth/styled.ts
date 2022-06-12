import styled from 'styled-components';
import Box from '../styled/Box';

export const Line = styled(Box)`
  flex-grow: 1;
  height: 1.5px;
  // margin-top: 16px;
  background-color: #212529;
`;

export const ImgBox = styled(Box)`
  background: #f8f1ed;
  //background-image: url('/static/images/auth-back.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0;
  position: relative;
  height: ${props => props.height ? props.height : '300px'};
  @media (min-width: 768px) {
    background-image: url('/static/images/auth-back.png');
    height: 100%;
  }
  @media (min-width: 1440px) {
    background-size: contain;
    background-color: #f8f1ed;
  }
`;

export const HalfBox = styled(Box)`
  width: 100%;
  display: ${props => props.isModal ? 'none' : 'unset'};
  @media (min-width: 768px) {
    width: ${props => props.decoration ? 'calc(50% + 50px)' : '50%'};
    margin-left: ${props => props.decoration ? '-50px' : 'unset'};
    margin-top: ${props => props.decoration ? '24px' : 'unset'};
    margin-bottom: ${props => props.decoration ? '24px' : 'unset'};
    display: unset;
  }
`;

export const A = styled.span`
  cursor: pointer;
  padding: 0 4px;
  color: #F7BFA0;
  &:hover {
    text-decoration: underline;
  }
`;

export const Container = styled(Box)`
  ${'' /* background-image: linear-gradient(to right top, #191915, #2a2a21, #3d3c2d, #514f39, #676246); */}
  ${'' /* background-image: linear-gradient(to right top, #0d0d0d, #1d191b, #2e2222, #3c2e25, #413d2a); */}
  ${'' /* background-color: #f9f9f9; */}
  ${'' /* height: ${props => props.height}px; */}
  width: ${props => props.width}px;
  overflow-x: hidden;
  ${'' /* overflow-y: auto; */}
`;

export const PageBox = styled(Box)`
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const Span = styled.span`
  cursor: pointer;
  white-space: nowrap;
  color: #212529;
  padding: 0 6px;
  text-decoration: underline;
`;

export const BackBox = styled(Box)`
  position: absolute;
  left: 32px;
  top: 20px;
  cursor: pointer;
  width: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  @media (min-width: 768px) {
    left: 64px;
    top: 50px;
  }
  & > img {
    height: 20px;
    padding-bottom: 2px;
  }
`;

export const DesktopViewBox = styled(Box)`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
`;

export const MobileViewBox = styled(Box)`
  display: flex;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const PhoneLineBox = styled(Box)`
  flex-wrap: wrap;
  @media (min-width: 768px) {
    flex-wrap: unset;
  }
`;