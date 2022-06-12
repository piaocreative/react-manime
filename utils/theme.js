export const theme = {
  breakpoints: [480, 720, 840, 960, 1024, 1280, 1440],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [9, 11, 12, 14, 16, 20, 24, 28, 32, 36, 48, 80, 96],
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5
  },
  letterSpacings: {
    normal: 'normal',
    tracked: '0.1em',
    tight: '-0.05em',
    mega: '0.25em'
  },
  fonts: {
    serif: 'athelas, georgia, times, serif',
    sansSerif:
      '"avenirBook", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif',
    avenirBook: 'avenirBook',
    avenirLight: 'avenirLight',
    avenirHeavy: 'avenirHeavy',
    avenirMedium: 'avenirMedium',
    avenirBlack: 'avenirBlack',
    gentiumBasic: 'gentiumBasic',
    Avenir: 'avenirBook',
  },
  borders: [0, '1px solid', '2px solid', '4px solid', '8px solid', '16px solid', '32px solid'],
  radii: [0, 2, 4, 16, 9999, '100%'],
  width: [16, 32, 64, 128, 256],
  heights: [16, 24, 36, 54, 80],
  maxWidths: [16, 32, 64, 128, 256, 512, 768, 1024, 2048, 5120],
  colors: {
    primary: '#F7BFA0',
    teal: '#2C4349',
    forecolor: [
      '#2C4349', // dark blue
      '#474746', // gray 
      '#F7BFA0', // error,
      '#F7BFA0', // orange,
      '#fff', // white,
      '#000', // black
      '#FF8181', // new Error
      '#59aa8e', // green
    ],
    black: '#000',
    'near-black': '#111',
    'dark-gray': '#333',
    'mid-gray': '#555',
    gray: ' #777',
    silver: '#999',
    'light-silver': '#aaa',
    'moon-gray': '#ccc',
    'light-gray': '#eee',
    'near-white': '#f4f4f4',
    white: '#fff',
    transparent: 'transparent',
    blacks: [
      'rgba(0,0,0,.0125)',
      'rgba(0,0,0,.025)',
      '#F7BFA0',
      'rgba(0,0,0,.1)',
      'rgba(0,0,0,.2)',
      'rgba(0,0,0,.3)',
      'rgba(0,0,0,.4)',
      'rgba(0,0,0,.5)',
      'rgba(0,0,0,.6)',
      'rgba(0,0,0,.7)',
      'rgba(0,0,0,.8)',
      'rgba(0,0,0,.9)'
    ],
    whites: [
      'rgba(255,255,255,.0125)',
      'rgba(255,255,255,.025)',
      'rgba(255,255,255,.05)',
      'rgba(255,255,255,.1)',
      'rgba(255,255,255,.2)',
      'rgba(255,255,255,.3)',
      'rgba(255,255,255,.4)',
      'rgba(255,255,255,.5)',
      'rgba(255,255,255,.6)',
      'rgba(255,255,255,.7)',
      'rgba(255,255,255,.8)',
      'rgba(255,255,255,.9)'
    ]
  },
  shadows: [
    '0 1px 3px 0 rgba(0,0,0,0.00)',
    '0 1px 3px 0 rgba(0,0,0,0.05)',
    '0 1px 3px 0 rgba(0,0,0,0.10)',
    '0 1px 3px 0 rgba(0,0,0,0.15)',
    '0 1px 3px 0 rgba(0,0,0,0.20)',
    '0 5px 10px 0 rgba(0,0,0,0.05)',
    '0 5px 10px 0 rgba(0,0,0,0.10)',
    '0 5px 10px 0 rgba(0,0,0,0.15)',
    '0 5px 10px 0 rgba(0,0,0,0.20)',
    '0 5px 10px 0 rgba(0,0,0,0.25)',
    '0 20px 50px 0 rgba(34,43,55,.1)'
  ]
};
