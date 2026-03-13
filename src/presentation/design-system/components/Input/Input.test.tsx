import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("associa label e helper corretamente", () => {
    render(
      <Input
        label="Email"
        placeholder="nome@org.gov"
        helperText="Use email institucional"
      />,
    );

    const input = screen.getByRole("textbox", { name: /Email/ });
    expect(input).toHaveAttribute("placeholder", "nome@org.gov");
    expect(screen.getByText("Use email institucional")).toBeInTheDocument();
  });

  it("aplica acessibilidade de erro", () => {
    render(<Input label="CPF" errorMessage="CPF invalido" state="error" />);

    const input = screen.getByRole("textbox", { name: /CPF/ });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("CPF invalido")).toBeInTheDocument();
  });

  it("atende a11y basica", async () => {
    const { container } = render(<Input label="Nome" />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
