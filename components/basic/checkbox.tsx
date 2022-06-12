import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-bottom: 20px;
`;

const Img = styled.img`
  margin-left: 4px;
  margin-right: 4px;
  width: 16px;
`;

const CheckBox = ({ checked, clickEvent, label, className=undefined }) => (
  <Container
    className={className}
    onClick={clickEvent}>
    <Img src={`/static/icons/${checked ? 'checked-teal': 'unchecked-icon'}.svg`} />
    {label}
  </Container>
);

export default CheckBox;