import React from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';

const Container = styled(Box)`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  height: 48px;
  border: ${props => props.checked ? '1.5px solid #F7BFA0': '1.5px solid transparent'};
  padding: 0 12px;
`;

const EditButton = styled(Box)`
  margin-left: auto;
  text-decoration: underline;
  font-size: 14px;
`;

const ZipCode = styled.span`
  font-size: 14px;
  color: #F7BFA0;
`;

const checkedIconSrc = '/static/icons/checked-icon.svg';
const unCheckedIconSrc = '/static/icons/unchecked-icon.svg';

const ShippingSuggestLine = ({ hideAction, checked, address, zipCode, onClick, onEdit }) => {
  const checkIcon = checked ? checkedIconSrc : unCheckedIconSrc;

  const clickHandler = () => {
    onClick && onClick();
  }

  const editHandler = event => {
    event.stopPropagation();
    onEdit();
  }
  return (
    <Container onClick={clickHandler} checked={checked}>
      <img
        style={{visibility: !hideAction ? 'visible': 'hidden'}}
        src={checkIcon} alt='checkbox' />
      <Box fontSize='14px' ml={2}>
        {address} {zipCode} <ZipCode></ZipCode>
      </Box>
      {!hideAction &&
        <EditButton onClick={editHandler}>
          Edit
        </EditButton>
      }
    </Container>
  );
};

export default ShippingSuggestLine;
