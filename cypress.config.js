const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Update with your local server URL
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
