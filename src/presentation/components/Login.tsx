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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível acessar. Verifique suas credenciais."
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
          <h3>{title}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
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
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
};
