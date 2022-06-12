import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { Component } from 'react';
import styled from 'styled-components';
import Box from '../../components/styled/Box';
import ChangePasswordFlow from '../../components/ChangePasswordFlow';
import AuthWallHOC from '../../components/AuthWallHOC'
import {pageLinks} from '../../utils/links'
const PageBox = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

class ChangePasswordPage extends Component {

  render () {
    return (
      
      <PageBox>
        <ChangePasswordFlow />
      </PageBox>
      

    );
  }

}

export default ManimeStandardContainer(AuthWallHOC(ChangePasswordPage));

export const getStaticProps = async () => await getGlobalProps();
