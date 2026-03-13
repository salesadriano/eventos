import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "./Toast";
import { useToast } from "./toastContext";

const Demo = () => {
  const { notify } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        notify({
          title: "Sucesso",
          description: "Operacao concluida",
          variant: "success",
          durationMs: 10000,
        })
      }
    >
      Notificar
    </button>
  );
};

const DemoDefaults = () => {
  const { notify } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        notify({
          title: "Info",
          description: "Sem parametros opcionais",
        })
      }
    >
      Notificar default
    </button>
  );
};

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("exibe notificacao no viewport consistente", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Notificar" }));

    expect(screen.getByLabelText("Notificacoes")).toBeInTheDocument();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Operacao concluida")).toBeInTheDocument();
  });

  it("atende a11y basica", async () => {
    const { container } = render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Notificar" }));

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("remove notificacao ao clicar em fechar", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Notificar" }));
    expect(screen.getByText("Operacao concluida")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fechar alerta" }));
    expect(screen.queryByText("Operacao concluida")).not.toBeInTheDocument();
  });

  it("aplica fallback de variant e duration e remove por timeout", async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <DemoDefaults />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Notificar default" }));

    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Sem parametros opcionais")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3501);
    });
    expect(
      screen.queryByText("Sem parametros opcionais"),
    ).not.toBeInTheDocument();
  });
});
