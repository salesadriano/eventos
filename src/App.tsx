import "./App.css";
import brandLogo from "./assets/cgeac-logo.svg";
import type { Event as EventModel } from "./domain/entities/Event";
import { Login } from "./presentation/components/Login";
import { useAuth } from "./presentation/hooks/useAuth";
import { useEvents } from "./presentation/hooks/useEventService";

const featuredEvent = {
  title: "3º Encontro de Ouvidorias Setoriais",
  theme: "Ouvidoria na prática",
  location: "Auditório da Biblioteca Pública",
  dateLabel: "14 de novembro de 2025 · 9h às 12h",
  status: "Inscrições Encerradas",
};

const formatDate = (value: Date | string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { events, loading, error, deleteEvent } = useEvents();

  const visitorEvents = events.slice(0, 3);
  const cardsToRender: Array<EventModel | null> = loading
    ? Array.from({ length: 3 }, () => null)
    : visitorEvents;

  if (isLoading) {
    return (
      <div className="app-shell loading-shell">
        <div className="loading-state">
          <p className="eyebrow">Portal CGEAC</p>
          <h2>Validando sessão...</h2>
          <p className="muted">Isso pode levar apenas alguns segundos.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <section className="panel-card dashboard-card" id="painel">
      <div className="panel-header">
        <p className="eyebrow">Painel administrativo</p>
        <div>
          <h3>Eventos publicados</h3>
          <p className="muted">Gerencie conteúdos visíveis no portal público</p>
        </div>
        <button className="btn ghost" onClick={logout}>
          Sair
        </button>
      </div>
      <div className="dashboard-user">
        <div>
          <strong>{user?.name}</strong>
          <p className="muted">Perfil: {user?.profile}</p>
        </div>
        <span>{user?.email}</span>
      </div>
      <div className="dashboard-events">
        {loading && <p>Carregando eventos...</p>}
        {error && <p className="error-text">Erro: {error.message}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="muted">Nenhum evento cadastrado.</p>
        )}
        {!loading &&
          !error &&
          events.map((event) => (
            <article key={event.id} className="dashboard-event-item">
              <div>
                <h4>{event.title}</h4>
                <p className="muted">{formatDate(event.date)}</p>
                <small>{event.location}</small>
              </div>
              <button
                className="btn danger ghost"
                onClick={() => deleteEvent(event.id)}
              >
                Remover
              </button>
            </article>
          ))}
      </div>
    </section>
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="branding">
          <img src={brandLogo} alt="CGEAC" />
          <div>
            <p className="eyebrow">Controladoria-Geral do Estado</p>
            <strong>Portal de Eventos</strong>
          </div>
        </div>
        <nav className="site-nav">
          <a href="#event-details">O evento</a>
          <a href="#inscricoes">Inscrições</a>
          <a href="#painel">Painel</a>
        </nav>
        <button className="btn ghost">Contate a equipe</button>
      </header>

      <main className="main-content">
        <section className="hero" id="event-details">
          <div>
            <p className="eyebrow">Próximo destaque</p>
            <h1>{featuredEvent.title}</h1>
            <p className="hero-subtitle">
              Tema: <strong>{featuredEvent.theme}</strong>
            </p>
            <ul className="hero-meta">
              <li>
                <span>Local</span>
                <strong>{featuredEvent.location}</strong>
              </li>
              <li>
                <span>Data</span>
                <strong>{featuredEvent.dateLabel}</strong>
              </li>
            </ul>
            <div className="hero-actions">
              <a className="btn primary" href="#inscricoes">
                Informações do evento
              </a>
              <a className="btn ghost" href="mailto:eventos@cgeac.com.br">
                Fale com a equipe
              </a>
            </div>
          </div>
          <div className="hero-highlight">
            <span className="status-chip closed">{featuredEvent.status}</span>
            <p>
              As vagas foram preenchidas. Em breve abriremos novos encontros.
            </p>
            <div className="status-card">
              <p>Auditório Biblioteca Pública</p>
              <small>Av. Pedro Ludovico, 231 - Goiânia/GO</small>
            </div>
          </div>
        </section>

        <section className="content-grid" id="inscricoes">
          <article className="panel-card">
            <div className="panel-header">
              <p className="eyebrow">Formulário</p>
              <div>
                <h3>Inscrições Encerradas</h3>
                <p className="muted">
                  O formulário foi desativado após atingir a capacidade máxima.
                </p>
              </div>
            </div>
            <ul className="steps-list">
              <li>Cadastre-se com os dados institucionais.</li>
              <li>Aguarde confirmação no e-mail informado.</li>
              <li>No dia do evento, apresente o QR Code recebido.</li>
            </ul>
            <div className="alert">
              <strong>Inscrições concluídas</strong>
              <p>
                Continue acompanhando o portal para garantir sua vaga nos
                próximos encontros regionais.
              </p>
            </div>
          </article>

          {!isAuthenticated ? (
            <Login
              title="Acessar painel interno"
              description="Use suas credenciais institucionais para cadastrar novos eventos."
              className="panel-card"
              id="painel"
            />
          ) : (
            renderDashboard()
          )}
        </section>

        <section className="events-gallery">
          <header>
            <div>
              <p className="eyebrow">Eventos em destaque</p>
              <h2>Agenda CGEAC</h2>
            </div>
            <span className="muted">
              {loading ? "Buscando eventos..." : `${events.length} publicados`}
            </span>
          </header>
          {error && <p className="error-text">Erro: {error.message}</p>}
          {!error && (
            <div className="events-grid">
              {cardsToRender.map((event, index) => (
                <article key={event?.id ?? index} className="event-card">
                  <p className="event-date">
                    {event ? formatDate(event.date) : "Carregando..."}
                  </p>
                  <h3>{event?.title ?? "Evento"}</h3>
                  <p className="muted">
                    {event?.description ??
                      "Atualizando informações sobre o próximo encontro."}
                  </p>
                  <div className="event-location">
                    <span>{event?.location ?? ""}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} Controladoria-Geral do Estado. Portal
          desenvolvido para apoiar a agenda de eventos institucionais.
        </p>
      </footer>
    </div>
  );
}

export default App;
