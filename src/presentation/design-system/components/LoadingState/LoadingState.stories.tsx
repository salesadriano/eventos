import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "Design System/Components/LoadingState",
  component: LoadingState,
  parameters: {
    docs: {
      description: {
        component:
          'Estados de carregamento com spinner e skeleton reutilizaveis para formularios, cards e listas.\n\nExemplo:\n```tsx\n<LoadingState variant="spinner" size="md" message="Carregando dados..." />\n```',
      },
    },
  },
  args: {
    variant: "spinner",
    size: "md",
    message: "Carregando dados...",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const SpinnerSizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <LoadingState variant="spinner" size="sm" message="Carregando (sm)" />
      <LoadingState variant="spinner" size="md" message="Carregando (md)" />
      <LoadingState variant="spinner" size="lg" message="Carregando (lg)" />
    </div>
  ),
};

export const Skeleton: Story = {
  args: {
    variant: "skeleton",
    lines: 4,
  },
};
