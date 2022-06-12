import '@testing-library/cypress/add-commands';
import "cypress-real-events/support";
const base = Cypress.env('BASE_URL') ? 
  Cypress.env('BASE_URL') : `https://manime.co`
  
export function createNewUser(alreadyOnSignin = false){
  const newdate = new Date();
  const stringdate = newdate.getTime();
  const email = `manime+test.${stringdate}@dispostable.com`;
  alreadyOnSignin || cy.get('[data-testid="signin-button"]').click({force: true});

  cy.findByRole('button', { name: 'Continue' }, {timeout: 7000}).click();
  cy.findByPlaceholderText(/email address/i).type(email, {force: true});
  cy.findByRole('button', { name: 'Continue' }).click({force: true});
  cy.findByPlaceholderText(/first name/i).type('manime', {force: true});
  cy.findByPlaceholderText(/last name/i).type(`test ${stringdate}`, {force: true});
  cy.findByPlaceholderText(/password/i).type('123456', {force: true});
  cy.findByPlaceholderText(/phone number/i).type('1234567890', {force: true});
  cy.findByRole('button', { name: /join/i }).click({force: true});
  cy.location(`pathname`, {timeout : 75000}).should(`not.contains`, 'auth');

  return email;
}

export function signIn(email, password='123456', alreadyOnSignin=false, validatePostSignin=true){
  //!freshSession && cy.visit(`${base}`);
  !alreadyOnSignin && cy.get('[data-testid="signin-button"]', { timeout: 5500}).click({force: true});
  cy.contains(/let's get started/i);
  cy.findByPlaceholderText(/email address/i).type(email, {force: true});
  cy.findByRole('button', { name: 'Continue' }).click({force: true});
  cy.contains(/good to see you back/i, {timeout: 7500});
  cy.findByPlaceholderText(/password/i).type(password, {force: true});
  cy.findByRole('button', { name: /log in/i }).click({force: true});

  validatePostSignin && cy.get('[data-testid="account-button"]', { timeout: 6000 }).should('be.visible');
}

export function signOut(email){
  cy.visit(`${base}/auth?step=sign_out`);
  cy.get('[data-testid="signin-button"]', { timeout: 3000 }).should('be.visible');
  cy.visit(`${base}`);
  cy.wait(250);
} 
/**
 * Assumes cy has visited any page in manime.co that shows the cart count
 */
export function clearCart(waitTime = 500){
  cy.get('[data-testid="manibag-toggle"]')
    .eq(0)
    .click({ timeout: 200, force: true });
  cy.wait(waitTime)
  cy.findAllByTestId('empty-cart-button').eq(0).click({ force: true });

  cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 12500 }).should(
    'include.text',
    `0`
  ); 
  cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
    'include.text',
    `0`
  );
  cy.get('[data-testid="close-bag"]').click({
    force: true,
  });
  cy.wait(waitTime);


}

export function navToLink(link){
  cy.get('[id="header"]').within(() => {
    cy.findAllByText(/shop/i).should('be.visible');
    cy.findAllByRole('link', { name: /shop/i }).eq(0).trigger('mouseover');


    /*.then($el => {
        cy.wait(3000);
        cy.get(`[class*="shop-menu_container"]`);
        cy.wait(3000)
        cy.wrap($el).contains(/manis/i).click();
    
      })    */
    
  });
  cy.findAllByTestId(`${link}Link`).click({force: true});
  cy.wait(300);
 // cy.get('[id="header"]').click({force: true});
  //cy.wait(300);
    /*.then($el => {
        cy.wait(3000);
        cy.get(`[class*="shop-menu_container"]`);
        cy.wait(3000)
        cy.wrap($el).contains(/manis/i).click();
    
      })    */
    
 

    

}

export function toggleManibag(){
  cy.get('[data-testid="manibag-toggle"]')
  .eq(0)
  .click({ force: true });
cy.wait(300);
}

export function startNewSession(){
  cy.visit(`${base}`)
  cy.wait(1500);
}