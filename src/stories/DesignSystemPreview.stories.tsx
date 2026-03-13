import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Design System/Foundations Preview",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const BaseStyles: Story = {
  render: () => (
    <div className="app-shell" style={{ minHeight: "auto" }}>
      <main className="main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">Preview</p>
            <h1>Design System Base</h1>
            <p className="muted">
              Validacao inicial de cores, tipografia e componentes base.
            </p>
            <div className="hero-actions">
              <button className="btn primary" type="button">
                Primary
              </button>
              <button className="btn ghost" type="button">
                Ghost
              </button>
              <button className="btn danger ghost" type="button">
                Danger
              </button>
            </div>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Panel Card</p>
            <h3>Componente base</h3>
            <p className="muted">
              Card padrao com variaveis globais e estilo institucional.
            </p>
            <div className="alert">
              <strong>Estado de alerta</strong>
              <p>Mensagem visual para validar contraste e legibilidade.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  ),
};
