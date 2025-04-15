// cypress/pages/LoginPage.js
class LoginPage {
    // Locators
    usernameInput = '#username'
    passwordInput = '#password'
    submitButton = 'button[type="submit"]'
    errorMessage = '#errorMessage'
  
    // Methods
    visit() {
      cy.visit('/')
      return this
    }
  
    typeUsername(username) {
      cy.get(this.usernameInput).type(username)
      return this
    }
  
    typePassword(password) {
      cy.get(this.passwordInput).type(password)
      return this
    }
  
    submit() {
      cy.get(this.submitButton).click()
      return this
    }
  
    login(username, password) {
      this.typeUsername(username)
      this.typePassword(password)
      this.submit()
      return this
    }
  
    verifyErrorMessage(message) {
      cy.get(this.errorMessage).should('be.visible').and('have.text', message)
      return this
    }
  }
  
  export default new LoginPage()
  