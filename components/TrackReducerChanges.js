import React, { useRef, useEffect } from 'react';
import ShopifyHOC from './ShopifyHOC';
import { trackFunnelActionProjectFunnel } from '../utils/track';
import _ from 'lodash';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current || {};
}

function TrackReducerChanges(props) {
   const { mainCartData, userData } = props;
   const prevProps = usePrevious({ mainCartData, userData });

   useEffect(() => {
      if (!userData || !userData.isAuth) return;
      if (!_.isEqual(prevProps.mainCartData, props.mainCartData)) {
        trackFunnelActionProjectFunnel('[mainCartData]', props.mainCartData);
      }
      if (!_.isEqual(prevProps.userData, props.userData)) {
        trackFunnelActionProjectFunnel('[userData]', props.userData);
      }
   }, [mainCartData, userData]);

   return (
     <div></div>
   );
}

export default ShopifyHOC(TrackReducerChanges);
