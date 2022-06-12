#!/bin/bash
BUILDER_API_KEY=4450ed69378e42878b56127de8154a1a
BUILDER_GRAPHQL=https://cdn.builder.io/api/v1/graphql
BUILDER_CONTENT=https://cdn.builder.io/api/v2/content

AIRTABLE_API_KEY=keyFVOFV3GqZp5ue6
AIRTABLE_SHOPIFY_PRODUCTS_BASE=appzzqgFJUCylNt05
AIRTABLE_CONTENT=https://api.airtable.com/v0
AIRTABLE_AUTH="Authorization: Bearer $AIRTABLE_API_KEY"

echo "Checking $1 content APIs."

builder_page_url () {
  pageUrl="${BUILDER_CONTENT}/page?apiKey=${BUILDER_API_KEY}&data.url=${1}&limit=1&includeUnpublished=true&includeRefs=true"
}

check_api () {
  if [[ $# == 4 ]]
  then
    data=`curl $2 -H "$4"`
  else
    data=`curl $2`
  fi
  if [[ $data == $3* ]]
  then
    path=$1
    if [[ ${path::1} == "/" ]]; then path=${path:1}; fi
    echo $data > ./static/data/${path//\//_%2F_}.json
    echo "$1 okay"
  else
    echo "$1 NOT OKAY:"
    echo $2
    exit 1
  fi
}

mkdir ./static/data
rm -rf ./static/data/*

sitewideData="$BUILDER_GRAPHQL/$BUILDER_API_KEY?query=query%20%7B%0A%20%20oneSitewide%28target%3A%20%7B%20urlPath%3A%20%22%2F%22%20%7D%29%20%7B%0A%20%20%20%20name%0A%20%20%20%20data%20%7B%0A%20%20%20%20%20%20menuHighlightImage%0A%20%20%20%20%20%20menuHighlightLink%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A"
# echo $sitewideData
sitewideDataTest={\"data\":{\"oneSitewide\"

productListsContent="$BUILDER_GRAPHQL/$BUILDER_API_KEY?query=query%20%7B%0A%20%20productList%20%7B%0A%20%20%20%20name%0A%20%20%20%20data%20%7B%0A%20%20%20%20%20%20products%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D"
# echo $productListsContent
productListTest={\"data\":{\"productList\"

waitListsContent="$BUILDER_GRAPHQL/$BUILDER_API_KEY?query=query%20%7B%0A%20%20waitList%7B%0A%20%20%20%20name%2C%0A%20%20%20%20data%7B%0A%20%20%20%20%20%20emailTemplate%2C%0A%20%20%20%20%20%20modalBody%2C%0A%20%20%20%20%20%20modalHeader%2C%0A%20%20%20%20%20%20modalImage%2C%0A%20%20%20%20%20%20confirmationBody%2C%0A%20%20%20%20%20%20confirmationHeader%2C%0A%20%20%20%20%20%20primaryColor%2C%0A%20%20%20%20%20%20secondaryColor%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D"
# echo $waitListsContent | cut -c1-100
waitListsTest={\"data\":{\"waitList\"

promotionBarListsContent="$BUILDER_GRAPHQL/$BUILDER_API_KEY?query=query%20%7B%0A%20%20promotionBars%20%7B%20%0A%20%20%20%20data%20%7B%0A%20%20%20%20%20%20primary%0A%20%20%20%20%20%20secondary%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D"
# echo $getPromotionBarListsContent | cut -c1-100
promotionBarListsTest={\"data\":{\"promotionBars\"

menuGroupData="$BUILDER_CONTENT/menu-group?apiKey=$BUILDER_API_KEY&includeRefs=true"
menuGroupDataTest={\"results\":[{
# echo $menuGroupData | cut -c1-100

collectionData="$BUILDER_CONTENT/collection-page?apiKey=${BUILDER_API_KEY}&limit=500&includeRefs=true"
collectionDataTest={\"results\":[{
# echo $collectionData | cut -c1-100

designerData="$BUILDER_CONTENT/designer-page?apiKey=${BUILDER_API_KEY}&limit=500&includeRefs=true"
designerDataTest={\"results\":[{
# echo $collectionData | cut -c1-100

# shopPageSections="curl "$AIRTABLE_CONTENT/$AIRTABLE_SHOPIFY_PRODUCTS_BASE/Shop%20All%20Sections?maxRecords=500&view=Section%20Info&filterByFormula=AND({Active}=TRUE(),{Release Date}<=NOW()) \

shopPageSections="$AIRTABLE_CONTENT/$AIRTABLE_SHOPIFY_PRODUCTS_BASE/Shop%20All%20Sections?maxRecords=3&view=Section%20Info"
# echo $shopPageSections | cut -c1-100
shopPageSectionsTest={\"records\":[{

solidDrops="$AIRTABLE_CONTENT/$AIRTABLE_SHOPIFY_PRODUCTS_BASE/Products?maxRecords=500&view=Solid%20Drops&filterByFormula=Published=TRUE()"
# echo $solidDrops | cut -c1-100
solidDropsTest={\"records\":[{

menuInfo="$AIRTABLE_CONTENT/$AIRTABLE_SHOPIFY_PRODUCTS_BASE/Shop%20Menu?maxRecords=500&view=Website%20Sorting&filterByFormula={Production}=1"
# echo $solidDrops | cut -c1-100
menuInfoTest={\"records\":[{

check_api sitewideData "$sitewideData" "$sitewideDataTest" || exit 1
check_api productListsContent "$productListsContent" "$productListTest" || exit 1
check_api waitListsContent "$waitListsContent" "$waitListsTest" || exit 1
check_api promotionBarListsContent "$promotionBarListsContent" "$promotionBarListsTest" || exit 1
check_api menuGroupData "$menuGroupData" "$menuGroupDataTest" || exit 1
check_api collectionData "$collectionData" "$collectionDataTest" || exit 1
check_api designerData "$designerData" "$designerDataTest" || exit 1
check_api shopPageSections "$shopPageSections" "$shopPageSectionsTest" "$AIRTABLE_AUTH" || exit 1
check_api solidDrops "$solidDrops" "$solidDropsTest" "$AIRTABLE_AUTH" || exit 1
check_api menuInfo "$menuInfo" "$menuInfoTest" "$AIRTABLE_AUTH" || exit 1

builderPageUrls=()
builderPageUrls+=("/" "/shop" "/manicures" "/pedicures" "/essentials" "/new-products")
builderPageUrls+=("/last-chance" "/archive" "/solid-colors" "/collection/signature" "/bundles")
numberOfBuilderPages=${#builderPageUrls[@]}

echo $numberOfBuilderPages

pageTest={\"results\":[{
goodPages=0
for url in ${builderPageUrls[@]}; do
  builder_page_url $url
  # echo ${url}
  check_api "$url" "$pageUrl" "$pageTest" || continue
  goodPages=$((goodPages + 1))
done
if [ $goodPages -lt $numberOfBuilderPages ]
then
  echo "Not all builder pages were loaded ${goodPages}/${numberOfBuilderPages}"
  exit 1
else
  echo "All builder pages were loaded"
fi
