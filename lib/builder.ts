import { gql } from '@apollo/client';
import { builder } from '@builder.io/react';
import constants from 'constants/index';
import { KeyValue, WaitListContent } from 'types';
import log from 'utils/logging';
import BuilderClient from './apollo/clients/builder';

export const BUILDER_API_KEY = '4450ed69378e42878b56127de8154a1a';

const BASE = 'https://cdn.builder.io/api/v2/content/';

builder.init(process.env.BUILDER_API_KEY);

export async function getModelUrls(modelName: string, limit: number) {
  const results = await fetch(
    `https://cdn.builder.io/api/v2/content/${modelName}?apiKey=${BUILDER_API_KEY}&limit=${limit}&preview=true&noCache=true&cachebust=true&fields=id,name,data.url,lastUpdated&sort.lastUpdated=-1`
  ).then(res => res.json());
  // console.log('\n\n\n');
  // console.log(results);
  // console.log('\n\n\n');
  return results?.results.map(result => result.data.url) || [];
}

export async function resolveBuilderContent(
  modelName: string,
  userAttributes: Record<string, string | number>
) {
  const loadLatestDraft = !constants.isProduction();
  let page = await builder.get(modelName, { userAttributes }).toPromise();
  if (page && loadLatestDraft) {
    page = await fetch(
      `https://builder.io/api/v2/content/${modelName}/${page.id}?apiKey=${BUILDER_API_KEY}&preview=true&noCache=true&cachebust=true&includeRefs=true`
    ).then(res => res.json());
  }

  return page;
}

interface BuilderAuthor {
  '@type': string;
  id: string;
  model: string;
}

interface BuilderKeyword {
  keyword: string;
}

interface BuilderKeywords {
  [index: number]: BuilderKeyword;
}

interface BuilderBlogArticleData {
  author: BuilderAuthor;
  blurbText: string;
  inputs: any; // TODO: Expand this
  publishDate: string;
  searchDescription: string;
  searchKeywords: BuilderKeywords;
  searchTitle: string;
  title: string;
  blocks: any; // TODO: Expand this
  url: string;
  state: {
    deviceSize: string;
    location: {
      path: string;
      query: any; // TODO: Expand this
    };
  };
}

interface BuilderBlogArticleResultRow {
  createdBy: string;
  createdDate: number;
  data: BuilderBlogArticleData;
  id: string;
  lastUpdatedBy: string;
  meta: {
    hasLinks: boolean;
    kind: string;
    needsHydration: boolean;
  };
  modelId: string;
  name: string;
  published: string;
  query: any; // TODO: Expand this
  testRatio: number;
  variations: any; // TODO: empty object in current response unkown content
  lastUpdated: number;
  screenshot: string;
  rev: string;
}

interface BuilderBlogArticleResults {
  [index: number]: BuilderBlogArticleResultRow;

  map: Function;
}

interface BuilderBlogArticleResponseJson {
  results: BuilderBlogArticleResults;
}

interface BuilderHandles {
  [index: number]: string;
}

export async function getAllBlogArticleHandles() {
  const res = await fetch(
    `${BASE}blog-article?apiKey=${BUILDER_API_KEY}&limit=1000&fields=id,name,query`
  );
  const response: BuilderBlogArticleResponseJson = await res.json();
  const blogArticleHandles: BuilderHandles = response.results.map(
    (blogArticle: BuilderBlogArticleResultRow): any => blogArticle.query[0].value
  );
  // log.info({blogArticleHandles})
  return blogArticleHandles;
}

export async function getBlogArticleContent({ path }) {
  const res = await fetch(
    `${BASE}blog-article?url=${process.env.APP_URL}${path}&apiKey=${BUILDER_API_KEY}&`
  );
  const response = await res.json();
  const blogArticleContent: string = response.data.html;
  // log.info({blogArticleContent})
  return blogArticleContent;
}

