import '@testing-library/cypress/add-commands';
import {
  signIn,
  createNewUser,
  navToLink,
  toggleManibag,
  clearCart,
  signOut,
  startNewSession,
} from '../utils';
const base = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') : `https://www.manime.co`;

describe(` Verifying the sign-in`, () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    cy.visit(`${base}/essentials`);
  });

  it(
    'should validate input fields on signup form',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      cy.get('[data-testid="signin-button"]').click({ force: true });
      cy.contains(/let's get started/i);
      cy.findByRole('button', { name: 'Continue' }).click();
      cy.findByText(/please enter your email/i).should('be.visible');
      cy.findByPlaceholderText(/email address/i).type('manime+test,002@dispostable,com', {
        force: true,
      });
      cy.findByRole('button', { name: 'Continue' }).click();
      cy.findByText(/Invalid email/i).should('be.visible');
      cy.findByPlaceholderText(/email address/i).type('{selectall}rill+test.002@dispostable.com', {
        force: true,
      });
      cy.findByRole('button', { name: 'Continue' }).click();
      cy.contains(/good to see you back/i);
      cy.findByRole('button', { name: /log in/i }).click({ force: true });
      cy.findByText(/Password required/i).should('be.visible');
      cy.findByPlaceholderText(/password/i).type('1234');
      cy.findByRole('button', { name: /log in/i }).click({ force: true });
      cy.findByText(/Incorrect username or password/i).should('be.visible');
    }
  );

  it(
    'Sign up should validate fields and block creaton if bad',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      cy.get('[data-testid="signin-button"]').click({ force: true });
      cy.contains(/let's get started/i);
      cy.findByRole('button', { name: 'Continue' }).click();
      cy.findByText(/please enter your email/i).should('be.visible');
      cy.findByPlaceholderText(/email address/i).type('notexist@dispostable.com', { force: true });
      cy.findByRole('button', { name: 'Continue' }).click();
      cy.contains(/EXCITED TO GET TO KNOW YOU/i);
      cy.findByRole('button', { name: /join/i }).click({ force: true });
      cy.findByText(/First name required/i).should('be.visible');
      cy.findByText(/last name required/i).should('be.visible');
      cy.findByText(/Password required/i).should('be.visible');
      cy.findByText(/Phone Number required/i).should('be.visible');
      cy.findByPlaceholderText(/first name/i).type('fname', { force: true });
      cy.findByPlaceholderText(/last name/i).type('lname', { force: true });
      cy.findByPlaceholderText(/password/i).type('1', { force: true });
      cy.findByRole('button', { name: /join/i }).click({ force: true });
      cy.findByText(/Password has to be at least 6 characters long/i).should('be.visible');
      cy.findByPlaceholderText(/password/i).type('23456', { force: true });
      cy.findByRole('button', { name: /join/i }).click({ force: true });
      cy.findByPlaceholderText(/phone number/i).type('12345678', { force: true });
      cy.findByRole('button', { name: /join/i }).click({ force: true });
      cy.findByRole('button', { name: /join/i }).click({ force: true });
      cy.findByText(/Phone Number required/i).should('be.visible');
    }
  );

  it(
    'Should sign-up create new account',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      const email = createNewUser();

      cy.get('.iaoodT', { timeout: 60000 }).should('not.exist');
      cy.contains(/continue with your mobile/i, { timeout: 40000 }).should('be.visible');
    }
  );

  it(
    'Initiate signin from PAGE should end on PAGE',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signIn('rill+test.002@dispostable.com', '123456', false, true);
      cy.findByRole('button', { name: /account/i }).should('be.visible');
      cy.location('pathname', { timeout: 6000 }).should('include', '/essentials');
    }
  );

  it(
    'Checkout with mani/pedi in bag and complete profiles',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signIn('manime+test.mani.pedi@dispostable.com', '123456', false, true);
      cy.wait(3000);
      clearCart();
      // add mani
      navToLink('manicures');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .click({ force: true });
      cy.wait(300);
      toggleManibag();

      // add pedi
      navToLink('pedicures');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .click({ force: true });
      cy.wait(300);
      toggleManibag();

      // add essential
      navToLink('essentials');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .click({ force: true });
      cy.wait(1500);

      cy.findByRole('button', { name: /checkout/i }, { timeout: 3000 }).click();
      cy.wait(3000);
      cy.location('pathname', { timeout: 6000 }).should('include', '/checkout');
      cy.contains(/shipping info/i);

      cy.findByDisplayValue(/manime, 2219 main st, , santa monica, ca, 90405/i).should(
        'be.visible'
      );
      cy.findByRole('button', { name: /continue to payment info/i }).should('be.visible');
    }
  );

  it(
    'User with no profiles can checkout Essentials only',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(5000);
      signIn('manime+test.mani.pedi@dispostable.com', '123456', false, false);
      cy.wait(6000);
      clearCart();
      navToLink('essentials');

      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .click({ force: true });
      cy.wait(1500);
      cy.get('[data-testid="mani-bag"]');

      cy.findByRole('button', { name: /checkout/i }, { timeout: 3000 }).click();
      cy.wait(3000);
      cy.location('pathname', { timeout: 60000 }).should('include', '/checkout');
      cy.contains(/shipping info/i);
      cy.findByDisplayValue(/manime, 2219 main st, , santa monica, ca, 90405/i).should(
        'be.visible'
      );
      cy.findByRole('button', { name: /continue to payment info/i }).should('be.visible');
    }
  );

  it(
    'checkout with mani items and unauth, create account, should be entered into fitflow',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(1000);
      navToLink('manicures');
      cy.findAllByTestId('product-item-cta', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.wait(300);
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });
      cy.findByRole('button', { name: 'Continue', timeout: 30000 });
      createNewUser(true);
      cy.contains(/continue with your mobile/i, { timeout: 30000 }).should('be.visible');
    }
  );

  it(
    'With pedi item in bag and unauth, checkout',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('pedicures');

      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      createNewUser(true);
      cy.contains(/continue with your mobile/i, { timeout: 60000 }).should('be.visible');
    }
  );

  it(
    'With mani item in bag and unauth, checkout and sign into account with no mani profile',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('manicures');

      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      signIn('manime+test.pedi@dispostable.com', '123456', true, false);

      cy.contains(/continue with your mobile/i).should('be.visible');
      startNewSession();
      cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
        'not.include.text',
        `0`
      );
      clearCart();
    }
  );

  it(
    'With Essential in bag and unauth user, checkout and sign into account with valid no valid profile',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('essentials');

      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      signIn(`manime+test.mani@dispostable.com`, '123456', true, false);

      cy.contains(/02 - PAYMENT INFO/i).should('be.visible');
      startNewSession();
      cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
        'not.include.text',
        `0`
      );
      clearCart();
    }
  );

  it(
    'With Essential in bag and unauth user, checkout and sign into account with valid no valid profile',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('essentials');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      signIn('manime+test.nomani.nopedi@dispostable.com', '123456', true, false);

      cy.location('pathname', { timeout: 60000 }).should('contains', '/checkout');
      startNewSession();
      cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
        'not.include.text',
        `0`
      );
      clearCart();
    }
  );

  it(
    'With Mani in bag and unauth user, checkout and sign into account with valid mani profile',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('manicures');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      signIn(`manime+test.mani@dispostable.com`, '123456', true, false);
      cy.location('pathname', { timeout: 60000 }).should('contains', '/checkout');
      startNewSession();
      cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
        'not.include.text',
        `0`
      );
      clearCart();
    }
  );

  it(
    'Should checkout Pedi item an auth user with Pedi Profile',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      signOut();
      cy.wait(3000);
      navToLink('pedicures');
      cy.findAllByRole('button', { name: /add to bag/i })
        .first()
        .should('be.visible', { timeout: 7000 })
        .click();
      cy.get(`[data-testid="manibag-count-cart"]`, { timeout: 7500 }).should(
        'not.include.text',
        `0`
      );
      cy.findByRole('button', { name: /checkout/i, timeout: 6000 })
        .should('be.visible')
        .click({ force: true });

      signIn(`manime+test.pedi@dispostable.com`, '123456', true, false);
      cy.location('pathname', { timeout: 60000 }).should('contains', '/checkout');
      startNewSession();
      cy.get(`[data-testid="manibag-count-header-desktop"]`, { timeout: 12500 }).should(
        'not.include.text',
        `0`
      );
      clearCart();
    }
  );
});
