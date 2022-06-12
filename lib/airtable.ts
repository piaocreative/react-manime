// const AIRTABLE_API_KEY = 'keygaRViWDuYD2A6V'; Alex's key i think
const AIRTABLE_API_KEY = 'keyFVOFV3GqZp5ue6';
const AIRTABLE_SOLIDS_MANAGEMENT_BASE = 'appeAMwy0WJ4qUCbI';
const AIRTABLE_SHOPIFY_PRODUCTS_BASE = 'appzzqgFJUCylNt05';

import constants from 'constants/index';

export const BASE = 'https://api.airtable.com/v0/';

export async function getMenuInfo() {
  // const productionFilter = 'AND({Active}=TRUE(),{Start Date}<=NOW(),OR({End Date}="",{End Date}>=NOW()))';
  // const developmentFilter = '{Active}=TRUE()';
  const productionFilter = '{Production}=1';
  const developmentFilter = 'OR({Production}=1,{Preview}=1)';
  const filter = constants.isProduction() ? productionFilter : developmentFilter;

  const res = await fetch(
    `${BASE}${AIRTABLE_SHOPIFY_PRODUCTS_BASE}/Shop%20Menu?maxRecords=500&view=Website%20Sorting&filterByFormula=${filter}`, {
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      })
    });
  const response: any = await res.json();
  const sections: any = response.records;
  return sections;
}

export async function getShopPageSections() {
  const productionFilter = 'AND({Active}=TRUE(),{Release Date}<=NOW())';
  const developmentFilter = '{Active}=TRUE()';
  const filter = constants.isProduction() ? productionFilter : developmentFilter;

  const res = await fetch(
    `${BASE}${AIRTABLE_SHOPIFY_PRODUCTS_BASE}/Shop%20All%20Sections?maxRecords=500&view=Section%20Info&filterByFormula=${filter}`, {
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      })
    });
  const response: any = await res.json();
  const sections: any = response.records;
  return sections;
}

export async function getSolidDrops() {
  const productionQuery = constants.isProduction() ? 
  '&filterByFormula=Published=TRUE()' : 
  '';
  const res = await fetch(
    `${BASE}${AIRTABLE_SHOPIFY_PRODUCTS_BASE}/Products?maxRecords=500&view=Solid%20Drops${productionQuery}`, {
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      })
    });
  const response: any = await res.json();
  const solidDrops: any = response.records;
  // console.log({solidDrops})
  return solidDrops;
}
