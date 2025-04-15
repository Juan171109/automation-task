// cypress/e2e/shop.spec.js

describe('Shop Page', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/')
    cy.get('#username').type('user1')
    cy.get('#password').type('user1')
    cy.get('button[type="submit"]').click()
    
    // Verify we're on shop page
    cy.url().should('include', '/shop')
    
    // Clear any existing basket data
    cy.window().then((win) => {
      win.localStorage.removeItem('basket')
    })
  })
  
  // This test failed because the shop page show no items by default while we expect to see all 6 products listed on the page.
  it('should display all 6 products with required information', () => {
    cy.get('.product-card').should('have.length', 6)
    
    // Verify first product contains all required information
    cy.get('.product-card').first().within(() => {
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
    cy.get('#searchInput').type('P001')
    cy.get('button').contains('Search').click()
    
    // Verify only one product is displayed
    cy.get('.product-card').should('have.length', 1)
    cy.get('.product-card').contains('Code: P001')
  })
  
  it('should search and filter products by Description', () => {
    cy.get('#searchInput').type('Apple')
    cy.get('button').contains('Search').click()
    
    // Verify filtered products
    cy.get('.product-card').should('have.length.at.least', 1)
    cy.get('.product-card').contains('Fresh Apples')
  })
  
  it('should be case-insensitive when searching', () => {
    cy.get('#searchInput').type('apple')  // lowercase
    cy.get('button').contains('Search').click()
    
    // Verify "Fresh Apples" is found despite case difference
    cy.get('.product-card').should('have.length.at.least', 1)
    cy.get('.product-card').contains('Fresh Apples')
  })
  
  it('should add product to basket and show alert', () => {
    // Mock the alert
    const stub = cy.stub()
    cy.on('window:alert', stub)
    
    // could remove this line when the default shop page does not show all product list bug fixed.
    cy.get('button').contains('Search').click()

    // Click Add to Basket on first product
    cy.get('.product-card').first().within(() => {
      cy.get('h3').invoke('text').as('productName')
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Verify alert message
    cy.get('@productName').then(productName => {
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
    cy.get('button').contains('View Basket').click()
    cy.url().should('include', '/basket')
  })
  
  it('should logout and clear basket when Logout is clicked', () => {
    // could remove this line when the default shop page does not show all product list bug fixed.
    cy.get('button').contains('Search').click()

    // First add item to basket
    cy.get('.product-card').first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Verify item was added
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.be.at.least(1)
    })
    
    // Logout
    cy.get('button').contains('Logout').click()
    
    // Verify redirect to login page
    cy.url().should('include', '/')
    
    // Verify basket was cleared
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket')) || []
      expect(basket).to.have.length(0)
    })
  })
  
  it('should persist basket items in localStorage after page refresh', () => {
    // could remove this line when the default shop page does not show all product list bug fixed.
    cy.get('button').contains('Search').click()

    // Add item to basket
    cy.get('.product-card').first().within(() => {
      cy.get('button').contains('Add to Basket').click()
    })
    
    // Reload the page
    cy.reload()
    
    // Verify basket items persisted
    cy.window().then(win => {
      const basket = JSON.parse(win.localStorage.getItem('basket'))
      expect(basket.length).to.be.at.least(1)
    })
  })
})