export async function getPage({ path, isProduction = true }) {
  const res = await fetch(
    `${BASE}page?url=${process.env.APP_URL}${path}&apiKey=${BUILDER_API_KEY}&`
  );
  const response = await res.json();
  const page: string = response;
  return page;
}

export async function getMenuGroupData() {
  const res = await fetch(`${BASE}menu-group?apiKey=${BUILDER_API_KEY}&includeRefs=true`);
  const response = await res.json();
  const menuGroupData: Array<any> = response.results;
  // log.info('[getMenuGroupData]', {menuGroupData, response})
  return Object.fromEntries(menuGroupData.map(item => [item.name, item]));
}

const queryWaitLists = gql`
  query {
    waitList {
      name
      data {
        emailTemplate
        modalBody
        modalHeader
        modalImage
        confirmationBody
        confirmationHeader
        primaryColor
        secondaryColor
      }
    }
  }
`;

const queryProductLists = gql`
  query {
    productList {
      name
      data {
        products
      }
    }
  }
`;

const queryPromotionBars = gql`
  query {
    promotionBars {
      data {
        primary
        secondary
      }
    }
  }
`;

const queryCollections = gql`
  query {
    collectionPage(limit: 100) {
      name
      everything
      data {
        collectionName
        shopifyCollectionTag
        menuTag
        menuLabel
        url
        collectionTitle
        collectionSubtitle
        collectionBlurbText
        headerImageDesktop
        headerImageMobile
        headerImageDesktopUrl
        headerImageMobileUrl
        searchTitle
        searchKeywords
        searchDescription
        thinHeaderImageDesktop
        thinHeaderImageMobile
        thinHeaderImageDesktopUrl
        thinHeaderImageMobileUrl
        thinHeaderTextColor
        thinHeaderBackgroundColor
        thinHeaderTitle
        thinHeaderSubtitle
        sortOrder
      }
    }
  }
`;

const queryDesigners = gql`
  query {
    designerPage(limit: 100) {
      name
      everything
      data {
        url
        shopifyDesignerTag
        siteDisplayNickname
        designerName
        instagramHandle
        portraitImage
        portraitImageUrl
        personalStory
        logoImage
        logoImageUrl
        isCircledLogo
        yotpoGalleryId
        designerPageTitle
        designerPageSubtitle
        headerImageDesktop
        headerImageMobile
        menuTag
        searchTitle
        searchDescription
        searchKeywords
        externalLinkImage
        externalLinkImageUrl
        promotion1
        promotion2
        promotionName1
        promotionName2
        sortOrder
      }
    }
  }
`;

const querySitewideData = gql`
  query {
    oneSitewide(target: { urlPath: "/" }) {
      name
      data {
        menuHighlightImage
        menuHighlightLink
      }
    }
  }
`;

export async function getCollectionData(): Promise<KeyValue<any>> {
  try {
    const isProduction = constants.isProduction();
    const now = Date.now();
    const visibleInProduction = row =>
      row.published === 'published' &&
      (!row.startDate || row.startDate < now) &&
      (!row.endDate || row.endDate > now);
    const visibleInDevelopment = row => row.published !== 'archived';

    const res = await fetch(
      `${BASE}collection-page?apiKey=${BUILDER_API_KEY}&limit=500&includeUnpublished=true&includeRefs=true`
    );
    const response = await res.json();
    const results: any = response.results.filter(
      isProduction ? visibleInProduction : visibleInDevelopment
    );

    const collections = Object.fromEntries(results.map(entry => [entry.name, entry.data]));

    return collections;
    // const result = await BuilderClient.query({
    //   query: queryCollections, fetchPolicy: "cache-first"
    // })
    // const collectionPages = {} as KeyValue<any>;
    // result.data.collectionPage.map(entry => collectionPages[entry.name] = {
    //   ...entry.data,
    //   published: entry.everything.published,
    //   startDate: entry.everything.startDate,
    //   endDate: entry.everything.endDate
    // })

    // return collectionPages;
  } catch (error) {
    log.error(`[builder][getCollectionData] caught error ${error}`, { err: error });
  }

  return null;
}

