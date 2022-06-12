/// <reference types="cypress" />
const dotenvPlugin = require('cypress-dotenv');
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {

    if (browser.name === 'chrome') {


      // whatever you return here becomes the new args
      return launchOptions
    }

  })

  config  = dotenvPlugin(config)

}
