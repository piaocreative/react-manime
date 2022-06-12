export const experiments = {
  fittingGalleryFlow: {
    experimentName: 'fittingGalleryFlowv2',
    variantNames: ['fittingFirst', 'galleryFirst'],
  },
  landingFlow: {
    experimentName: 'landingFlowv13',
    variantNames: ['landingFlowOldv5', 'landingFlowNewv6'],
  },
  maniFittingFlow: {
    experimentName: 'maniFittingFlow',
    variantNames: ['maniFittingFlowA', 'maniFittingFlowB'],
    variantWeights: [95, 5],
    iteration: 1,
  },
  fitting: {
    experimentName: 'fitting',
    // variantNames: ['2.0', '1.0'],
    // variantWeights: [75, 25],
    variantNames: ['1.0', '1.0'],
    variantWeights: [0, 100],
    iteration: 11,
  },
  checkoutFlow: {
    experimentName: 'checkoutFlow',
    variantNames: ['checkoutFlowA', 'checkoutFlowB'],
    variantWeights: [90, 10],
    iteration: 1,
  },
};
