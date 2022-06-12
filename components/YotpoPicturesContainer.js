import { useEffect } from 'react';
import styled from 'styled-components';
import Box from 'components/styled/Box';
import log from 'utils/logging';

const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
  background: #F9F9F9;
  width: 100%;
  @media (min-width: 768px) {
    padding: 20px;
  }
  & .yotpo-pictures-widget {
    width: 100%;
  }
`;

const YotpoPicturesContainer = ({id}) => {
  useEffect(() => {
    try {
      typeof(yotpo) !== 'undefined' && yotpo.refreshWidgets();
    } catch (err) {
      log.error(`[YotpoPictureContianer][mount] caught err ${err}`, {err});
    }
  }, []);

  return (
  <Box style={{width: "100%"}}>
    <div
      className="yotpo yotpo-pictures-widget"
      data-gallery-id={id}
      style={{width: "100%"}}>
    </div>
  </Box>
)};

export default YotpoPicturesContainer;
