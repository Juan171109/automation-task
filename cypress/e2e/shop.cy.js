// cypress/e2e/shop.cy.js
import ShopPage from '../pages/shopPage'
import BasketPage from '../pages/basketPage'

describe('Shop Page', () => {
  beforeEach(() => {
    // Using the session-based login
    cy.loginBySession()
    
    // Clear any existing basket data
    cy.window().then((win) => {
      win.localStorage.removeItem('basket')
    })
  })
  
  // Bug ID: *** 
  // Known issue: The shop page show non product by default after user login
  it('should display all 6 products with required information', () => {
    ShopPage.verifyProductsCount(6)
    
    // Verify first product contains all required information
    ShopPage.getProductCards().first().within(() => {
      cy.get('img').should('be.visible')
      cy.get('h3').should('be.visible')
      cy.get('p').contains('Code: P').should('be.visible')
      cy.get('p').contains('Price: $').should('be.visible')
      cy.get('p').contains('UOM:').should('be.visible')
      cy.get('p').contains('Qty:').should('be.visible')
      cy.get('button').contains('Add to Basket').should('be.visible')
    })
  })
  
  it('should search and filter products by Product Code', () => {
    ShopPage.search('P001')
    
    // Verify only one product is displayed
    ShopPage.verifyProductsCount(1)
    ShopPage.getProductCards().contains('Code: P001')
  })
  
  it('should search and filter products by Description', () => {
    ShopPage.search('Apple')
    
    // Verify filtered products
    ShopPage.getProductCards().should('have.length.at.least', 1)
    ShopPage.getProductCards().contains('Fresh Apples')
  })
  
  it('should be case-insensitive when searching', () => {
    ShopPage.search('apple')  // lowercase
    
    // Verify "Fresh Apples" is found despite case difference
    ShopPage.getProductCards().should('have.length.at.least', 1)
    ShopPage.getProductCards().contains('Fresh Apples')
  })
  
  it('should add product to basket and show alert', () => {
    // Mock the alert
    const stub = cy.stub()
    cy.on('window:alert', stub)
    
    // Search to ensure products are displayed (until bug is fixed)
    ShopPage.clickSearchButton()

    // Get product name for alert verification
    let productName
    ShopPage.getProductCards().first().within(() => {
      cy.get('h3').invoke('text').then(text => {
        productName = text
      })
    })

    // Add first product to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Verify alert message
    cy.then(() => {
      expect(stub.getCall(0)).to.be.calledWith(`${productName} added to basket!`)
    })
    
    // Verify localStorage was updated
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket).to.have.length(1)
      expect(basket[0]).to.have.property('productCode')
    })
  })
  
  it('should navigate to basket page when View Basket is clicked', () => {
    ShopPage.goToBasket()
    cy.url().should('include', '/basket')
  })
  
  it('should logout and clear basket when Logout is clicked', () => {
    // Search to ensure products are displayed (until bug is fixed)
    ShopPage.clickSearchButton('')

    // First add item to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Verify item was added
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.be.at.least(1)
    })
    
    // Logout
    ShopPage.logout()
    
    // Verify redirect to login page
    cy.url().should('include', '/')
    
    // Verify basket was cleared
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket')) || []
      expect(basket).to.have.length(0)
    })
  })
  
  // New persistence tests
  it('should persist basket items in localStorage after page refresh', () => {
    // Search to ensure products are displayed
    ShopPage.clickSearchButton()

    // Add item to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('h3').invoke('text').as('productName')
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Save the basket state before refresh
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.be.at.least(1)
      cy.wrap(basket).as('originalBasket')
    })
    
    // Reload the page
    cy.reload()
    
    // Need to click search again after reload to show products
    ShopPage.clickSearchButton()
    
    // Verify basket items persisted after reload
    cy.window().then(win => {
      const basketAfterReload = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@originalBasket').then(originalBasket => {
        expect(basketAfterReload).to.deep.equal(originalBasket)
      })
    })
  })
  
  it('should maintain basket content while navigating between pages', () => {
    // Search to ensure products are displayed
    ShopPage.clickSearchButton()
    
    // Add multiple products to basket
    ShopPage.getProductCards().eq(0).within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    ShopPage.getProductCards().eq(1).within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Save the basket state
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.equal(2)
      cy.wrap(basket).as('originalBasket')
    })
    
    // Navigate to basket page
    ShopPage.goToBasket()
    
    // Verify localStorage still has items on basket page
    cy.window().then(win => {
      const basketOnBasketPage = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@originalBasket').then(originalBasket => {
        expect(basketOnBasketPage).to.deep.equal(originalBasket)
      })
    })
    
    // Navigate back to shop
    BasketPage.backToShop()
    
    // Search to see products again
    ShopPage.clickSearchButton()
    
    // Verify localStorage still has items after returning to shop
    cy.window().then(win => {
      const basketBackOnShop = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@originalBasket').then(originalBasket => {
        expect(basketBackOnShop).to.deep.equal(originalBasket)
      })
    })
  })
  
  it('should maintain basket while using browser navigation controls', () => {
    // Search to ensure products are displayed
    ShopPage.clickSearchButton()
    
    // Add a product to basket
    ShopPage.getProductCards().first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Save basket state
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.equal(1)
      cy.wrap(basket).as('basketData')
    })
    
    // Go to basket page
    ShopPage.goToBasket()
    
    // Use browser back button
    cy.go('back')
    
    // Verify we're back on shop page
    cy.url().should('include', '/shop')
    
    // Verify basket is still intact
    cy.window().then(win => {
      const currentBasket = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@basketData').then(originalBasket => {
        expect(currentBasket).to.deep.equal(originalBasket)
      })
    })
    
    // Go forward again
    cy.go('forward')
    
    // Verify we're on basket page
    cy.url().should('include', '/basket')
    
    // Verify basket is still intact
    cy.window().then(win => {
      const forwardBasket = JSON.parse(win.localStorage.getItem('basket'))
      cy.get('@basketData').then(originalBasket => {
        expect(forwardBasket).to.deep.equal(originalBasket)
      })
    })
  })
})