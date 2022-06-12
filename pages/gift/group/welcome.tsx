import { builder, BuilderComponent } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Welcome from 'components/gift/group/Welcome';
import { track, FlowLabels } from 'utils/track';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import log from 'utils/logging';

builder.init(BUILDER_API_KEY);

const WelcomePage = props => {
  track(`${FlowLabels.GroupGiftBuy}[Welcome]`);
  return <BuilderComponent model="page" content={props.pageInfo} />;
};

export default ManimeStandardContainer(WelcomePage);

export const getStaticProps = async ctx => {
  const url = '/gift/group/welcome';
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, pageInfo: pageInfo || null },
    });
    return globalProps;
  } catch (err) {
    log.error(url, err);
    return {
      notFound: true,
    };
  }
};
