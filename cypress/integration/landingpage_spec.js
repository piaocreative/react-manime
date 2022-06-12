import '@testing-library/cypress/add-commands';

const base = Cypress.env('BASE_URL') ? 
  Cypress.env('BASE_URL') : `https://www.manime.co`

let menuLinkCount = 0;

describe(` Verifying all links on Landing page on. ${base}`, () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  });

  before(()=>{
    cy.visit(`${base}/`);
    cy.get('[data-testid="menu-list"]').findAllByTestId('menu-list-link', { timeout: 5500 })
      .then( lists =>{
        menuLinkCount = Cypress.$(lists).length
      })
  })

  beforeEach(() => {
    cy.visit(`${base}/`);
  });

  it(`checking that the home page renders`, () => {
    cy.get('[id*="homepage-render"]').should('be.visible');
  })

  it('Should show the promotion bar in a closed state', () => {
    cy.get('[class=slick-list]').should('be.visible');
    cy.get('[alt=close]').eq(0).click();
    cy.findByText(/free shipping on orders over/i).should('not.exist');
    cy.findByText(/happiness guarantee/i).should('not.exist');  
  });

  it('Should show the refer friends bar with the right link', () => {
    cy.get('[class*="PrimaryPromotionBar"]', {timeout: 90000}).should('be.visible');
    cy.get('[class*="SecondaryPromotionBar"]', {timeout: 90000}).should('be.visible');
  });

  it(`Should show the menu bar with the right links run `, () => {
    cy.get('[class*="Common__TopNavbar"]').should('be.visible');

    cy.get('[class*="Common__TopNavbar"]').within(() => {
      cy.get('[class*="Common__Logo"]').should('have.attr', 'src').and('include', '/static/icons/manime-logo.svg');
      cy.get('[class*="Common__Logo"]').parent().should('have.attr', 'href').and('include', '/');
      cy.findByRole('link', {name: /shop/i }).should('have.attr', 'href').and('include', '/shop');
      cy.findByRole('link', {name: /gift/i}).should('have.attr', 'href').and('include', '/gift');
      cy.findByRole('link', {name: /How To/i}).should('have.attr', 'href').and('include', '/how-to-apply');
      cy.findByText(/about/i).should('be.visible');
      cy.findByText(/sign in/i).should('be.visible');
      cy.findByRole('img', { name: /nail\-bag/i }).parent().find('div').should('have.text', '0');
    });
  });

  it('Should show the footer with the right links', () => {
    cy.get('[class*="AppFooter__Footer"]').eq(0).should('be.visible');
      
    cy.get('[class*="AppFooter__Footer"]').eq(0).within(() => {
      cy.get('[class*="__Logo"]').should('have.attr', 'src').and('include', '/static/images/white-logo.png');
      cy.get('[class*="__Logo"]').parent().should('have.attr', 'href').and('include', '/');
      cy.findByText(/© 2021 ManiMe/i).should('be.visible');
      cy.findByRole('link', {name: /Privacy Policy/i}).should('have.attr', 'href').and('include', '/privacy');
      cy.findByRole('link', {name: /Terms of Use/i}).should('have.attr', 'href').and('include', '/terms');
  
      cy.findByRole('link', {name: /How To/i}).should('have.attr', 'href').and('include', '/how-to-apply');
      cy.findByRole('link', {name: /about us/i}).should('have.attr', 'href').and('include', '/about-us');
      cy.findByRole('link', {name: /faq/i}).should('have.attr', 'href').and('include', '/faq');
    
      cy.findByRole('link', {name: /Instagram/i}).should('have.attr', 'href').and('include', 'https://www.instagram.com/manime.co/?hl=en');
      cy.findByRole('link', {name: /Facebook/i}).should('have.attr', 'href').and('include', 'https://www.facebook.com/ManiMe.co/');
      cy.findByRole('link', {name: /blog/i}).should('have.attr', 'href').and('include', '/blog');
    
      cy.findByText(/CONTACT US/i).should('be.visible');
      cy.findByText(/CUSTOMER HAPPINESS/i).should('be.visible');
      cy.findByRole('link', {name: /care@manime.co/i}).should('have.attr', 'href').and('include', 'mailto:care@manime.co');
      cy.findByText(/\(213\) 340 \- 0364/i).should('be.visible');
      cy.findByText(/PR \+ PARTNERSHIPS/i).should('be.visible');
      cy.findByRole('link', {name: /press@manime.co/i}).should('have.attr', 'href').and('include', 'mailto:care@manime.co');
    });
  });
/*
retire this test becase the counts are always changing. 
  it('Should count the shop menu with the right sub-menus', () => {
    cy.findAllByText(/shop/i).should('be.visible');
    cy.findAllByRole('link', { name: /shop/i }).eq(1).trigger('mouseover').then(($menuShop) => {
      cy.log('Menu Shop:', $menuShop);
    });
    cy.get('[class*="shop-menu_container"]').within(() => {
      const submenu_counters = require('../fixtures/shop_submenu_counters');
      submenu_counters.forEach((submenu_counter) => {
        const column_rx = new RegExp(submenu_counter.column, 'i');
        cy.findAllByText(column_rx).parent().find('a').should('to.be.greaterThan', submenu_counter.counter);
      });
    });    
  });
*/
  it(`Visiting all links in shop menu and verifying they have proper structure and not 404 `,{
    retries: {
      runMode: 2,
      openMode: 1,
    },
  }, ()=>{

    for(let i=0; i < menuLinkCount; i++){

        console.log('menuLinkCount is ' + menuLinkCount);
        cy.get('[id="header"]').within(() => {
          cy.findAllByText(/shop/i).should('be.visible');
          cy.findAllByRole('link', { name: /shop/i }).eq(0).trigger('mouseover');
        });
        http://localhost/essentials#:~:text=NEW-,ESSENTIALS,-MANIS 
        cy.findAllByTestId('menu-list-link', { timeout: 5500 })
          .eq(i)
          .then( link =>{
            const current_href = link.attr('href');
            cy.wrap(link).click({force: true});
            cy.location(`pathname`, {timeout : 75000}).should(`contains`, current_href);
          })

    };
  })
})
    
