describe('Sign In', () => {
  it('should be able to sign in with a random user', () => {
    // Visit the sign-in page or URL
    cy.visit('http://localhost:3000/sign-in');

    // Check if the sign-in form is visible
    cy.get('.your-sign-in-form-class-name').should('be.visible');

    // Select a random user from the drop-down
    cy.get('.your-select-trigger-class-name').click(); // Replace with the actual class name of the select trigger
    cy.get('.your-select-item-class-name').then((items) => {
      const randomIndex = Math.floor(Math.random() * items.length);
      cy.wrap(items[randomIndex]).click();
    });

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if the user is signed in successfully
    cy.url().should('include', '/dashboard'); // Replace '/dashboard' with the URL you expect to be redirected to upon successful sign-in
  });
});
