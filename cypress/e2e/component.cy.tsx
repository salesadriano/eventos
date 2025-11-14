/// <reference types="cypress" />
import App from "../../src/App";

describe("App Component", () => {
  it("should render the app", () => {
    cy.mount(<App />);
    cy.contains("h1", "Vite + React").should("be.visible");
  });

  it("should increment counter", () => {
    cy.mount(<App />);
    cy.contains("button", "count is 0").click();
    cy.contains("button", "count is 1").should("be.visible");
  });
});
