const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'tests/cypress/support/e2e.js',
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      // event listeners (se necessário)
    },
  },
});
