import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { breakpoints, colors, spacing, typography } from "./index";

const meta: Meta = {
  title: "Design System/Foundations/Tokens",
  parameters: {
    docs: {
      description: {
        component:
          "Catalogo de tokens do Design System.\n\nDiretrizes:\n- Cores: aplicar por semantica (surface, text, accent, status).\n- Espacamento: usar escala padronizada para consistencia visual.\n- Tipografia: respeitar hierarquia por tamanho e peso.\n- Breakpoints: manter responsividade com pontos de corte unificados.\n\nExemplo:\n```tsx\n<div style={{ padding: spacing.md, color: colors.text.primary }} />\n```",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  marginBottom: 28,
};

const colorSwatches = [
  { token: "brand.primary", value: colors.brand.primary },
  { token: "brand.secondary", value: colors.brand.secondary },
  { token: "surface.base", value: colors.surface.base },
  { token: "surface.soft", value: colors.surface.soft },
  { token: "text.primary", value: colors.text.primary },
  { token: "text.secondary", value: colors.text.secondary },
  { token: "text.muted", value: colors.text.muted },
  { token: "border.default", value: colors.border.default },
  { token: "semantic.danger", value: colors.semantic.danger },
  { token: "semantic.success", value: colors.semantic.success },
  { token: "semantic.warning", value: colors.semantic.warning },
  { token: "semantic.info", value: colors.semantic.info },
] as const;

export const Catalog: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <section style={sectionStyle}>
        <h3 style={{ margin: 0 }}>Cores</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          {colorSwatches.map(({ token, value }) => (
            <div
              key={token}
              style={{
                border: "1px solid #d7dee7",
                borderRadius: 10,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div style={{ height: 54, background: value }} />
              <div style={{ padding: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>{token}</div>
                <div style={{ opacity: 0.75 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ margin: 0 }}>Espacamento</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(spacing).map(([token, value]) => (
            <div
              key={token}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <strong style={{ width: 40 }}>{token}</strong>
              <div
                style={{
                  width: value,
                  height: 12,
                  background: colors.brand.primary,
                  borderRadius: 6,
                }}
              />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ margin: 0 }}>Tipografia</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(typography.size).map(([token, value]) => (
            <div key={token} style={{ fontSize: value }}>
              <strong>{token}</strong>: Texto de exemplo ({value})
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ margin: 0 }}>Breakpoints</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(breakpoints).map(([token, value]) => (
            <div key={token}>
              <strong>{token}</strong>: {value}
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
