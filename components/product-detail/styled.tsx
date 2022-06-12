import styled from 'styled-components';
import Box from 'components/styled/Box';
import StandardButton from 'components/styled/StandardButton';

export const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
  background: #f9f9f9;
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

export const BackButton = styled.div`
  margin-top: 12px;
  cursor: pointer;
  width: 100px;
  font-size: 12px;
  text-align: center;
  margin-left: -12px;
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    padding-right: 20px;
  }
`;

export const Gallery = styled(Box)`
  width: 100%;
  @media (min-width: 768px) {
    width: 20%;
  }
`;

export const Gallery2 = styled(Box)`
  width: 100%;
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const GalleryBox = styled(Box)`
  width: 100%;
  overflow: auto;
  display: ${props => (props.mobile ? 'flex' : 'none')};
  // display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 16px;
  flex-direction: row;
  @media (min-width: 768px) {
    flex-direction: column;
    justify-content: center;
    display: flex; //${props => (props.mobile ? 'none' : 'flex')};
  }
`;

export const ProductImage = styled(Box)`
  position: relative;
  width: 100%;
  padding: 16px;
  & > img {
    object-fit: cover;
    height: auto;
  }
  @media (min-width: 768px) {
    width: 40%;
  }
`;

export const ProductInfo = styled(Box)`
  width: 100%;
  padding: 20px 10px;
  @media (min-width: 768px) {
    width: 40%;
    padding: 20px 40px;
  }
`;

export const SmallImg = styled.img`
  display: ${props => (props.hide ? 'none' : 'flex')};
  width: 48px;
  height: 60px;
  margin: 10px 10px 10px 0;
  object-fit: cover;
  cursor: pointer;
  opacity: ${props => (props.opacity ? props.opacity : 1)};
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  @media (min-width: 768px) {
    width: 70px;
    height: 90px;
    margin: 16px;
  }
`;

export const QuantityBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 6px 0;
  border-top: ${props => (props.isOutOfStock && props.showBorder ? '1px solid #2c4349' : 'none')};
  border-bottom: ${props => (props.showBorder ? '1px solid #2c4349' : 'none')};
`;

export const StepButton = styled(Box)`
  cursor: pointer;
  padding: 0 16px;
  font-size: 18px;
`;

export const BagButtonContainer = styled(Box)`
  @media (max-width: 479px) {
    background: #ffffff80;
    padding: 16px 16px;
    position: fixed;
    left: 0;
    width: 100vw; //calc(100vw - 32px);
    bottom: 54px;
    min-width: unset;
    z-index: 20;
  }
`;

export const BagButton = styled(StandardButton)`
  font-size: 14px;
  letter-spacing: 2px;
  display: flex;
  flex-grow: 1;
  justify-content: space-evenly;
  background: ${props => (props.isDisabled ? '#aaa' : '#2c4349')};

  & > span {
    color: white;
  }

  &:hover {
    background: ${props => (props.isDisabled ? '#aaa' : '#2c4349e6')};
  }

  @media (min-width: 768px) {
    letter-spacing: 0;
    font-size: 14px;
  }
  @media (min-width: 1024px) {
    letter-spacing: 2px;
    font-size: 16px;
  }
`;

export const JoinWaitListButton = styled(BagButton)`
  background: ${props => (props.isDisabled ? '#aaa' : '#fff')};
  border: 1px solid #2c4349;
  color: #2c4349;
  &:hover {
    background: ${props => (props.isDisabled ? '#aaa' : '#fff')};
    border: 1px solid #2c4349;
    color: #2c4349;
  }
  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

export const QuantityButtonBox = styled(Box)`
  display: flex;
  align-items: center;
  background: #fff;
  margin-right: 12px;
  border: 1px solid;
`;
