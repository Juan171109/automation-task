// cypress/e2e/user-journey.cy.js
import LoginPage from '../pages/LoginPage'
import ShopPage from '../pages/ShopPage'
import BasketPage from '../pages/BasketPage'

describe('Complete User Journey', () => {
  beforeEach(() => {
    // Reset any state before starting the test
    cy.resetState()
  })
  
  it('should allow a user to login, search, add products, and checkout', () => {
    // 1. Login
    const username = Cypress.env('USERNAME') || 'user1'
    const password = Cypress.env('PASSWORD') || 'user1'
    
    LoginPage
      .visit()
      .login(username, password)
    
    // Verify login successful - we're on shop page
    cy.url().should('include', '/shop')
    
    // 2. Search for products
    ShopPage.search('Apple')
    
    // Verify search results
    ShopPage.getProductCards().should('contain', 'Fresh Apples')
    
    // 3. Add product to basket
    ShopPage.addProductToBasket('Fresh Apples')
    
    // Verify alert (product added)
    cy.on('window:alert', (text) => {
      expect(text).to.include('added to basket!')
    })
    
    // 4. Go back to all products
    ShopPage.search('')
    
    // 5. Add another product
    ShopPage.addProductToBasket('Organic Bananas')
    
    // 6. Navigate to basket
    ShopPage.goToBasket()
    
    // 7. Verify basket contents
    // Comment below verification for basket page could not show added product for now
    BasketPage.verifyProductInBasket('Fresh Apples')
    BasketPage.verifyProductInBasket('Organic Bananas')
    
    // Verify total is sum of products (5.99 + 3.49 = 9.48)
    BasketPage.verifyTotalAmount('9.48')
    
    // 8. Go back to shop
    BasketPage.backToShop()
    
    // 9. Logout
    ShopPage.logout()
    
    // Verify back on login page
    cy.url().should('include', '/index')
    
    // Verify basket was cleared on logout
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket')) || []
      expect(basket).to.have.length(0)
    })
  })
})