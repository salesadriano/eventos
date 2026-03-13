import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renderiza cabecalho e conteudo", () => {
    render(
      <Card eyebrow="Painel" title="Resumo" footer="Rodape" variant="outline">
        Conteudo principal
      </Card>,
    );

    expect(screen.getByText("Painel")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resumo" })).toBeInTheDocument();
    expect(screen.getByText("Conteudo principal")).toBeInTheDocument();
    expect(screen.getByText("Rodape")).toBeInTheDocument();
  });

  it("atende a11y basica", async () => {
    const { container } = render(<Card title="Resumo">Conteudo</Card>);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
