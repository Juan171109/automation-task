
  // cypress/pages/BasketPage.js
  class BasketPage {
    // Locators
    basketList = '#basketList'
    basketTotal = '#basketTotal'
    backToShopButton = 'button:contains("Back to Shop")'
    clearBasketButton = 'button:contains("Clear Basket")'
    logoutButton = 'button:contains("Logout")'
    basketItems = '.product-card'
  
    // Methods
    visit() {
      cy.visit('/basket.html')
      return this
    }
  
    clearBasket() {
      cy.get(this.clearBasketButton).click()
      return this
    }
  
    backToShop() {
      cy.get(this.backToShopButton).click()
      return this
    }
  
    logout() {
      cy.get(this.logoutButton).click()
      return this
    }
  
    verifyEmptyBasket() {
      cy.get(this.basketList).contains('Your basket is empty')
      cy.get(this.basketTotal).contains('Total: $0.00')
      return this
    }
  
    verifyTotalAmount(amount) {
      cy.get(this.basketTotal).should('contain', `Total: $${amount}`)
      return this
    }
  
    verifyProductInBasket(productName) {
      cy.contains(this.basketItems, productName).should('be.visible')
      return this
    }
  }
  
  export default new BasketPage()