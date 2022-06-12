const productionUrls = [
  'https://manime.co',
  'https://www.manime.co',
  'https://blue.manime.co',
  'https://green.manime.co',
  'https://beta1.manime.co',
];

module.exports = {
  productionUrls,
  isProduction: () => !process.env.APP_URL || productionUrls.includes(process.env.APP_URL),
  referral: {
    NORMAL_REFERRER_CREDIT: 15,
    NORMAL_REFERREE_CREDIT: 15,
  },
  NORMAL_RATE_CREDIT: 5,
  totalSteps: 5,

  messages: {
    USER_NOT_EXIST: 'User does not exist',
    USER_ALREADY_EXIST: 'User already exists',
    INCORRECT_USERNAME_PASSWORD: 'Incorrect username or password',
    VALIDATION_PASSWORD: 'Please enter a password at least 6 characters long',
    INVALID_PHONE: 'Invalid phone number format',
    INVALID_PHONE_FORMAT:
      'Invalid phone number format. Please use a phone number format of +12345678900',
    INVALID_PASSWORD_LENGTH: 'Password must be at least 6 characters. Try again.',
  },

  fingers: [
    'left pinky finger',
    'left ring finger',
    'left middle finger',
    'left pointer finger',
    'left thumb',
    'right thumb',
    'right pointer finger',
    'right middle finger',
    'right ring finger',
    'right pinky finger',
  ],

  // fingerImageSrcList: [
  //   { path: '../../../static/icons/left-pinky.png', x: 157, y: 7 },
  //   { path: '../../../static/icons/left-ring.png', x: 189, y: 34 },
  //   { path: '../../../static/icons/left-middle.png', x: 205, y: 57 },
  //   { path: '../../../static/icons/left-pointer.png', x: 198, y: 92 },
  //   { path: '../../../static/icons/left-thumb.png', x: 123, y: 141 },
  //   { path: '../../../static/icons/right-thumb.png', x: 93, y: 141 },
  //   { path: '../../../static/icons/right-pointer.png', x: 16, y: 92 },
  //   { path: '../../../static/icons/right-middle.png', x: 10, y: 56 },
  //   { path: '../../../static/icons/right-ring.png', x: 27, y: 33 },
  //   { path: '../../../static/icons/right-pinky.png', x: 58, y: 7 },
  // ],

  fingerNames: [
    'LEFT LITTLE FINGER',
    'LEFT RING FINGER',
    'LEFT MIDDLE FINGER',
    'LEFT INDEX FINGER',
    'LEFT THUMB FINGER',
    'RIGHT THUMB FINGER',
    'RIGHT INDEX FINGER',
    'RIGHT MIDDLE FINGER',
    'RIGHT RING FINGER',
    'RIGHT LITTLE FINGER',
  ],

  toeNames: [
    'LEFT LITTLE TOE',
    'LEFT RING TOE',
    'LEFT MIDDLE TOE',
    'LEFT SECOND TOE',
    'LEFT BIG TOE',
    'RIGHT BIG TOE',
    'RIGHT SECOND TOE',
    'RIGHT MIDDLE TOE',
    'RIGHT RING TOE',
    'RIGHT LITTLE TOE',
  ],

  nailImageSrcList: [
    { path: '/static/icons/feedback/left-little-nail.svg', x: 138, y: 23, gifX: 8, gifY: 2 },
    { path: '/static/icons/feedback/left-ring-nail.svg', x: 173, y: 49, gifX: 37, gifY: 5 },
    { path: '/static/icons/feedback/left-middle-nail.svg', x: 190, y: 75, gifX: 37, gifY: 6 },
    { path: '/static/icons/feedback/left-index-nail.svg', x: 177, y: 103, gifX: 37, gifY: 9 },
    { path: '/static/icons/feedback/left-thumb-nail.svg', x: 110, y: 151, gifX: 34, gifY: 12 },
    { path: '/static/icons/feedback/right-thumb-nail.svg', x: 92, y: 150, gifX: 34, gifY: 12 },
    { path: '/static/icons/feedback/right-index-nail.svg', x: 25, y: 103, gifX: 37, gifY: 9 },
    { path: '/static/icons/feedback/right-middle-nail.svg', x: 13, y: 74, gifX: 37, gifY: 6 },
    { path: '/static/icons/feedback/right-ring-nail.svg', x: 30, y: 48, gifX: 37, gifY: 5 },
    { path: '/static/icons/feedback/right-little-nail.svg', x: 64, y: 23, gifX: 8, gifY: 2 },
  ],

  toenailImageSrcList: [
    { path: '/static/icons/feedback/left-little-toenail.svg', x: 114, y: 21 },
    { path: '/static/icons/feedback/left-ring-toenail.svg', x: 144, y: 39 },
    { path: '/static/icons/feedback/left-middle-toenail.svg', x: 162, y: 60.5 },
    { path: '/static/icons/feedback/left-index-toenail.svg', x: 177, y: 84 },
    { path: '/static/icons/feedback/left-thumb-toenail.svg', x: 177, y: 124.5 },
    { path: '/static/icons/feedback/right-thumb-toenail.svg', x: 28, y: 124.5 },
    { path: '/static/icons/feedback/right-index-toenail.svg', x: 28, y: 84 },
    { path: '/static/icons/feedback/right-middle-toenail.svg', x: 43, y: 60.5 },
    { path: '/static/icons/feedback/right-ring-toenail.svg', x: 61, y: 39 },
    { path: '/static/icons/feedback/right-little-toenail.svg', x: 91, y: 21 },
  ],

  nnnProdList: [
    {
      id: '4542881890413',
      pediId: '4750102724717',
      color: '#f9edee',
      nnnName: 'NNN10',
      name: 'Venus Shell',
    },
    {
      id: '3984101834861',
      pediId: '4750100594797',
      color: '#f3decb',
      nnnName: 'NNN20',
      name: 'NNN',
    },
    {
      id: '4782125154413',
      pediId: '4782127087725',
      color: '#eed9bf',
      nnnName: 'NNN30',
      name: 'Hi Sandy',
    },
    {
      id: '4782128398445',
      pediId: '4782130167917',
      color: '#eacea6',
      nnnName: 'NNN40',
      name: 'Nice and Toasty',
    },
    {
      id: '4782131544173',
      pediId: '4782132527213',
      color: '#cb996b',
      nnnName: 'NNN50',
      name: 'Yes Honey',
    },
    {
      id: '4782133837933',
      pediId: '4782134755437',
      color: '#906a52',
      nnnName: 'NNN60',
      name: 'Coco Lux',
    },
    {
      id: '4782138327149',
      pediId: '4782139474029',
      color: '#674018',
      nnnName: 'NNN70',
      name: 'Smokeshow',
    },
    {
      id: '4782141538413',
      pediId: '4782142849133',
      color: '#4a3b2d',
      nnnName: 'NNN80',
      name: 'That’s Deep',
    },
  ],

  janSolidList: [
    { id: '4853063090285', pediId: '4853063811181', color: '#6c6e6a', name: 'Ash' },
    { id: '4853060862061', pediId: '4853062565997', color: '#502c39', name: 'Chianti' },
    { id: '4853165359213', pediId: '4853165785197', color: '#17234a', name: 'High Tide' },
    { id: '4840267776109', pediId: '4840267874413', color: '#000', name: 'Black Car' },
  ],

  febSolidList: [
    { id: '4853055455341', pediId: '4853057486957', color: '#e5d3d2', name: 'Lolli' },
    { id: '4866854649965', pediId: '4866854879341', color: '#842d34', name: 'Smitten' },
    { id: '4866855272557', pediId: '4866855993453', color: '#4c246f', name: 'Love Potion' },
    { id: '4866853044333', pediId: '4866853699693', color: '#007a6f', name: 'Emerald' },
  ],

  marchSolidList: [
    { id: '4853050867821', pediId: '4853051228269', color: '#f1e4b2', name: 'Butter Cream' },
    { id: '4876753829997', pediId: '4876754026605', color: '#ce84a8', name: 'Primrose' },
    { id: '4876752978029', pediId: '4876753305709', color: '#b8ccc5', name: 'Honeydew' },
    { id: '4876757434477', pediId: '4876757696621', color: '#85b7ea', name: 'Robin Egg' },
  ],

  aprilSolidList: [
    { id: '4881213325421', pediId: '4881213816941', color: '#f60006', name: 'Candy Coated' },
    { id: '4881214373997', pediId: '4881217028205', color: '#cb96d3', name: 'Gum Drop' },
    { id: '4881211129965', pediId: '4881212604525', color: '#fbaa00', name: 'Mango Lassi' },
    { id: '4881215094893', pediId: '4881215783021', name: 'Discotheque' },
  ],

  maySolidList: [
    { id: '6535201554541', pediId: '6535201685613', name: 'Oyster' },
    { id: '6535201063021', pediId: '6535201161325', color: '#F792B7', name: 'Hot Out Here' },
    { id: '6535200702573', pediId: '6535200768109', color: '#5386E0', name: 'Parasol' },
    { id: '6535200931949', pediId: '6535201030253', color: '#00CFCB', name: 'Sea Foam' },
  ],

  juneSolidList: [
    { id: '6570801594477', pediId: '6570801692781', color: '#a92f3f', name: 'Summer Nights' },
    { id: '6570802151533', pediId: '6570802348141', color: '#fcefc0', name: "Catchin' Rays" },
    { id: '6570802413677', pediId: '6570802446445', color: '#fae2f4', name: 'Rosefinch' },
    { id: '6570803265645', pediId: '6570803429485', color: '#d3e7f2', name: 'Ocean Air' },
  ],

  julySolidList: [
    { id: '6569350332525', pediId: '6569408462957', color: '#ed0b6d', name: 'Dragon Fruit' },
    { id: '6569351315565', pediId: '6569409151085', color: '#fac8b1', name: 'Just Peachy' },
    { id: '6569351446637', pediId: '6569409413229', color: '#85c0e4', name: 'Boot Cut' },
    { id: '6569351118957', pediId: '6569408757869', color: '#def29a', name: 'Match Point' },
  ],

  augustSolidList: [
    { id: '6571407343725', pediId: '6571407802477', name: 'Nebula' },
    { id: '6571401478253', pediId: '6571401805933', name: 'Amethyst' },
    { id: '6571405410413', pediId: '6571405934701', name: 'Galaxy' },
    { id: '6571403772013', pediId: '6571404263533', name: 'Kaleidoscope' },
  ],

  septemberSolidList: [
    { id: '6628872093805', pediId: '6628872126573', color: '#9fb0a9', name: 'Sage' },
    { id: '6628872257645', pediId: '6628872159341', color: '#d9a618', name: 'Marigold' },
    { id: '6628872355949', pediId: '6628872290413', color: '#434052', name: 'Moonstruck' },
    { id: '6628872224877', pediId: '6628872192109', name: 'Dark Matter' },
  ],

  solidDropList: [
    { id: '6535201554541', pediId: '6535201685613', name: 'Oyster' },
    { id: '4542884282477', pediId: '4750103150701', color: '#f4f8f9', name: 'Flat White' },
    { id: '4542882644077', pediId: '4750102823021', color: '#f4f0eb', name: 'Misty Shell' },
    { id: '4380992012397', pediId: '4750102134893', color: '#e5e2da', name: 'Nordic Sky' },
    { id: '4811806179437', pediId: '4811807129709', color: '#c9c5c1', name: 'Cashmere' },
    { id: '4853063090285', pediId: '4853063811181', color: '#6c6e6a', name: 'Ash' },
    { id: '4381025992813', pediId: '4750102265965', color: '#1d1718', name: 'Dusk to Dawn' },
    { id: '4840267776109', pediId: '4840267874413', color: '#000', name: 'Black Car' },

    { id: '6570802413677', pediId: '6570802446445', color: '#fae2f4', name: 'Rosefinch' },
    { id: '4550389039213', pediId: '4750105280621', color: '#e8cdd3', name: 'Strawberry Mochi' },
    { id: '4853055455341', pediId: '4853057486957', color: '#e5d3d2', name: 'Lolli' },
    { id: '4380934996077', pediId: '4750101479533', color: '#d99b9b', name: 'Rose Petal' },
    { id: '4881214373997', pediId: '4881217028205', color: '#cb96d3', name: 'Gum Drop' },
    { id: '4876753829997', pediId: '4876754026605', color: '#ce84a8', name: 'Primrose' },
    { id: '6535201063021', pediId: '6535201161325', color: '#F792B7', name: 'Hot Out Here' },
    { id: '6569350332525', pediId: '6569408462957', color: '#ed0b6d', name: 'Dragon Fruit' },

    { id: '4811812896877', pediId: '4811813322861', color: '#d3897b', name: 'Slip' },
    { id: '4542883168365', pediId: '4750102954093', color: '#dc274a', name: 'Watermelon Sugar' },
    { id: '4881213325421', pediId: '4881213816941', color: '#f60006', name: 'Candy Coated' },
    { id: '4811816337517', pediId: '4811816697965', color: '#c42d31', name: 'A-Line' },
    { id: '4542881136749', pediId: '4750102593645', color: '#b50000', name: 'Scarlet' },
    { id: '6570801594477', pediId: '6570801692781', color: '#a92f3f', name: 'Summer Nights' },
    { id: '3984102981741', pediId: '4741163712621', color: '#a02c2b', name: 'Retro Rouge' },
    { id: '4866854649965', pediId: '4866854879341', color: '#842d34', name: 'Smitten' },

    { id: '4876752978029', pediId: '4876753305709', color: '#b8ccc5', name: 'Honeydew' },
    { id: '6535200931949', pediId: '6535201030253', color: '#00CFCB', name: 'Sea Foam' },
    { id: '4866853044333', pediId: '4866853699693', color: '#007a6f', name: 'Emerald' },
    { id: '4811815321709', pediId: '4811815714925', color: '#5f593f', name: 'Tweed' },
    { id: '4380905701485', pediId: '4750100889709', color: '#47452f', name: 'Evergreen' },
    { id: '4752530112621', pediId: '4750105673837', color: '#a6a3cf', name: 'Provence Daze' },
    { id: '4866855272557', pediId: '4866855993453', color: '#4c246f', name: 'Love Potion' },
    { id: '4853060862061', pediId: '4853062565997', color: '#502c39', name: 'Chianti' },

    { id: '6570803265645', pediId: '6570803429485', color: '#d3e7f2', name: 'Ocean Air' },
    { id: '4876757434477', pediId: '4876757696621', color: '#85b7ea', name: 'Robin Egg' },
    { id: '6569351446637', pediId: '6569409413229', color: '#85c0e4', name: 'Boot Cut' },
    { id: '6535200702573', pediId: '6535200768109', color: '#5386E0', name: 'Parasol' },
    { id: '4811818401901', pediId: '4811818696813', color: '#233682', name: 'High Rise' },
    { id: '4853165359213', pediId: '4853165785197', color: '#17234a', name: 'High Tide' },
    { id: '6570802151533', pediId: '6570802348141', color: '#fcefc0', name: "Catchin' Rays" },
    { id: '4811808768109', pediId: '4811811881069', color: '#D39D75', name: 'Trench' },

    { id: '6569351118957', pediId: '6569408757869', color: '#def29a', name: 'Match Point' },
    { id: '6569351315565', pediId: '6569409151085', color: '#fac8b1', name: 'Just Peachy' },
    { id: '4881215094893', pediId: '4881215783021', name: 'Discotheque' },
    { id: '6571405410413', pediId: '6571405934701', name: 'Galaxy' },
    { id: '6571407343725', pediId: '6571407802477', name: 'Nebula' },
    { id: '4840268005485', pediId: '4840268136557', name: 'Sugar Rush' },
    { id: '6571401478253', pediId: '6571401805933', name: 'Amethyst' },
    { id: '6571403772013', pediId: '6571404263533', name: 'Kaleidoscope' },

    { id: '6628872224877', pediId: '6628872192109', name: 'Dark Matter' },
    { id: '6628872257645', pediId: '6628872159341', color: '#d9a618', name: 'Marigold' },
    { id: '6628872355949', pediId: '6628872290413', color: '#434052', name: 'Moonstruck' },
    { id: '6628872093805', pediId: '6628872126573', color: '#9fb0a9', name: 'Sage' },

    // {id: '4849003298925', pediId: '4849003364461', name: 'Jackpot'},
    // {id: '4752529752173', pediId: '4750108065901', color: '#f0ed74', name: 'Limencello'},
    // {id: '4881211129965', pediId: '4881212604525', color: '#fbaa00', name: 'Mango Lassi'},
    // {id: '4811817058413', pediId: '4811817844845', color: '#df5a38', name: 'Corduroy'},
    // {id: '4811819221101', pediId: '4811819647085', color: '#622dbd', name: 'Velour'},
    // {id: '4853050867821', pediId: '4853051228269', color: '#f1e4b2', name: 'Butter Cream'},
    // {id: '4752529916013', pediId: '4750105968749', color: '#2d59a5', name: 'Santorini Blue'},
  ],

  EMPTY_PRODUCT_TITLE: "DON'T DELETE - not visible",
  WELCOME_CARD_TRIFOLD_TITLE: 'Welcome Card Trifold',
  FREE_MAGIC_CUTICLE_PEN: 'Gift Magic Cuticle Pen',
  FREE_PINK_MINI_TOTE_BAG: 'Pink Mini Tote Bag',
  FREE_MIRELLA_TOP_COAT: 'Gift Mirella Top Coat',
  FREE_MAX_TOP_COAT: 'Gift Max Top Coat',
  WELCOME_CARD_TRIFOLD: 'Welcome Card Trifold',
  WELCOME_CARD: 'Welcome Card',
  EMPTY_PRODUCT: "DON'T DELETE - not visible",

  /*
  MAGIC_CUTICLE_PEN_ID: '39681691353197',
  MIRELLACOAT_VARIANT_ID: '33173256568941',
  MAXCOAT_VARIANT_ID: '33068755222637',
  OLD_WELCOME_VARIANT_ID: '32162452668525',
  WELCOME_VARIANT_ID: '32828268740717',
  PINK_MINI_TOTE_BAG_ID: '39651166552173',
  TEMPORARY_ID_1: '33068755222637', //Gift Max Top Coat 2
  TEMPORARY_ID_2: '39416035704941', //Glassy File
  */

  notEditableInCart: ['Gift Mirella Top Coat', 'Gift Mon Ami Clipper'],

  /*
  freeProduct: {
  },
  */

  /*
  variantIdMap: {
    RiseAndBloom: '33185875918957',
    CabernetInMarseille: '33185871364205',
    DesertPrism: '33185872085101',
    DejaVu: '33077890580589',
  },

  giftMirellaMinimumCart: 80,
  giftMirellaTopCoat: {
    title: 'Gift Mirella Top Coat',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/free-mirella.jpg?v=1606253820',
      },
      price: '0.00',
    },
  },

  giftMaxTopCoat: {
    title: 'Gift Max Top Coat',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/max-top-coat-gift.jpg?v=1602262489',
      },
      price: '0.00',
    },
  },
  */

  giftMaxTopCoatNo2: {
    title: 'Gift Max Top Coat No. 2',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/max-top-coat-gift.jpg?v=1602262489',
      },
      price: '0.00',
    },
  },

  /*
  giftCarePouch: {
    title: 'Care Pouch',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/MGK-Pouch_b.jpg?v=1620679317',
      },
      price: '0.00',
    },
  },
  carePouchThreshold: 50,
  giftToteBag: {
    title: 'Pink Mini Tote Bag',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/pink-tote-bag.jpg?v=1635381150',
      },
      price: '0.00',
    },
  },
  giftToteBagMinimumCart: 55,
  giftCuticlePenMinimumCart: 55,
  giftMagicCuticlePen: {
    title: 'Gift Magic Cuticle Pen',
    variant: {
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/pink-tote-bag.jpg?v=1635381150',
      },
      price: '0.00',
    },
  },
  */

  getBlackFriday: {
    startDate: new Date(2021, 10, 26, 0, 0, 0).toString(),
    endDate: new Date(2021, 10, 29, 23, 59, 59).toString(),
    discountPercent: 30,
  },

  // profileStatus: {
  //   STATUS_ACTIVE: 0,
  //   STATUS_DISABLE: 1,
  //   STATUS_DONE: 2
  // },

  giftsWithPurchase: [
    // {
    //   productTitle: 'Gift Max Top Coat No. 2',
    //   startDate: '01 Nov 2021 00:00:00 PST',
    //   endDate: '31 Dec 2021 23:59:59 PST',
    //   cartMinimum: 80.0,
    //   cartMaximum: null,
    //   productVariant: 33068755222637,
    // },
    {
      productTitle: 'Gift Mirella Top Coat',
      startDate: '01 Dec 2021 00:00:00 PST',
      endDate: '31 Dec 2021 23:59:59 PST',
      cartMinimum: 55.0,
      cartMaximum: null,
      productVariant: 33173256568941,
    },
    {
      productTitle: 'Gift Mon Ami Clipper',
      startDate: '01 Dec 2021 00:00:00 PST',
      endDate: '31 Dec 2021 23:59:59 PST',
      cartMinimum: 80.0,
      cartMaximum: null,
      productVariant: 39712731463789,
    },
  ],
};
