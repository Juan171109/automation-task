// cypress/support/commands.js

// Command to clear localStorage and reset state
Cypress.Commands.add('resetState', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('basket')
  })
})

// Enhanced command to login with credentials from environment variables
Cypress.Commands.add('login', (username, password) => {
  // If credentials are not provided explicitly, get them from environment
  const usr = username || Cypress.env('USERNAME')
  const pwd = password || Cypress.env('PASSWORD')
  
  // Verify credentials exist
  if (!usr || !pwd) {
    throw new Error('Username or password is missing. Make sure to set CYPRESS_USERNAME and CYPRESS_PASSWORD environment variables or provide them in cypress.env.json')
  }
  
  cy.visit('/index.html')
  cy.get('#username').type(usr)
  cy.get('#password').type(pwd)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/shop')
})

// Command to use session to preserve login state between tests
Cypress.Commands.add('loginBySession', () => {
  cy.session(['user1', 'default-session'], () => {
    cy.login()
  })
  cy.visit('/shop.html')
})

// Command to add a specific product to basket
Cypress.Commands.add('addProductToBasket', (productName) => {
  cy.contains('.product-card', productName).within(() => {
    cy.get('button').contains('Add to Basket').click()
  })
})

// Command to verify alerts (and handle them)
Cypress.Commands.add('verifyAlert', (expectedText) => {
  const stub = cy.stub()
  cy.on('window:alert', stub)
  return cy.wrap(stub).should('be.calledWith', expectedText)
})

// Command to search products
Cypress.Commands.add('searchProducts', (searchTerm) => {
  cy.get('#searchInput').clear().type(searchTerm)
  cy.get('button').contains('Search').click()
})

// Command to verify specific product properties
Cypress.Commands.add('verifyProductDetails', (productCard) => {
  cy.wrap(productCard).within(() => {
    cy.get('img').should('be.visible')
    cy.get('h3').should('be.visible')
    cy.get('p').contains('Code: P').should('be.visible')
    cy.get('p').contains('Price: $').should('be.visible')
    cy.get('p').contains('UOM:').should('be.visible')
    cy.get('p').contains('Qty:').should('be.visible')
    cy.get('button').contains('Add to Basket').should('be.visible')
  })
})