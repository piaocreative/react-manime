import Box from 'components/styled/Box';
import DataDrivenPromotion from './DataDrivenPromotion';

const SitePromotions = props => {
  const { pageInfo, promotions } = props;
  const pageData = pageInfo?.data;

  const promos = pageData
    ? [pageData?.promotion1?.value, pageData?.promotion2?.value].filter(p => p)
    : promotions;

  const result = (
    <Box width={1} display="flex" style={{ flexWrap: 'wrap' }} justifyContent="flex-start">
      {promos?.map(promotion => (
        <DataDrivenPromotion key={`promotion-block-${promotion.id}`} promotion={promotion.data} />
      ))}
    </Box>
  );

  return result;
};

export default SitePromotions;
