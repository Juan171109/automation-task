
  // cypress/pages/ShopPage.js
  class ShopPage {
    // Locators
    searchInput = '#searchInput'
    searchButton = 'button:contains("Search")'
    viewBasketButton = 'button:contains("View Basket")'
    logoutButton = 'button:contains("Logout")'
    productCards = '.product-card'
    addToBasketButton = 'button:contains("Add to Basket")'
  
    // Methods
    visit() {
      cy.visit('/shop.html')
      return this
    }
  
    search(text) {
      cy.get(this.searchInput).clear().type(text)
      cy.get(this.searchButton).click()
      return this
    }

    // Click Search button without entering any input (for showing all products)
    clickSearchButton(){
      cy.get(this.searchButton).click()
      return this
    }
  
    getProductCards() {
      return cy.get(this.productCards)
    }
  
    addProductToBasket(productName) {
      cy.contains(this.productCards, productName).within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      return this
    }
  
    goToBasket() {
      cy.get(this.viewBasketButton).click()
      return this
    }
  
    logout() {
      cy.get(this.logoutButton).click()
      return this
    }
  
    verifyProductsCount(count) {
      cy.get(this.productCards).should('have.length', count)
      return this
    }
  }
  
  export default new ShopPage()
  