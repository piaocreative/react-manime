const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
// const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const dotenvLoad = require('dotenv-load');
const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const { redirects } = require('./utils/redirects');
dotenvLoad();

module.exports = withPlugins([
  withBundleAnalyzer(
    withFonts({
      // cssModules: true,
      // i18n: {
      //   locales: ['en'],
      //   defaultLocale: 'en',
      // },
      webpack(config, options) {
        config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
        config.devtool = 'inline-source-map';
        //config.optimization.minimizer = [];
        //config.optimization.minimize = false;
        return config;
      },
    })
  ),

  [
    optimizedImages,
    {
      // these are the default values so you don't have to provide them if they are good enough for your use-case.
      // but you can overwrite them here with any valid value you want.
      env: {
        OUT_OF_STOCK_THRESHOLD: process.env.OUT_OF_STOCK_THRESHOLD || 0,
      },
      inlineImageLimit: 8192,
      imagesFolder: 'images',
      imagesName: '[name]-[hash].[ext]',
      handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
      optimizeImages: true,
      optimizeImagesInDev: false,
      mozjpeg: {
        quality: 80,
      },
      optipng: {
        optimizationLevel: 3,
      },
      crossOrigin: 'anonymous',
      pngquant: false,
      gifsicle: {
        interlaced: true,
        optimizationLevel: 3,
      },
      svgo: {
        // enable/disable svgo plugins here
      },
      webp: {
        preset: 'default',
        quality: 75,
      },
    },
  ],
  [redirects],
]);
