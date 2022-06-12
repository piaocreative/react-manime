const { pageLinks } = require('./links');

const redirects = {
  async redirects() {
    return [
      {
        source: '/aboutus',
        destination: pageLinks.AboutUs.url,
        permanent: true,
      },
      {
        source: '/shop-air',
        destination: pageLinks.Collection['In the Air'].url,
        permanent: true,
      },
      {
        source: '/shop-aliciatorello',
        destination: pageLinks.Designer['Alicia Torello'].url,
        permanent: true,
      },
      /* this redirect doesn't work in production
      {
        source: '/shop-amyle',
        destination: pageLinks.Designer['Amy Le'].url,
        permanent: true,
      },*/
      {
        source: '/designer/fariha-ali',
        destination: '/designer/nailjob',
        permanent: true,
      },
      {
        source: '/shop-bana-jarjour',
        destination: pageLinks.Designer['Bana Jarjour'].url,
        permanent: true,
      },
      {
        source: '/shop-bundles',
        destination: pageLinks.ShopBundles.url,
        permanent: true,
      },
      {
        source: '/shop-byn',
        destination: pageLinks.Collection['Bare Your Nails'].url,
        permanent: true,
      },
      {
        source: '/shop-care',
        destination: pageLinks.Collection['Care'].url,
        permanent: true,
      },
      {
        source: '/shop-cassandremarie',
        destination: pageLinks.Designer['Cassandre Marie'].url,
        permanent: true,
      },
      {
        source: '/shop-creepy-capsule',
        destination: pageLinks.Collection['Creepy Capsule'].url,
        permanent: true,
      },
      {
        source: '/shop-dreamyescape',
        destination: pageLinks.Collection['Dreamy Escapes'].url,
        permanent: true,
      },
      {
        source: '/shop-dreamyescapes',
        destination: pageLinks.Collection['Dreamy Escapes'].url,
        permanent: true,
      },
      {
        source: '/shop-essentials',
        destination: pageLinks.ShopEssentials.url,
        permanent: true,
      },
      {
        source: '/shop-glow-up',
        destination: pageLinks.Collection['Glow Up'].url,
        permanent: true,
      },
      {
        source: '/shop-hangedit',
        destination: pageLinks.Designer['Hang Nguyen'].url,
        permanent: true,
      },
      {
        source: '/shop-jessicawashick',
        destination: pageLinks.Designer['Jessica Washick'].url,
        permanent: true,
      },
      {
        // this page is not loading products
        source: '/shop-kiastewart',
        destination: pageLinks.Designer['Kia Stewart'].url,
        permanent: true,
      },
      {
        source: '/shop-lastchance',
        destination: pageLinks.ShopLastChance.url,
        permanent: true,
      },
      {
        source: '/shop-madelinepoole',
        destination: pageLinks.Designer['Madeline Poole'].url,
        permanent: true,
      },
      {
        source: '/shop-manis',
        destination: pageLinks.SetupManiDesign.url,
        permanent: true,
      },
      {
        source: '/shop-mei-kawajiri',
        destination: pageLinks.Designer['Mei Kawajiri'].url,
        permanent: true,
      },
      {
        source: '/shop-mimid',
        destination: pageLinks.Designer['Mimi D'].url,
        permanent: true,
      },
      {
        source: '/shop-mp100',
        destination: pageLinks.Collection['100% MP'].url,
        permanent: true,
      },
      {
        source: '/shop-nataliepavloski',
        destination: pageLinks.Designer['Natalie Pavloski'].url,
        permanent: true,
      },
      {
        source: '/shop-pedis',
        destination: pageLinks.SetupPediDesign.url,
        permanent: true,
      },
      {
        source: '/shop-signature',
        destination: pageLinks.Collection['Signature'].url,
        permanent: true,
      },
      {
        source: '/shop-solid-choices',
        destination: pageLinks.Collection['Solid Colors'].url,
        permanent: true,
      },
      {
        source: '/shop-spifstersutton',
        destination: pageLinks.Designer['Spifster'].url,
        permanent: true,
      },
      {
        source: '/shop-x-fashion',
        destination: pageLinks.Collection['X Fashion'].url,
        permanent: true,
      },
      {
        source: '/getstarted',
        destination: pageLinks.Auth.url,
        permanent: true,
      },
      {
        source: '/how-to-guide',
        destination: pageLinks.HowToApply.url,
        permanent: true,
      },
      {
        source: '/product-new',
        destination: pageLinks.NewProduct.url,
        permanent: true,
      },
      {
        source: '/referral',
        destination: pageLinks.Profile.Friends.url,
        permanent: true,
      },
      {
        source: '/collection/solid-choice',
        destination: pageLinks.Collection['Solid Colors'].url,
        permanent: true,
      },
    ];
  },
};

module.exports = {
  redirects,
};
