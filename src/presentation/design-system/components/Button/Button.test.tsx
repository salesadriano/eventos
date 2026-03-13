import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renderiza variante e bloqueia quando loading", () => {
    render(
      <Button variant="danger" isLoading>
        Excluir
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("dispara clique quando habilitado", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Salvar</Button>);

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("atende a11y basica", async () => {
    const { container } = render(<Button>Continuar</Button>);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
