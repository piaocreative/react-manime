import AppWrapper from 'components/AppWrapper';
import { getMenuInfo } from 'lib/airtable';
import {
  getCollectionData,
  getDesignerData,
  getMenuGroupData,
  getProductListsContent,
  getPromotionBarListsContent,
  getSitewideData,
  getWaitListsContent,
} from 'lib/builder';

export default function PageWrapper({ globalProps, ...props }) {
  const { isMobileView, userIdentifier } = props;
  const isDevMode = process.env.NODE_ENV !== 'production';
  const _AppWrapper: any = AppWrapper;
  return <_AppWrapper globalProps={globalProps}>{props.children}</_AppWrapper>;
}

export function ManimeStandardContainer(Page, createDefault = false) {
  function WrappedPage({ globalProps, ...props }) {
    let _globalProps = globalProps;
    if (createDefault && !globalProps) {
      _globalProps = {
        waitList: [],
        productList: [],
        promoBarList: [],
        menuGroupData: [],
        collectionData: JSON.stringify([]),
        designerData: JSON.stringify([]),
        sitewideData: JSON.stringify([]),
        menuInfo: JSON.stringify([]),
      };
    }
    const { isMobileView, userIdentifier } = props;
    const isDevMode = process.env.NODE_ENV !== 'production';
    const _AppWrapper: any = AppWrapper;
    return (
      <_AppWrapper globalProps={_globalProps}>
        <Page {...props} globalProps={_globalProps} />
      </_AppWrapper>
    );
  }
  return WrappedPage;
}

/**
 * Get the static props to use during build as return to return in getStaticProps.
 * You can also use this as return to getInitialProps, but best if you destructure
 * it to just the props value
 * @param param0
 * @returns object
 */
export async function getGlobalProps(
  { ttl = 300, propsToMerge = {} } = { ttl: 300, propsToMerge: {} }
) {
  // no try/catch because we want this to fail fast during build
  const waitList = await getWaitListsContent();
  const productList = await getProductListsContent();
  const promoBarList = await getPromotionBarListsContent();
  const menuGroupData = await getMenuGroupData();
  const collectionData = await getCollectionData();
  const designerData = await getDesignerData();
  const sitewideData = await getSitewideData();
  const menuInfo = await getMenuInfo();

  // console.log('LandingPage', builderPage, isProduction)
  return {
    revalidate: ttl,
    props: {
      globalProps: {
        waitList: waitList || [],
        productList: productList || [],
        promoBarList: promoBarList || [],
        menuGroupData: menuGroupData || [],
        collectionData: JSON.stringify(collectionData || {}),
        designerData: JSON.stringify(designerData || {}),
        sitewideData: JSON.stringify(sitewideData || {}),
        menuInfo: JSON.stringify(menuInfo || []),
      },
      ...propsToMerge,
    },
  };
}
/*
export async function getStaticProps ({ res, req }){
  const isProduction = process.env.NODE_ENV === 'production';

  // If there is a Builder page for this URL, this will be an object, otherwise it'll be null
  try {


        const waitList = await getWaitListsContent();
        const productList = await getProductListsContent();

        const menuGroupData = await getMenuGroupData();
        const promotionBarListContent = await getPromotionBarListsContent();

    
    const builderPage = await builder.get('page', { 
      req, res, url: '/', 
    }).promise();

    // console.log('LandingPage', builderPage, isProduction)
    return { 
      props: {
        builderPage: { data: builderPage.data },
        isProduction,  
        builderData: {
          waitList, 
          productList,

          menuGroupData,
          promotionBarListContent
        }

      }
    }
  } catch (err) {
    console.log({at: 'LandingPage getStaticProps', err})
    log.error('[homepage]', err)
    return { 
      notFound: true
    }
  }
}
*/
