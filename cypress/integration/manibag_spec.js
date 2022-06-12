import '@testing-library/cypress/add-commands';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { uuid } from 'uuid';
import { createNewUser, signIn, signOut, clearCart } from '../utils';

// TODO: Add a test to ensure that preview products are NOT shoppable

const base = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') : `https://manime.co`;

let email = '';
before(() => {
  cy.visit(`${base}/`);
  email = createNewUser();

  cy.contains(/continue with your mobile/i, { timeout: 30000 }).should('be.visible');
  signOut();
});
const productGroups = require(`../fixtures/manibag_cases`);

describe(` Verifying the ManiBag as unauthenticated user on ${base}`, () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  productGroups.forEach(productGroup => {
    describe(`Checking ${productGroup.title}`, () => {
      it('Navigating ', () => {
        // visit in a test starts a new session
        cy.visit(`${base}${productGroup.url}`);
        // to let the page get inialized
        cy.wait(2500);
      });
      productGroup.testCases.forEach(manibag_case => {
        it(`Should add ${manibag_case.name_case} in ManiBag`, () => {
          clearCart();

          var j = 0;

          for (var i = 0; i < manibag_case.nbr_items; i++) {
            cy.findAllByTestId('product-item-cta', { timeout: 5500 }).eq(j).click({ force: true });
            cy.wait(300);
            cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
              'include.text',
              `${i + 1}`
            );
            cy.get('[data-testid="close-bag"]').click({
              force: true,
            });
            cy.wait(300);
            cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 7500 }).should(
              'include.text',
              `${i + 1}`
            );

            if (manibag_case.diff_item) {
              j++;
            }
          }
          cy.wait(200);

          cy.get('[data-testid="manibag-toggle"]').eq(0).click({ force: true });
          cy.wait(300);
          cy.findAllByTestId('remove-line-item').should(
            'have.length',
            manibag_case.diff_item ? manibag_case.nbr_items : 1
          );
        });
      });
    });
  });
});

describe(` Verifying the ManiBag as authenticated user on ${base}`, () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('Init sign in ', () => {
    signIn(email);
  });

  productGroups.forEach(productGroup => {
    describe(`Checking ${productGroup.title}`, () => {
      it('Navigating ', () => {
        // visit in a test starts a new session
        cy.visit(`${base}${productGroup.url}`);
        // to let the page get inialized
        cy.wait(2500);
      });
      productGroup.testCases.forEach(manibag_case => {
        it(
          `Should add ${manibag_case.name_case} in ManiBag`,
          {
            retries: {
              runMode: 2,
              openMode: 1,
            },
          },
          () => {
            clearCart();
            var j = 0;

            for (var i = 0; i < manibag_case.nbr_items; i++) {
              cy.findAllByTestId('product-item-cta', { timeout: 5500 })
                .eq(j)
                .click({ force: true });
              cy.wait(300);
              cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
                'include.text',
                `${i + 1}`
              );
              cy.get('[data-testid="close-bag"]').click({
                force: true,
              });
              cy.wait(300);
              cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 7500 }).should(
                'include.text',
                `${i + 1}`
              );

              if (manibag_case.diff_item) {
                j++;
              }
            }

            cy.get('[data-testid="manibag-toggle"]').eq(0).click({ force: true });
            cy.wait(300);
            cy.findAllByTestId('remove-line-item').should(
              'have.length',
              manibag_case.diff_item ? manibag_case.nbr_items : 1
            );
          }
        );
      });
    });
  });
});

describe(` Verifying the ManiBag count after merge on ${base}`, () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const manibag_cases = require(`../fixtures/manibag_cases`);

  it(`Testing cart merge from unauth to auth`, () => {
    cy.visit(`${base}`);
    signIn(email);
    clearCart();

    cy.visit(`${base}/shop`);
    cy.wait(2500);

    // add to anon bag
    cy.findAllByTestId('product-item-cta', { timeout: 5500 }).eq(0).click({ force: true });
    cy.wait(300);
    cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 17500 }).should('include.text', '1');
    cy.get('[data-testid="close-bag"]').click({ force: true });
    cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 17500 }).should(
      'include.text',
      '1'
    );
    signOut();
    cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 17500 }).should(
      'include.text',
      '0'
    );

    cy.visit(`${base}/shop`);
    cy.wait(2500);
    cy.findAllByTestId('product-item-cta', { timeout: 2500 }).eq(1).click({ force: true });
    cy.wait(300);
    cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 17500 }).should('include.text', '1');
    cy.get('[data-testid="close-bag"]').click({ force: true });
    cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 17500 }).should(
      'include.text',
      '1'
    );
    signIn(email);
    cy.wait(2500);

    cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 17500 }).should(
      'include.text',
      '2'
    );
    cy.get('[data-testid="manibag-toggle"]').eq(0).click({ force: true });
    cy.wait(500);
    cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 17500 }).should('include.text', '2');

    cy.findAllByTestId('remove-line-item').should('have.length', 2);

    signOut();
  });
});
