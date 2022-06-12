import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { useEffect } from 'react';
import ManiFittingNew from 'components/fitting/mani';
function ManiFittingPage (props) {
  return (
    <ManiFittingNew />
  )
};
export const getStaticProps = async ({ res, req }) => await getGlobalProps();
export default ManimeStandardContainer(ManiFittingPage)