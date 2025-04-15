# Mock Shop Test Automation - README

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- NPM (v6 or later)

### Setting up the Mock Shop
1. Place all the provided files (`index.html`, `shop.html`, `basket.html`, `styles.css`, and `script.js`) in a single directory
2. Serve the files locally using one of these methods:
   - Using NPX: `npx serve`
   - Using VS Code Live Server extension
   - Any other local server of your choice

### Setting up Cypress
1. Create a new directory for your test project
2. Navigate to that directory in your terminal
3. Initialize an npm project:
   ```bash
   npm init -y
   ```
4. Install Cypress:
   ```bash
   npm install cypress --save-dev
   ```
5. Open Cypress to generate the initial folder structure:
   ```bash
   npx cypress open
   ```
6. Configure Cypress:
   - Create or modify the `cypress.config.js` file in the root directory:
   ```javascript
   const { defineConfig } = require('cypress')

   module.exports = defineConfig({
     e2e: {
       baseUrl: 'http://localhost:3000', // Update with your local server URL
       viewportWidth: 1280,
       viewportHeight: 800,
     },
   })
   ```

### Running the Tests
1. Start your local server to serve the mock shop files
2. Run Cypress tests in headless mode:
   ```bash
   npx cypress run
   ```
3. Or open Cypress to run tests interactively:
   ```bash
   npx cypress open
   ```

## Test Cases

### Login Tests
- Valid login credentials redirect to Shop page
- Invalid username or password shows error message
- Empty form validation

### Shop Page Tests
- Verify all products are displayed correctly with all required information
- Search functionality filters products correctly
- Adding a product to basket shows alert and updates localStorage
- View Basket button navigates to Basket page
- Logout clears basket and redirects to Login page

### Basket Page Tests
- Basket displays all added products with correct information
- Total calculation is accurate based on price and quantity
- Empty basket shows appropriate message and $0.00 total
- Clear Basket button removes all items and shows alert
- Back to Shop button navigates to Shop page
- Logout clears basket and redirects to Login page

### E2E User Journey Tests
- Complete shopping flow: login → add products → view basket → logout

## Observed Issues

1. UOM inconsistency: There appears to be code that can modify the UOM from "kg" to "g" for certain products when added to the basket under specific conditions.
2. Price modification: The code contains logic that can adjust the price of certain products when added to the basket.

These inconsistencies are tested and documented but not fixed as per the instructions.
