describe("Authentication flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the login form by default", () => {
    cy.findByRole("heading", { name: /acessar painel interno/i }).should(
      "be.visible"
    );
    cy.findByLabelText(/email institucional/i).should("exist");
    cy.findByLabelText(/senha/i).should("exist");
    cy.findByRole("button", { name: /entrar/i }).should("be.enabled");
  });

  it("blocks submission when required fields are empty", () => {
    cy.findByRole("button", { name: /entrar/i }).click();
    cy.findByLabelText(/email institucional/i).then(($input) => {
      expect($input[0].checkValidity()).to.equal(false);
    });
  });
});
