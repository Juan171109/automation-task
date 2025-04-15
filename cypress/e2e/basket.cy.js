// cypress/e2e/basket.spec.js

describe('Basket Page', () => {
    beforeEach(() => {
      // Login before each test
      cy.visit('/')
      cy.get('#username').type('user1')
      cy.get('#password').type('user1')
      cy.get('button[type="submit"]').click()
      
      // Clear any existing basket
      cy.window().then((win) => {
        win.localStorage.removeItem('basket')
      })

      // Stub alerts for the entire test suite
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub')
      })

      // remove this line once the defaul shop page bug fixed.
      cy.get('button').contains('Search').click()
      
    })
    
    // BugID:*** 
    // This test will fail as we expect see empty message here but actually it does not show any message now.
    it('should display empty basket message when no items', () => {
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Verify empty basket message
      cy.get('#basketList').contains('Your basket is empty')
      cy.get('#basketTotal').contains('Total: $0.00')
    })
    
    // Feature to be implemented.
    it('should display added items with correct information', () => {
      // Stub the alert before adding to basket
    //   const stub = cy.stub()
    //   cy.on('window:alert', stub)
      
      // Add first product to basket
      cy.contains('.product-card', 'Fresh Apples').within(() => {
        cy.get('h3').invoke('text').as('productName')
        cy.get('p').contains('Code:').invoke('text').as('productCode')
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Verify alert message
      cy.get('@productName').then(productName => {
        expect(stub.getCall(0)).to.be.calledWith(`${productName} added to basket!`)
      })
      
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Verify item is displayed in basket
      cy.get('@productName').then(productName => {
        cy.get('.product-card').should('contain', productName)
      })
      
      cy.get('@productCode').then(productCode => {
        cy.get('.product-card').should('contain', productCode)
      })
      
      // Verify all required information is displayed
      cy.get('.product-card').first().within(() => {
        cy.get('img').should('be.visible')
        cy.get('h3').should('be.visible')
        cy.get('p').contains('Code:').should('be.visible')
        cy.get('p').contains('Price: $').should('be.visible')
        cy.get('p').contains('UOM:').should('be.visible')
        cy.get('p').contains('Qty in Basket:').should('be.visible')
      })
      
      // Verify total is not $0.00
      cy.get('#basketTotal').should('not.contain', 'Total: $0.00')
    })
    
    it('should calculate total value correctly', () => {
      // Stub the alert
    //   const stub = cy.stub()
    //   cy.on('window:alert', stub)
      
      // Add a product with known price to basket
      cy.contains('.product-card', 'Fresh Apples').within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Verify total matches price (single item, qty=1)
      cy.get('#basketTotal').should('contain', 'Total: $5.99')
      
      // Go back to shop
      cy.get('button').contains('Back to Shop').click()
      
      // Add another item
      cy.contains('.product-card', 'Organic Bananas').within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Go back to basket
      cy.get('button').contains('View Basket').click()
      
      // Verify new total (5.99 + 3.49 = 9.48)
      cy.get('#basketTotal').should('contain', 'Total: $9.48')
    })
    
    it('should clear basket when Clear Basket button is clicked', () => {
      // Stub the alert
    //   const alertStub = cy.stub()
    //   cy.on('window:alert', alertStub)
      
      // Add product to basket
      cy.get('.product-card').first().within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Reset the stub for the clear basket alert
      cy.on('window:alert', alertStub)
      
      // Clear basket
      cy.get('button').contains('Clear Basket').click()
      
      // Verify the alert
      cy.wrap(alertStub).should('be.calledWith', 'Basket cleared!')
      
      // Verify basket is empty
      cy.get('#basketList').contains('Your basket is empty')
      cy.get('#basketTotal').contains('Total: $0.00')
      
      // Verify localStorage was updated
      cy.window().then(win => {
        const basket = JSON.parse(win.localStorage.getItem('basket')) || []
        expect(basket).to.have.length(0)
      })
    })
    
    it('should navigate back to shop page', () => {
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Click back to shop
      cy.get('button').contains('Back to Shop').click()
      
      // Verify redirect to shop page
      cy.url().should('include', '/shop')
      cy.get('button').contains('Search').should('be.visible')

    })
    
    it('should logout and clear basket', () => {
      // Stub the alert
    //   const stub = cy.stub()
    //   cy.on('window:alert', stub)
      
      // Add product to basket
      cy.get('.product-card').first().within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Click logout
      cy.get('button').contains('Logout').click()
      
      // Verify redirect to login page
      cy.get('#loginForm').should('be.visible')
      cy.get('#username').should('be.visible')
      
      // Verify basket was cleared
      cy.window().then(win => {
        const basket = JSON.parse(win.localStorage.getItem('basket')) || []
        expect(basket).to.have.length(0)
      })
    })
    
    it('should handle the basket state persistence', () => {
      // Stub the alert
    //   const stub = cy.stub()
    //   cy.on('window:alert', stub)
      
      // Add product to basket
      cy.contains('.product-card', 'Fresh Apples').within(() => {
        cy.get('button').contains('Add to Basket').click()
      })
      
      // Reload the page to verify persistence
      cy.reload()
      
      // Navigate to basket page
      cy.get('button').contains('View Basket').click()
      
      // Verify item is still in basket
      cy.contains('.product-card', 'Fresh Apples').should('be.visible')
      
      // Verify localStorage has the item
      cy.window().then(win => {
        const basket = JSON.parse(win.localStorage.getItem('basket'))
        expect(basket.length).to.be.at.least(1)
        expect(basket[0].description).to.include('Fresh Apples')
      })
    })
  })