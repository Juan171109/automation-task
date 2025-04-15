// cypress/e2e/basket.cy.js
import ShopPage from '../pages/ShopPage'
import BasketPage from '../pages/BasketPage'

describe('Basket Page', () => {
  beforeEach(() => {
    // Using the session-based login
    cy.loginBySession()
    
    // Clear any existing basket
    cy.window().then((win) => {
      win.localStorage.removeItem('basket')
    })

    // Stub alerts for the entire test suite
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub')
    })

    // Ensure products are visible by doing an empty search
    ShopPage.clickSearchButton()
  })
  
  // BugID: ***
  // Known issue: Empty message is not shown on basket page when user navigate from shop to basket page
  it('should display empty basket message when no items', () => {
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Verify empty basket message
    BasketPage.verifyEmptyBasket()
  })
  
  // To do Feature: Basket page should show added items
  it('should display added items with correct information', () => {
    // Add first product to basket
    let productName
    ShopPage.getProductCards().first().within(() => {
      cy.get('h3').invoke('text').then(text => {
        productName = text
      })
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Verify item is displayed in basket
    BasketPage.verifyProductInBasket(productName)
    
    // Verify all required information is displayed
    cy.get(BasketPage.basketItems).first().within(() => {
      cy.get('img').should('be.visible')
      cy.get('h3').should('be.visible')
      cy.get('p').contains('Code:').should('be.visible')
      cy.get('p').contains('Price: $').should('be.visible')
      cy.get('p').contains('UOM:').should('be.visible')
      cy.get('p').contains('Qty in Basket:').should('be.visible')
    })
    
    // Verify total is not $0.00
    cy.get(BasketPage.basketTotal).should('not.contain', 'Total: $0.00')
  })
  
  // To do Feature: Basket page should show added items
  it('should calculate total value correctly', () => {
    // Add a product with known price to basket
    ShopPage.addProductToBasket('Fresh Apples')
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Verify total matches price (single item, qty=1)
    BasketPage.verifyTotalAmount('5.99')
    
    // Go back to shop
    BasketPage.backToShop()
    
    // Add another item
    ShopPage.addProductToBasket('Organic Bananas')
    
    // Go back to basket
    ShopPage.goToBasket()
    
    // Verify new total (5.99 + 3.49 = 9.48)
    BasketPage.verifyTotalAmount('9.48')
  })
  
  it('should clear basket when Clear Basket button is clicked', () => {
    // Mock the alert
    const stub = cy.stub()
    cy.on('window:alert', stub)

    // Add product to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Clear basket
    BasketPage.clearBasket()
    
    // Verify alert message
    cy.then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Basket cleared!')
    })
    // Verify basket is empty
    BasketPage.verifyEmptyBasket()
    
    // Verify localStorage was updated
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket')) || []
      expect(basket).to.have.length(0)
    })
  })
  
  it('should navigate back to shop page', () => {
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Click back to shop
    BasketPage.backToShop()
    
    // Verify redirect to shop page
    cy.url().should('include', '/shop')
    cy.get(ShopPage.searchButton).should('be.visible')
  })
  
  it('should logout and clear basket', () => {
    // Add product to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Click logout
    BasketPage.logout()
    
    // Verify redirect to login page
    cy.get('#loginForm').should('be.visible')
    
    // Verify basket was cleared
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket')) || []
      expect(basket).to.have.length(0)
    })
  })
  
  it('should persist basket content across page reloads in Basket page', () => {
    // Add product to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('h3').invoke('text').as('productName')
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Store the basket content for comparison
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.be.at.least(1)
      cy.wrap(basket).as('originalBasket')
    })
    
    // Store the total amount
    cy.get(BasketPage.basketTotal).invoke('text').as('originalTotal')
    
    // Reload the page
    cy.reload()
    
    // Verify the total amount is unchanged
    cy.get('@originalTotal').then(originalTotal => {
      cy.get(BasketPage.basketTotal).should('have.text', originalTotal)
    })
    
    // Verify localStorage still has the same basket content
    cy.window().then(win => {
      const basketAfterReload = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@originalBasket').then(originalBasket => {
        expect(basketAfterReload).to.deep.equal(originalBasket)
      })
    })
  })
  
  it('should maintain basket state when adding multiple products across page reloads', () => {
    // Add first product
    ShopPage.getProductCards().eq(0).within(() => {
      cy.get('h3').invoke('text').as('firstProduct')
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Go to basket page
    ShopPage.goToBasket()
    
    // Go back to shop
    BasketPage.backToShop()
    
    // Show products again
    ShopPage.clickSearchButton()
    
    // Add second product
    ShopPage.getProductCards().eq(1).within(() => {
      cy.get('h3').invoke('text').as('secondProduct')
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Save basket state with both products
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.equal(2)
      cy.wrap(basket).as('twoItemBasket')
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Reload the page
    cy.reload()
    
    // Verify localStorage matches the saved basket state
    cy.window().then(win => {
      const currentBasket = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@twoItemBasket').then(savedBasket => {
        expect(currentBasket).to.deep.equal(savedBasket)
      })
    })
  })
})