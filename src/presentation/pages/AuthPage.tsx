import { Navigate } from "react-router-dom";
import { Login } from "../components/Login";
import { useAuth } from "../hooks/useAuth";

export const AuthPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-shell loading-shell">
        <div className="loading-state">
          <p className="eyebrow">Portal CGEAC</p>
          <h2>Carregando autenticação...</h2>
          <p className="muted">Aguarde um instante.</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell" style={{ alignItems: "center", justifyContent: "center" }}>
      <main className="main-content" style={{ width: "100%", maxWidth: 720 }}>
        <Login
          title="Acessar conta"
          description="Entre ou faça autocadastro para acessar o painel."
          className="panel-card"
        />
      </main>
    </div>
  );
};
