import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("renderiza spinner com status", () => {
    render(
      <LoadingState variant="spinner" size="lg" message="Carregando agenda" />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Carregando agenda")).toBeInTheDocument();
  });

  it("renderiza skeleton com linhas", () => {
    const { container } = render(<LoadingState variant="skeleton" lines={4} />);
    const blocks = container.querySelectorAll("div[aria-busy='true'] div");

    expect(blocks.length).toBeGreaterThanOrEqual(5);
  });

  it("atende a11y basica", async () => {
    const { container } = render(<LoadingState />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
