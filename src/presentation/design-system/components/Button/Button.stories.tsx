import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Components/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Botao base do Design System para acoes principais, secundarias e destrutivas.\n\nUso recomendado:\n- primary: acao principal da tela\n- secondary: acao complementar\n- ghost: acao secundaria discreta\n- danger: acao destrutiva\n\nExemplo:\n```tsx\n<Button variant="primary">Salvar</Button>\n```',
      },
    },
  },
  args: {
    children: "Salvar",
    variant: "primary",
    size: "default",
    isLoading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button>Default</Button>
      <Button isLoading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button size="full" style={{ maxWidth: 280 }}>
        Full Width
      </Button>
    </div>
  ),
};
