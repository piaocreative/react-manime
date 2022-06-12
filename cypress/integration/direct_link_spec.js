import '@testing-library/cypress/add-commands';
import { signIn } from '../utils'
const base = Cypress.env('BASE_URL') ? 
  Cypress.env('BASE_URL') : `https://manime.co`


describe(` Verifying the direct link access on ${base}`, () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  });

  const direct_link_cases = require(`../fixtures/direct_link_cases`);
  direct_link_cases.forEach((direct_link_case) => {
    it(`Visiting ${direct_link_case.name_case} page`, () => {
      cy.visit(`${base}${direct_link_case.url}`);

      if(direct_link_case.req_auth){
        signIn('manime+test.mani.pedi@dispostable.com', '123456', true, direct_link_case.validatePostSignin );
      };
      cy.location('pathname', {timeout: 60000}).should('contains', direct_link_case.url);
      cy.get(`[class*="${direct_link_case.class_assrt}"]`).should('be.visible');
    });

  });
});