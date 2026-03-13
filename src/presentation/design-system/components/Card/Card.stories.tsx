import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Design System/Components/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Card reutilizavel para agrupar conteudo com hierarquia visual.\n\nUso recomendado:\n- default: blocos principais\n- outline: blocos neutros\n- subtle: destaque leve de informacao\n\nExemplo:\n```tsx\n<Card title="Resumo" variant="default">Conteudo</Card>\n```',
      },
    },
  },
  args: {
    eyebrow: "Painel",
    title: "Resumo operacional",
    children: "Conteudo do card com informacoes relevantes.",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      <Card title="Default" variant="default">
        Card com sombra.
      </Card>
      <Card title="Outline" variant="outline">
        Card com borda.
      </Card>
      <Card title="Subtle" variant="subtle">
        Card com destaque suave.
      </Card>
    </div>
  ),
};
