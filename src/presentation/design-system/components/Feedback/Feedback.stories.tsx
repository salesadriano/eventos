import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Alert } from "./Alert";
import { ToastProvider } from "./Toast";
import { useToast } from "./toastContext";

const meta: Meta = {
  title: "Design System/Components/Feedback",
  parameters: {
    docs: {
      description: {
        component:
          'Feedback visual com alerts e notificacoes em posicao consistente (top-right).\n\nExemplo:\n```tsx\n<Alert variant="success" title="Sucesso">Operacao concluida.</Alert>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Alerts: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Alert variant="info" title="Informacao">
        Novo ciclo de inscricoes disponivel.
      </Alert>
      <Alert variant="success" title="Sucesso">
        Inscricao salva com sucesso.
      </Alert>
      <Alert variant="warning" title="Atencao">
        Revise os dados antes de enviar.
      </Alert>
      <Alert variant="error" title="Erro">
        Nao foi possivel concluir a operacao.
      </Alert>
    </div>
  ),
};

const ToastDemo = () => {
  const { notify } = useToast();
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      onClick={() => {
        const next = count + 1;
        setCount(next);
        notify({
          title: `Notificacao ${next}`,
          description: "Mensagem de feedback exibida no topo direito.",
          variant: next % 2 === 0 ? "success" : "info",
        });
      }}
    >
      Disparar notificacao
    </button>
  );
};

const ToastDefaultDemo = () => {
  const { notify } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        notify({
          title: "Notificacao default",
          description: "Mensagem com fallback de parametros.",
        });
      }}
    >
      Disparar default
    </button>
  );
};

export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Disparar notificacao" }),
    );
    await expect(canvas.getByLabelText("Notificacoes")).toBeInTheDocument();
    await expect(canvas.getByText("Notificacao 1")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Fechar alerta" }),
    );
    await waitFor(async () => {
      await expect(canvas.queryByText("Notificacao 1")).not.toBeInTheDocument();
    });
  },
};

export const ToastFallbackAutoDismiss: Story = {
  render: () => (
    <ToastProvider>
      <ToastDefaultDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Disparar default" }),
    );
    await expect(canvas.getByRole("status")).toBeInTheDocument();
    await expect(canvas.getByText("Notificacao default")).toBeInTheDocument();

    await waitFor(
      async () => {
        await expect(
          canvas.queryByText("Notificacao default"),
        ).not.toBeInTheDocument();
      },
      { timeout: 4500 },
    );
  },
};
