import { useState, type FC } from "react";
import { useAuth } from "../hooks/useAuth";

interface LoginProps {
  className?: string;
  title?: string;
  description?: string;
  id?: string;
}

export const Login: FC<LoginProps> = ({
  className = "",
  title = "Acessar painel",
  description,
  id,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, oauthProviders, startOAuthLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === "login"
          ? "Não foi possível acessar. Verifique suas credenciais."
          : "Não foi possível concluir o autocadastro."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`login-panel ${className}`} id={id}>
      <div className="panel-header">
        <p className="eyebrow">Portal interno</p>
        <div>
          <h3>{mode === "login" ? title : "Autocadastro"}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className="form-field">
            <span>Nome</span>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome completo"
            />
          </label>
        )}
        <label className="form-field">
          <span>Email institucional</span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nome@org.gov"
          />
        </label>
        <label className="form-field">
          <span>Senha</span>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn primary full" type="submit" disabled={isLoading}>
          {isLoading
            ? mode === "login"
              ? "Entrando..."
              : "Cadastrando..."
            : mode === "login"
            ? "Entrar"
            : "Criar conta"}
        </button>
        <button
          className="btn ghost full"
          type="button"
          onClick={() => {
            setError(null);
            setMode((current) => (current === "login" ? "register" : "login"));
          }}
          disabled={isLoading}
        >
          {mode === "login"
            ? "Não tenho conta (autocadastro)"
            : "Já tenho conta"}
        </button>
        {mode === "login" && oauthProviders.length > 0 && (
          <>
            <p className="muted" style={{ marginTop: 12 }}>
              ou continue com
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {oauthProviders.map((provider) => (
                <button
                  key={provider.provider}
                  className="btn ghost full"
                  type="button"
                  onClick={() => void startOAuthLogin(provider.provider)}
                >
                  Entrar com {provider.displayName}
                </button>
              ))}
            </div>
          </>
        )}
      </form>
    </section>
  );
};
