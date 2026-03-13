import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renderiza variacao de alerta", () => {
    render(
      <Alert variant="warning" title="Atencao">
        Revise os dados.
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Atencao")).toBeInTheDocument();
  });

  it("usa role status para variantes nao criticas", () => {
    render(<Alert variant="info">Mensagem informativa</Alert>);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("permite fechar alerta", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert variant="error" title="Erro" onClose={onClose}>
        Falha ao salvar.
      </Alert>,
    );

    await user.click(screen.getByRole("button", { name: "Fechar alerta" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("atende a11y basica", async () => {
    const { container } = render(<Alert>Mensagem</Alert>);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
