What is Cypress?
================
Cypress is most often compared to Selenium; however, Cypress is both fundamentally and architecturally different. Cypress is not constrained by the same restrictions as Selenium.

 

This enables you to write faster, easier and more reliable tests.

 

Deploying Cypress on local repository
=====================================
This guide will take as sample the manime-web local repository and will intent to guide to deploy the cypress in it.

Please follow the below steps to deploy cypress:
------------------------------------------------
# Go to your local repository
# Obtain the most recently code
$ git pull
…
# install the cypress dependencies
$ sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
# need to run this on ubuntu server too to get the sound emulator and eliminate test errors
sudo apt install pulseaudio
# install the Cypress Testing Library
# Cypress Testing Library allows the use of dom-testing queries within Cypress end-to-end browser tests.
$ npm install --save-dev @testing-library/cypress
# Install cypress
$ npm install -y cypress
…
> cypress@6.8.0 postinstall /home/myadmin/code/manime-web/node_modules/cypress
> node index.js --exec install

Installing Cypress (version: 6.8.0)

  ✔  Downloaded Cypress
  ✔  Unzipped Cypress
  ✔  Finished Installation /home/myadmin/.cache/Cypress/6.8.0

You can now open Cypress by running: node_modules/.bin/cypress open

https://on.cypress.io/installing-cypress
------------------------------------------------

Your tests should be included by default on:
$ cypress/integration

It can be executed using the cypress UI:
$ npx cypress open

Or executed directly the e2e test
$ npx cypress run --specc