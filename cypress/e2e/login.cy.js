// cypress/e2e/login.cy.js
import LoginPage from '../pages/loginPage'

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
    // Clear any existing session
    cy.window().then(win => {
      win.sessionStorage.clear()
      win.localStorage.removeItem('basket')
    })
  })
  
  it('should show the login form with all required elements', () => {
    // Verify form and all elements are visible
    cy.get('#loginForm').should('be.visible')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    
    // Verify form labels
    cy.contains('label', 'Username').should('be.visible')
    cy.contains('label', 'Password').should('be.visible')
    
    // Verify button text
    cy.get('button[type="submit"]').should('have.text', 'Login')
  })
  
  it('should login with valid credentials', () => {
    // Login using POM and environment variables
    LoginPage
      .typeUsername(Cypress.env('USERNAME'))
      .typePassword(Cypress.env('PASSWORD'))
      .submit()
    
    // Verify redirection to shop page
    cy.url().should('include', '/shop')
  })
  
  it('should show error message with invalid username', () => {
    LoginPage
      .typeUsername('wronguser')
      .typePassword(Cypress.env('PASSWORD'))
      .submit()
    
    // Verify error message
    LoginPage.verifyErrorMessage('Invalid username or password')
    
    // Verify we stay on login page
    cy.url().should('include', '/')
    
    // Verify no session was created
    cy.window().then(win => {
      expect(win.sessionStorage.getItem('userSession')).to.be.null
    })
  })
  
  it('should show error message with invalid password', () => {
    LoginPage
      .typeUsername(Cypress.env('USERNAME'))
      .typePassword('wrongpass')
      .submit()
    
    // Verify error message
    LoginPage.verifyErrorMessage('Invalid username or password')
    
    // Verify we stay on login page
    cy.url().should('include', '/')
  })
  
  it('should require username field', () => {
    // HTML5 validation check (required attribute)
    cy.get('#username').should('have.attr', 'required')
    
    // Try submitting with empty username
    LoginPage
      .typePassword(Cypress.env('PASSWORD'))
      .submit()
    
    // Should not navigate away
    cy.get('#loginForm').should('be.visible')
  })
  
  it('should require password field', () => {
    // HTML5 validation check (required attribute)
    cy.get('#password').should('have.attr', 'required')
    
    // Try submitting with empty password
    LoginPage
      .typeUsername(Cypress.env('USERNAME'))
      .submit()
    
    // Should not navigate away
    cy.get('#loginForm').should('be.visible')
  })
  
  it('should handle case-sensitivity in credentials', () => {
    // Test with uppercase username (convert env var to uppercase)
    LoginPage
      .typeUsername(Cypress.env('USERNAME').toUpperCase())
      .typePassword(Cypress.env('PASSWORD'))
      .submit()
    
    // Verify error message (assuming login is case-sensitive)
    LoginPage.verifyErrorMessage('Invalid username or password')
    
    // Test with uppercase password (convert env var to uppercase)
    LoginPage
      .typeUsername(Cypress.env('USERNAME'))
      .typePassword(Cypress.env('PASSWORD').toUpperCase())
      .submit()
    
    // Verify error message (assuming login is case-sensitive)
    LoginPage.verifyErrorMessage('Invalid username or password')
  })
  
  // Note: This test may fail if trimming is not implemented
  it('should trim whitespace in username field', () => {
    // Login with whitespace around username
    LoginPage
      .typeUsername(`  ${Cypress.env('USERNAME')}  `)
      .typePassword(Cypress.env('PASSWORD'))
      .submit()
    
    // Verify success (if trimming is implemented)
    cy.url().should('include', '/shop')
  })
  
  // BugID: ***
  // The form fields are not cleared after failed login
  it('should clear form fields after failed login attempt', () => {
    // Attempt login with wrong credentials
    LoginPage
      .typeUsername('wronguser')
      .typePassword('wrongpass')
      .submit()
    
    // Verify error message appears
    LoginPage.verifyErrorMessage('Invalid username or password')
    
    // Verify password field was cleared (common security practice)
    cy.get('#password').should('have.value', '')
    
    // Username typically remains for convenience
    cy.get('#username').should('have.value', 'wronguser')
  })
  
  
  it('should redirect to login page if accessing shop page without authentication', () => {
    // Try to access shop page directly
    cy.visit('/shop')
    
    // Should redirect to login page
    cy.get('#loginForm').should('be.visible')
    cy.get('#username').should('be.visible')
  })
  
  it('should redirect to login page if accessing basket page without authentication', () => {
    // Try to access basket page directly
    cy.visit('/basket')
    
    // Should redirect to login page
    cy.get('#loginForm').should('be.visible')
    cy.get('#username').should('be.visible')
  })
  
  it('should handle special characters in credentials', () => {
    // This test uses a mix of valid credentials with special characters
    LoginPage
      .typeUsername(Cypress.env('USERNAME') + '!@#')
      .typePassword(Cypress.env('PASSWORD') + '$%^')
      .submit()
    
    // Verify error message
    LoginPage.verifyErrorMessage('Invalid username or password')
  })
  
  it('should handle very long input values', () => {
    // Test with very long username and password
    const longString = 'a'.repeat(100)
    
    LoginPage
      .typeUsername(longString)
      .typePassword(longString)
      .submit()
    
    // Should not crash and show error message
    LoginPage.verifyErrorMessage('Invalid username or password')
  })
  
  it('should not show password in clear text', () => {
    // Verify password field has type="password"
    cy.get('#password').should('have.attr', 'type', 'password')
    
    // Type a password
    LoginPage.typePassword('securepassword')
    
    // Get the displayed value and verify it's not the actual password
    // This is a basic check - browsers hide password values differently
    cy.get('#password').invoke('val').should('equal', 'securepassword')
    cy.get('#password').invoke('prop', 'type').should('equal', 'password')
  })
})