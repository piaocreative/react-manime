import '@testing-library/cypress/add-commands';

const base = Cypress.env('BASE_URL')
  ? Cypress.env('BASE_URL')
  : `https://www.manime.co`;

describe(`How to apply page`, () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it(`How to Apply banner elements`, () => {
    cy.visit(`${base}/how-to-apply`);
    cy.get(`[class*="how-to-apply-fixed-header_container"]`).within(() => {
      cy.get(`[class*="stepIcon"]`).then((allicons) => {
        for (var i = 0; i < Cypress.$(allicons).length; i++) {
          cy.get(`[class*="stepIcon"]`, {timeout: 75000}).eq(i).should(`have.attr`, `src`);
          cy.get(`[class*="stepName"]`, {timeout: 75000}).eq(i).should(`be.visible`);
          cy.get(`[class*="shortName"]`, {timeout: 75000}).eq(i).should(`be.visible`);
        }
      });
    });
  });

  it(`Section has video and details`, () => {
    cy.visit(`${base}/how-to-apply`);
    cy.get(`[id*="section"]`).then((allsections) => {
      for (var i = 0; i < Cypress.$(allsections).length; i++) {
        cy.get(`[id*="section"]`)
          .eq(i)
          .within(() => {
            cy.get(`[class*="how-to-apply-video-section"]`)
              .should(`have.attr`, `autoplay`)
              .and(`to.be`, true);
            cy.get(`[class*="stepName"]`).should(`be.visible`);
            cy.get(`[class*="fullName"]`).should(`be.visible`);
            cy.get(`[class*="descriptionPanel"]`).should(`be.visible`);
          });
      }
    });
  });

  it(`FAQ section is expanded collpased`, () => {
    cy.visit(`${base}/how-to-apply`);
    cy.get(`[class*="howto-faq101_container"]`).within(() => {
      cy.get(`[class*="howto-faq101_title_"]`).should(`be.visible`);
      cy.get(`[class*="howto-faq101_moreQuestions"]`).should(`be.visible`);
      cy.get(`[class*="howto-faq101_question"]`).then((allfaqs) => {
        for (var i = 0; i < Cypress.$(allfaqs).length; i++) {
          cy.get(`[class*="howto-faq101_question"]`).eq(i).should(`be.visible`);
          cy.get(`[class*="howto-faq101_question"]`)
            .eq(i)
            .click({ force: true });
          cy.get(`[class*="howto-faq101_collapse"]`).eq(i).should(`be.visible`);
          cy.get(`[class*="howto-faq101_content"]`).eq(i).should(`be.visible`);
        }
      });
    });
  });
});
