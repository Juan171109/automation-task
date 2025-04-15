// cypress/e2e/login.cy.js
import LoginPage from '../pages/LoginPage'

describe('Login Page', () => {
  beforeEach(() => {
    LoginPage.visit()
  })
  
  it('should show the login form', () => {
    cy.get(LoginPage.usernameInput).should('be.visible')
    cy.get(LoginPage.passwordInput).should('be.visible')
    cy.get(LoginPage.submitButton).should('be.visible')
  })
  
  it('should login with valid credentials', () => {
    // Using environment variables for credentials
    const username = Cypress.env('USERNAME') || 'user1'
    const password = Cypress.env('PASSWORD') || 'user1'
    
    LoginPage
      .typeUsername(username)
      .typePassword(password)
      .submit()
    
    // Verify redirection to shop page
    cy.url().should('include', '/shop')
  })
  
  it('should show error message with invalid credentials', () => {
    LoginPage
      .typeUsername('wronguser')
      .typePassword('wrongpass')
      .submit()
    
    // Verify error message
    LoginPage.verifyErrorMessage('Invalid username or password')
    
    // Verify we stay on login page
    cy.url().should('include', '/')
  })
  
  it('should require username and password fields', () => {
    // HTML5 validation check (required attribute)
    cy.get(LoginPage.usernameInput).should('have.attr', 'required')
    cy.get(LoginPage.passwordInput).should('have.attr', 'required')
    
    // Try submitting with empty fields
    LoginPage.submit()
    cy.url().should('include', '/')
  })
})