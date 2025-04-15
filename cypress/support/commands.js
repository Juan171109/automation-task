// cypress/support/commands.js

// This file contains custom commands and overrides for Cypress tests

// Command to clear localStorage and reset state
Cypress.Commands.add('resetState', () => {
    cy.window().then((win) => {
      win.localStorage.removeItem('basket')
    })
  })

// Command to login with the default credentials
Cypress.Commands.add('login', () => {
    cy.visit('/index.html')
    cy.get('#username').type('user1')
    cy.get('#password').type('user1')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', 'shop.html')
})

  // Command to add a specific product to basket
Cypress.Commands.add('addProductToBasket', (productCode) => {
    cy.contains('.product-card', productCode).within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
  })