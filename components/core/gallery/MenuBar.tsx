import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { pageLinks } from 'utils/links';

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

const MenuBar = ({view, base}) => {
  const isClient = typeof window !== 'undefined';

  if(!base){
    return <></>
  }
  return (
    <Container>
      <Link href={`${base}`} shallow={true}>
        <A selected={isClient && view?.toLowerCase() === 'all'}>ALL</A>
      </Link>
      <Link href={`${base}/manis`} shallow={true}>
        <A selected={isClient && view?.toLowerCase() === 'manis'}>MANIS</A>
      </Link>
      <Link href={`${base}/pedis`} shallow={true}>
        <A selected={isClient && view?.toLowerCase() === 'pedis'}>PEDIS</A>
      </Link>
      <Link href={`${base}/essentials`} shallow={true}>
        <A selected={isClient && view?.toLowerCase() === 'essentials'}>ESSENTIALS</A>
      </Link>
    </Container>
  );
};

export default MenuBar;