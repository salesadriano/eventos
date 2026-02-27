import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "tests-cypress/**/*.cy.ts",
    supportFile: false,
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
