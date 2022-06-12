import { getEntitlements, getPlans } from 'api/subscription';
import AuthWall from 'components/AuthWallHOC';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SubscriptionEntitlement, SubscriptionPlan } from 'types';
import { externalLinks, pageLinks } from 'utils/links';
import log from 'utils/logging';

export default function EntitlementWall(WrappedComponent: any) {
  function _EntitlementWall(props) {
    const [isMounting, setIsMounting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { identityId, recurlyAuthToken } = useSelector((state: any) => {
      return {
        identityId: state.userData?.identityId,
        recurlyAuthToken: state.userData?.recurlyAuthToken,
      };
    });

    const [state, setState] = useState<{
      entitlements: SubscriptionEntitlement[];
      plan: SubscriptionPlan;
    }>();

    async function mount() {
      const match = process.browser ? Router.asPath.match(/new=(?<isNew>\w+)&?/) : undefined;
      let isNew = match?.groups?.isNew === 'true';
      setIsMounting(true);
      let entitlements = await getEntitlements(identityId, isNew);
      const plans = await getPlans();

      let plan: SubscriptionPlan;

      if (!entitlements) {
        Router.push(pageLinks.SubscriptionLanding.url);
        return;
      }

      if (entitlements?.length > 0) {
        plan = plans.find(p => p.planCode === entitlements[0].planCode);
      } else {
        // don't ask me why but the dehydated version uses the first ... rehydrated version uses the second
        const manage = externalLinks.externalLinks
          ? externalLinks.externalLinks.SubscriptionManage.url
          : externalLinks.SubscriptionManage.url;
        Router.push(`${manage}/${recurlyAuthToken}`);
      }

      setState({ entitlements, plan });

      setIsMounting(false);
      setIsMounted(true);
    }
    useEffect(() => {
      log.info('[EntitlementWall][mount]', { url: Router.asPath });
      if (!isMounted && !isMounting && identityId) {
        mount();
      }
    }, [identityId]);

    return (
      <WrappedComponent
        {...props}
        entitlement={state?.entitlements?.[0]}
        plan={state?.plan}
        isLoading={isMounting}
      />
    );
  }

  return AuthWall(_EntitlementWall);
}
