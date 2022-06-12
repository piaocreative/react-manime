import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  background: #fff;
  height: 32px;
  width: 100%;
  padding: 0 20px;
  overflow-y: auto;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f9f7f7;
  margin-top: 2px;
  font-size: 12px;
  & > a {
    font-size: 12px;
    font-family: 'avenirHeavy';
    text-decoration: none;
  }
  @media(min-width: 768px) {
    height: 44px;
    justify-content: space-around;
    padding-left: calc(50% - 300px);
    padding-right: calc(50% - 300px);
    & > a {
      font-size: 14px;
    }
  }
`;

const A = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: ${props => props.selected ? `1px solid #f7bfa0`: `1px solid transparent`};
  &:hover {
    border-bottom: 1px solid #f7bfa0;
  }
`;

const productTypeList = [
  {type: null, label: 'ALL'},
  {type: 'Manis', label: 'MANIS'},
  {type: 'Pedis', label: 'PEDIS'},
  {type: 'Essentials', label: 'ESSENTIALS'},
];

const GallerySubHeader = ({ productType, setProductType }) => {
  const isClient = typeof window !== 'undefined';
  const selectHandler = type => () => {
    setProductType(type);
  };

  return (
    <Container>
    {productTypeList.map(typeItem => (
      <A
        key={typeItem.label}
        selected={productType === typeItem.type}
        onClick={selectHandler(typeItem.type)}>
        {typeItem.label}
      </A>
    ))}
    </Container>
  );
};

export default GallerySubHeader;