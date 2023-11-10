import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'MarkMeHere',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  },
  retries: {
    runMode: 2 // Number of retries for the entire test run
  },

  // Configuration for environment-specific variables
  env: {
    baseUrl: 'http://localhost:3000/landing-page',
    username: 'your_username',
    password: 'your_password'
  },

  // Configuration for viewport sizes
  viewportWidth: 1200,
  viewportHeight: 800,

  // Configuration for screenshots and videos
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  video: true,

  failOnUncaughtException: true,

  ignoreTestFiles: ['**/examples/*.spec.ts'],

  pluginsFile: 'cypress/plugins/index.ts',

  webpackOptions: {}
});
