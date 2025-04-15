# Mock Shop Test Automation

## Overview

This project contains automated tests for a mock e-commerce website with three main pages:
- Login Page
- Shop Page
- Basket Page

The tests are built using Cypress and follow the Page Object Model (POM) design pattern for better maintainability and reusability.

## Project Structure

```
├── cypress/
│   ├── e2e/                     # Test files
│   │   ├── login.cy.js          # Login page tests
│   │   ├── shop.cy.js           # Shop page tests
│   │   └── basket.cy.js         # Basket page tests
│   ├── fixtures/                # Test data files
│   ├── pages/                   # Page Object Models
│   │   ├── LoginPage.js         # Login page object
│   │   ├── ShopPage.js          # Shop page object
│   │   └── BasketPage.js        # Basket page object
│   └── support/                 # Global support files
│       ├── commands.js          # Custom commands
│       └── e2e.js               # Global configuration
├── .github/workflows/           # CI/CD configuration
│   └── cypress.yml              # GitHub Actions workflow
├── cypress.config.js            # Cypress configuration
├── cypress.env.json             # Environment variables (not in git)
├── .eslintrc.json               # eslint tool configuration
├── .gitignore                   # Git ignore list
├── package.json                 # Project dependencies
└── README.md                    # Project Instruction documentation
└── SECURITY.md                  # Project Security notes
```

## Prerequisites

- Node.js (v14 or later)
- NPM (v6 or later)

## Setup Instructions

### Setting up the Mock Shop

1. Place all the provided files (`index.html`, `shop.html`, `basket.html`, `styles.css`, and `script.js`) in a single directory
2. Serve the files locally using one of these methods:
   - Using NPX: `npx serve`
   - Using VS Code Live Server extension
   - Any other local server of your choice

### Setting up Cypress

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables for credentials (required):
   
   Option 1: Create a `cypress.env.json` file (**recommended for local development**):
   ```json
   {
     "USERNAME": "user1",
     "PASSWORD": "user1",
     "BASE_URL": "http://localhost:3000"
   }
   ```
   This file is automatically excluded from git via .gitignore to prevent credentials from being committed.
   
   Option 2: Set environment variables when running Cypress:
   ```bash
   CYPRESS_USERNAME=user1 CYPRESS_PASSWORD=user1 CYPRESS_BASE_URL=http://localhost:3000 npx cypress run
   ```
   
   Option 3: For CI/CD pipelines, set secrets in your platform:
   - GitHub Actions: Use repository secrets
   - Jenkins: Use credentials store
   - GitLab CI: Use CI/CD variables
   
   ⚠️ **Security Note**: The tests will fail if USERNAME and PASSWORD environment variables are not provided. Never commit actual credentials to your repository.

## Running the Tests

1. Start your local server to serve the mock shop files
2. Run Cypress tests in headless mode:
   ```bash
   npx cypress run
   ```
3. Or open Cypress to run tests interactively:
   ```bash
   npx cypress open
   ```
   Select Chrome for E2E testing.

## Test Coverage

### Login Tests
- UI Elements Verification
   - Should show the login form with all required elements
- Valid Login Scenario
   - Should login with valid credentials
- Invalid Credentials Handling
   - Should show error message with invalid username
   - Should show error message with invalid password
- Form Validation
   - Should require username field
   - Should require password field
- Credential Format Handling
   - Should handle case-sensitivity in credentials
   - Should trim whitespace in username field
   - Should handle special characters in credentials
   - Should handle very long input values
- Form Behavior
   - Should clear form fields after failed login attempt
   - Should not show password in clear text
- Access Control
   - Should redirect to login page if accessing shop page without authentication
   - Should redirect to login page if accessing basket page without authentication

### Shop Page Tests
- Verification of products display with all required information
- Search functionality by product code
- Search functionality by product description
- Case-insensitive search capability
- Adding products to basket
- Alert confirmation when adding products
- Navigation to Basket page
- Logout functionality and basket clearing
- LocalStorage persistence of basket items after shop page refresh
- LocalStorage persistence of basket items while navigating between pages
- LocalStorage persistence of basket items using browser navigation controls(back/forward buttons)

### Basket Page Tests
- Basket content verification with all product details
- Total calculation accuracy for single and multiple items
- Empty basket handling and messaging
- Basket operations (clear, navigation)
- Basket clearing confirmation alerts
- Navigation back to shop
- Logout functionality from basket page
- Persistence of basket content across page reloads in basket pages
- Persistence of basket content when adding multiple products across page reloads


### E2E User Journey Tests
- Complete shopping flow from login to logout:
  - User authentication
  - Product search
  - Adding multiple products
  - Viewing basket contents
  - Verifying correct total calculation
  - Returning to shopping
  - Logging out securely
- Session preservation between tests
- Form submission and validation
- Alert handling and verification

## Failed tests are caused by bugs features

## CI/CD Integration

This project includes a GitHub Actions workflow that:
1. Runs on pushes to main/master/develop branches
2. Runs on pull requests to these branches
3. Runs daily at midnight UTC
4. Tests across multiple browsers (Chrome, Firefox, Edge)
5. Uploads screenshots and videos as artifacts when tests fail

To use GitHub Actions with this workflow:
1. Push this repository to GitHub
2. Add secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):
   - `CYPRESS_USERNAME`: The username for the test account
   - `CYPRESS_PASSWORD`: The password for the test account
   - `CYPRESS_BASE_URL`: The URL where your application is deployed

These secrets are encrypted and only exposed during workflow runs. They are not accessible in pull requests from forks for security reasons.

**Important Security Notes:**
- Never store actual credentials in your code or config files
- Always use environment variables or secure secret stores
- Consider using a dedicated test account with limited permissions
- Rotate credentials periodically
- For production testing, consider using a more secure authentication method

## Identified Issues

1. Shop: The default shop page doesn't display products until a search is performed.
2. Basket: The basket empty message may not display correctly.
3. Basket: Add product to basket，the Qty did not change.
4. BasketThe basket page can not show added items.
5. Login: Trim whitespace in username field when user login is not implemented.
6. Login: Form fields are cleared after failed login attempt.
7. Login: Redirect to shop page if accessing shop page without authentication.
8. Login: Redirect to basket page if accessing basket page without authentication.
9. User Journey: Same issue as known for adding products to basket.

## Best Practices Implemented

- **Page Object Model**: Separates test logic from page interactions
- **Custom Commands**: Reusable login and session handling
- **Session Management**: Optimized test performance by preserving login state
- **Environment Variables**: Secure credential management
- **CI/CD Integration**: Automated test execution in multiple environments
- **Cross-browser Testing**: Ensures application works across different browsers