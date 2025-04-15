const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl will be taken from environment variable CYPRESS_BASE_URL or cypress.env.json
    viewportWidth: 1280,
    viewportHeight: 800,
    // No default credentials here for better security
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      // Check that required environment variables are set
      if (!config.env.USERNAME) {
        console.warn('Warning: USERNAME environment variable is not set. Set it using CYPRESS_USERNAME or cypress.env.json');
      }
      if (!config.env.PASSWORD) {
        console.warn('Warning: PASSWORD environment variable is not set. Set it using CYPRESS_PASSWORD or cypress.env.json');
      }
      if (!config.baseUrl && !config.env.BASE_URL) {
        console.warn('Warning: BASE_URL environment variable is not set. Set it using CYPRESS_BASE_URL or cypress.env.json');
        // Fall back to a default value only if not provided
        config.baseUrl = 'http://localhost:3000';
      } else if (config.env.BASE_URL && !config.baseUrl) {
        // Use BASE_URL from env if baseUrl is not set
        config.baseUrl = config.env.BASE_URL;
      }
      
      return config;
    },
  },
});