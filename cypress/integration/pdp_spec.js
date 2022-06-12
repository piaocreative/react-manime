import '@testing-library/cypress/add-commands';

const base = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') : `https://manime.co`;

const pageCount = 10;
let toVisitIndex = 0;
let visitedIndicies = [];
before(() => {
  cy.visit(`${base}/shop`);

  cy.findAllByTestId('product-item').then(allproducts => {
    var totalproducts = Cypress.$(allproducts).length;

    let pagesAdded = 0;
    let loops = 0;
    while (pagesAdded < pageCount && loops <= totalproducts) {
      const toVisitIndex = Math.floor(Math.random() * totalproducts); // not sure if this was instantiated elsewhere or not
      if (!visitedIndicies.includes(toVisitIndex)) {
        visitedIndicies.push(toVisitIndex);
        pagesAdded++;
      }
      loops++;
    }
  });
});

describe(`Verify Main elements of ${pageCount} random pdp pages`, () => {
  beforeEach(() => {
    cy.get('[data-testid="Shop-link"]').click({
      force: true,
    });
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  for (let i = 0; i < pageCount; i++) {
    it(
      `Verifying product ${i + 1}`,
      {
        retries: {
          runMode: 2,
          openMode: 1,
        },
      },
      () => {
        cy.findAllByTestId('product-item').eq(visitedIndicies[i]).click({ force: true });
        // cy.get(`[class*="product-item_productItem"]`).eq(i).click({ force: true });

        cy.get('[class*="styled__SmallImg"]').each((small_image, i, all_small_images) => {
          expect(small_image.attr(`src`)).to.exist;
        });

        cy.get('[class*="styled__ProductImage"]').should(`to.exist`);

        cy.get(`[class*="styled__ProductInfo"]`).then($body => {
          if ($body.find('[class*="instruction_menuItem"]').text().includes(`Details`)) {
            cy.get('[class*="instruction_menuItem"]')
              .eq(0)
              .within(() => {
                cy.get('[class*="instruction_plusMinus"]').click().should(`have.text`, `+`);
                cy.get('[class*="instruction_plusMinus"]').click().should(`have.text`, `−`);
              });
          }
          if ($body.find('[class*="instruction_menuItem"]').text().includes(`How`)) {
            cy.get('[class*="instruction_menuItem"]')
              .eq(1)
              .within(() => {
                cy.get('[class*="instruction_plusMinus"]').click().should(`have.text`, `−`);
                cy.get('[class*="instruction_plusMinus"]').click().should(`have.text`, `+`);
              });
          }
          if ($body.find(`[class*="styled__BagButton"]`).text().includes(`ADD`)) {
            cy.get('[class*="styled__QuantityButtonBox"]').within(() => {
              cy.get('[class*="styled__StepButton"]').eq(1).click();
              cy.contains(`2`).should(`be.visible`);
              cy.get('[class*="styled__StepButton"]').eq(0).click();
              cy.contains(`1`).should(`be.visible`);
            });
          }
        });
        cy.get('[class*="styled__BagButton"]').should(`be.visible`);

        cy.get(`[class*="styled__BackButton"]`).click({ force: true });
      }
    );
  }
});
