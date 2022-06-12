import { builder, BuilderComponent } from '@builder.io/react';
import 'components/builder/BuilderProductItem';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import SitePromotions from 'components/design/redirect-banners/SitePromotions';
import PageHead from 'components/PageHead';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import log from 'utils/logging';
import { pageHandles } from 'utils/productIds';
import ErrorPage from './_error';

builder.init(BUILDER_API_KEY);

const Page = props => {
  const { asPath, globalProps, pageInfo } = props;
  const router = useRouter();
  const redirectUrl = pageHandles[router.query.handle];
  // console.log({ globalProps });

  useEffect(() => {
    if (redirectUrl) {
      router.push(`/${redirectUrl}?${router.query.query}`, router.asPath);
    }
  });

  return (
    <>
      {redirectUrl ? (
        <>&nbsp;</>
      ) : pageInfo ? (
        <>
          <PageHead pageInfo={pageInfo} />
          <BuilderComponent model="page" content={pageInfo} />
          <SitePromotions pageInfo={pageInfo} />
        </>
      ) : (
        <ErrorPage url={undefined} statusCode={404} globalProps={globalProps} />
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async props => {
  const handle = props.params.handle;
  const url = `/${handle.join('/')}`;
  // console.log({ handle, url });
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, handle, pageInfo: pageInfo || null },
    });
    // console.log(globalProps);
    return globalProps;
  } catch (err) {
    log.error('[generic page]', err);
    return {
      notFound: true,
    };
  }
};

const _Page = ManimeStandardContainer(Page);

export default _Page;
