import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import Banner from 'components/gift/group/redeem/confirmation/Banner'
import NextStep from 'components/gift/group/redeem/confirmation/NextStep'
export default function Confirmation(props){
  return (
    
    <div>

      <Banner />
      <NextStep />
    </div>
    
  )
}

export const getStaticProps = async () => await getGlobalProps();
