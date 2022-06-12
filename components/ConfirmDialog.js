
import React, { useState } from 'react';
import styled from 'styled-components';

import StandardButton from '../components/styled/StandardButton';
import Box from '../components/styled/Box';

const Container = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  padding: 20px;
`;

const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled ? '#aaa': '#2C4349'};

  &:hover {
    transition: ease-out 0.3s;
    background: ${props => props.disabled ? '#aaa': '#35535b'};
  }
`;

const ConfirmDialog = props => {
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);

  const confirmHandler = async () => {
    const { confirmed, closed } = props;
    setConfirmButtonDisabled(true);
    await confirmed();
    setConfirmButtonDisabled(false);
    closed();
  };

  const { message, opened, closed  } = props;
  if (!opened) {
    return null;
  }
  return (
    <Container>
      <Box width={['100%', '500px']} background='white' p={4}>
        <Box fontSize={4}>Confirm</Box>
        <Box fontSize={3} my={3}>
          {message || 'Do you really want to remove this?'}
        </Box>
        <Box width={1} display='flex' justifyContent='center' mt={2} >
          <ActionButton
            mr={2}
            onClick={confirmHandler}
            disabled={confirmButtonDisabled}>
            OK
          </ActionButton>
          <ActionButton
            ml={2}
            onClick={closed}>
            Cancel
          </ActionButton>
        </Box>
      </Box>
    </Container>
  );
}

export default ConfirmDialog;