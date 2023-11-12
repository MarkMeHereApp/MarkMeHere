/// <reference types="cypress" />

context('LoginDemo', () => {
  beforeEach(() => {
    cy.exec('npx prisma db seed');
    cy.visit('http://localhost:3000/landing-page');
  });

  // click view demo button
  it('click on View Demo button and verify redirection', () => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    // Click on the "View Demo" button
    cy.contains('View Demo').click();

    // Wait for the redirection to occur and assert the URL
    cy.url().should(
      'include',
      'http://localhost:3000/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdemo'
    );

    cy.contains('Select a Demo Account').should('exist');
    cy.contains('Select a Demo Account').click();
    cy.contains('sam@demo.com').should('exist');
    cy.contains('sam@demo.com').click();

    cy.url().should('include', 'http://localhost:3000/demo');

    cy.contains('Import From Canvas (optional)').click();
    cy.contains('UCF Attend Testing Course').click();

    cy.contains('Submit').click();
  });
});
