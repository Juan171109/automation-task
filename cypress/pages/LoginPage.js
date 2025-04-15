// cypress/pages/LoginPage.js
class LoginPage {
    // Locators
    usernameInput = '#username'
    passwordInput = '#password'
    submitButton = 'button[type="submit"]'
    loginForm = '#loginForm'
    errorMessage = '#errorMessage'
    usernameLabel = 'label[for="username"]'
    passwordLabel = 'label[for="password"]'
  
    // Methods
    visit() {
      cy.visit('/')
      return this
    }
  
    typeUsername(username) {
      cy.get(this.usernameInput).clear().type(username)
      return this
    }
  
    typePassword(password) {
      cy.get(this.passwordInput).clear().type(password)
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
    
    verifyFormElements() {
      cy.get(this.loginForm).should('be.visible')
      cy.get(this.usernameInput).should('be.visible')
      cy.get(this.passwordInput).should('be.visible')
      cy.get(this.submitButton).should('be.visible')
      cy.get(this.usernameLabel).should('be.visible')
      cy.get(this.passwordLabel).should('be.visible')
      return this
    }
    
    verifyPasswordFieldType() {
      cy.get(this.passwordInput).should('have.attr', 'type', 'password')
      return this
    }
    
    verifyUsernameValue(expectedValue) {
      cy.get(this.usernameInput).should('have.value', expectedValue)
      return this
    }
    
    verifyPasswordValue(expectedValue) {
      cy.get(this.passwordInput).should('have.value', expectedValue)
      return this
    }
    
    verifyRequiredAttributes() {
      cy.get(this.usernameInput).should('have.attr', 'required')
      cy.get(this.passwordInput).should('have.attr', 'required')
      return this
    }
    
    verifyNoSession() {
      cy.window().then(win => {
        expect(win.sessionStorage.getItem('userSession')).to.be.null
      })
      return this
    }
    
    verifySession(username) {
      cy.window().then(win => {
        const session = JSON.parse(win.sessionStorage.getItem('userSession') || '{}')
        expect(session.loggedIn).to.be.true
        expect(session.username).to.equal(username)
      })
      return this
    }
    
    reloadPage() {
      cy.reload()
      return this
    }
  }
  
  export default new LoginPage()