export async function getDesignerData(): Promise<KeyValue<any>> {
  try {
    const isProduction = constants.isProduction();
    const now = Date.now();
    const visibleInProduction = row =>
      row.published === 'published' &&
      (!row.startDate || row.startDate < now) &&
      (!row.endDate || row.endDate > now);
    const visibleInDevelopment = row => row.published !== 'archived';

    const res = await fetch(
      `${BASE}designer-page?apiKey=${BUILDER_API_KEY}&limit=500&includeUnpublished=true&includeRefs=true`
    );
    const response = await res.json();
    const results: any = response.results.filter(
      isProduction ? visibleInProduction : visibleInDevelopment
    );

    const designers = Object.fromEntries(results.map(entry => [entry.name, entry.data]));

    return designers;

    const result = await BuilderClient.query({
      query: queryDesigners,
      fetchPolicy: 'cache-first',
    });
    const designerPages = {} as KeyValue<any>;
    result.data.designerPage.map(
      entry =>
        (designerPages[entry.name] = {
          ...entry.data,
          published: entry.everything.published,
          startDate: entry.everything.startDate,
          endDate: entry.everything.endDate,
        })
    );

    return designerPages;
  } catch (error) {
    log.error(`[builder][getDesignerData] caught error ${error}`, { err: error });
  }

  return null;
}

export async function getProductListsContent(): Promise<KeyValue<any>> {
  try {
    const result = await BuilderClient.query({
      query: queryProductLists,
      fetchPolicy: 'cache-first',
    });

    const productList = {} as KeyValue<any>;
    result.data.productList.forEach(entry => (productList[entry.name] = entry.data));

    return productList;
  } catch (error) {
    log.error(`[builder][getProductListContent] caught error ${error}`, { err: error });
  }

  return null;
}

export async function getPromotionBarListsContent(): Promise<KeyValue<any>> {
  try {
    const result = await BuilderClient.query({
      query: queryPromotionBars,
      fetchPolicy: 'cache-first',
    });

    const promotionBarList = result.data.promotionBars.map(entry => entry.data);

    return promotionBarList;
  } catch (error) {
    log.error(`[builder][getPromotionBArListsContent] caught error ${error}`, { err: error });
  }

  return null;
}

export async function getSitewideData(): Promise<KeyValue<any>> {
  try {
    const result = await BuilderClient.query({
      query: querySitewideData,
      fetchPolicy: 'cache-first',
    });
    return result.data.oneSitewide.data;
  } catch (err) {
    log.error(`[builder][getSitewideData] caught error ${err}`, { err });
  }

  return null;
}

export async function getWaitListsContent(): Promise<KeyValue<WaitListContent>> {
  try {
    const result = await BuilderClient.query({
      query: queryWaitLists,
      fetchPolicy: 'cache-first',
    });

    const waitList = {} as KeyValue<WaitListContent>;
    result.data.waitList.map(entry => (waitList[entry.name] = entry.data));
    log.verbose('wait lists are', waitList);

    return waitList;
  } catch (error) {
    log.error(`[builder][getWaitListContent] caught error ${error}`, { err: error });
  }

  return null;
}

export async function getAllSolidProducts() {
  const res = await fetch(`${BASE}solid-product?apiKey=${BUILDER_API_KEY}&limit=1000`);
  const response: any = await res.json();
  const result = response.results?.map(row => row.data);
  // log.info({result})
  return result;
}

export async function warmBuilder() {
  try {
    /*  getProductListsContent();
    getWaitListsContent();
    getCollectionData();
    getDesignerData();
    getMenuGroupData();
    getSitewideData();*/
  } catch (error) {
    log.error(
      'Could not warm the builder graphql cache. May have issues rendering pages later ' + error,
      { err: error }
    );
  }
}
