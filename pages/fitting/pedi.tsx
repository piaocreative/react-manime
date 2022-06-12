import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import PediFitting from 'components/fitting/pedi';

function PediFittingPage (props) {
  return <PediFitting />;
};
export const getStaticProps = async ({ res, req }) => await getGlobalProps();
export default ManimeStandardContainer(PediFittingPage)