const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://sandbox-partners-api.airalo.com', 
    env: {
      AIRALO_CLIENT_ID: process.env.AIRALO_CLIENT_ID,
      AIRALO_CLIENT_SECRET: process.env.AIRALO_CLIENT_SECRET,
      AIRALO_ACCESS_TOKEN: null,
    },
  },
});
