import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Design System/Components/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de formulario com label superior, helper text e estados de validacao.\n\nUso recomendado:\n- usar helperText para orientacao de preenchimento\n- usar errorMessage para feedback de validacao\n\nExemplo:\n```tsx\n<Input label="Email" type="email" helperText="nome@org.gov" />\n```',
      },
    },
  },
  args: {
    label: "Email institucional",
    placeholder: "nome@org.gov",
    helperText: "Use seu email corporativo.",
    state: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Input
        label="Default"
        placeholder="Texto"
        state="default"
        helperText="Campo opcional"
      />
      <Input
        label="Success"
        placeholder="Validado"
        state="success"
        helperText="Valor valido"
      />
      <Input
        label="Warning"
        placeholder="Atencao"
        state="warning"
        helperText="Revise este dado"
      />
      <Input
        label="Error"
        placeholder="Invalido"
        state="error"
        errorMessage="Campo obrigatorio"
      />
    </div>
  ),
};
