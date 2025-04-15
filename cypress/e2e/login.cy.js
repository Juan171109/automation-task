// cypress/e2e/login.spec.js

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  
  it('should show the login form', () => {
    cy.get('#loginForm').should('be.visible')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
  
  it('should login with valid credentials', () => {
    cy.get('#username').type('user1')
    cy.get('#password').type('user1')
    cy.get('button[type="submit"]').click()
    
    // Verify redirection to shop page
    cy.url().should('include', '/shop')
  })
  
  it('should show error message with invalid credentials', () => {
    cy.get('#username').type('wronguser')
    cy.get('#password').type('wrongpass')
    cy.get('button[type="submit"]').click()
    
    // Verify error message
    cy.get('#errorMessage').should('be.visible')
      .and('have.text', 'Invalid username or password')
    
    // Verify we stay on login page
    cy.url().should('include', '/')
  })
  
  it('should require username and password fields', () => {
    // HTML5 validation check (required attribute)
    cy.get('#username').should('have.attr', 'required')
    cy.get('#password').should('have.attr', 'required')
    
    // Try submitting with empty fields
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/')
  })
})