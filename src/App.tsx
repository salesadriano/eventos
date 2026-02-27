import "./App.css";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import brandLogo from "./assets/cgeac-logo.svg";
import type { Event as EventModel } from "./domain/entities/Event";
import { Login } from "./presentation/components/Login";
import { OperationalFlowsPanel } from "./presentation/components/OperationalFlowsPanel";
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
  const {
    isAuthenticated,
    isLoading,
    user,
    logout,
    completeOAuthCallback,
  } = useAuth();
  const { events, loading, error, deleteEvent, createEvent } = useEvents();
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    dateInit: "",
    dateFinal: "",
    inscriptionInit: "",
    inscriptionFinal: "",
    appHeaderImageUrl: "",
    certificateHeaderImageUrl: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const code = params.get("code");
    const state = params.get("state");

    if (provider && code && state) {
      void completeOAuthCallback({ provider, code, state })
        .catch(() => undefined)
        .finally(() => {
          const nextUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, document.title, nextUrl);
        });
    }
  }, [completeOAuthCallback]);

  const visitorEvents = events.slice(0, 3);
  const cardsToRender: Array<EventModel | null> = loading
    ? Array.from({ length: 3 }, () => null)
    : visitorEvents;

  const filteredAdminEvents = useMemo(() => {
    const normalized = filterText.trim().toLowerCase();
    if (!normalized) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.location].some((field) =>
        String(field || "").toLowerCase().includes(normalized)
      )
    );
  }, [events, filterText]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAdminEvents.length / pageSize));
  const paginatedAdminEvents = filteredAdminEvents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSavingEvent(true);
          void createEvent({
            title: eventForm.title,
            description: eventForm.description,
            location: eventForm.location,
            date: new Date(eventForm.dateInit || new Date()),
            dateInit: new Date(eventForm.dateInit || new Date()),
            dateFinal: new Date(eventForm.dateFinal || eventForm.dateInit || new Date()),
            inscriptionInit: new Date(
              eventForm.inscriptionInit || eventForm.dateInit || new Date()
            ),
            inscriptionFinal: new Date(
              eventForm.inscriptionFinal || eventForm.dateFinal || new Date()
            ),
            appHeaderImageUrl: eventForm.appHeaderImageUrl,
            certificateHeaderImageUrl: eventForm.certificateHeaderImageUrl,
          })
            .then(() => {
              setEventForm({
                title: "",
                description: "",
                location: "",
                dateInit: "",
                dateFinal: "",
                inscriptionInit: "",
                inscriptionFinal: "",
                appHeaderImageUrl: "",
                certificateHeaderImageUrl: "",
              });
            })
            .finally(() => setIsSavingEvent(false));
        }}
      >
        <label className="form-field">
          <span>Título</span>
          <input
            value={eventForm.title}
            onChange={(event) =>
              setEventForm((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Descrição</span>
          <input
            value={eventForm.description}
            onChange={(event) =>
              setEventForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Local</span>
          <input
            value={eventForm.location}
            onChange={(event) =>
              setEventForm((current) => ({ ...current, location: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Início do evento</span>
          <input
            type="datetime-local"
            value={eventForm.dateInit}
            onChange={(event) =>
              setEventForm((current) => ({ ...current, dateInit: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Fim do evento</span>
          <input
            type="datetime-local"
            value={eventForm.dateFinal}
            onChange={(event) =>
              setEventForm((current) => ({ ...current, dateFinal: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Início das inscrições</span>
          <input
            type="datetime-local"
            value={eventForm.inscriptionInit}
            onChange={(event) =>
              setEventForm((current) => ({
                ...current,
                inscriptionInit: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Fim das inscrições</span>
          <input
            type="datetime-local"
            value={eventForm.inscriptionFinal}
            onChange={(event) =>
              setEventForm((current) => ({
                ...current,
                inscriptionFinal: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Imagem header app (URL)</span>
          <input
            type="url"
            value={eventForm.appHeaderImageUrl}
            onChange={(event) =>
              setEventForm((current) => ({
                ...current,
                appHeaderImageUrl: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>
        <label className="form-field">
          <span>Imagem header certificado (URL)</span>
          <input
            type="url"
            value={eventForm.certificateHeaderImageUrl}
            onChange={(event) =>
              setEventForm((current) => ({
                ...current,
                certificateHeaderImageUrl: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>
        <button className="btn primary full" type="submit" disabled={isSavingEvent}>
          {isSavingEvent ? "Salvando..." : "Cadastrar evento"}
        </button>
      </form>
      <label className="form-field">
        <span>Filtrar eventos</span>
        <input
          value={filterText}
          placeholder="Título ou local"
          onChange={(event) => {
            setFilterText(event.target.value);
            setPage(1);
          }}
        />
      </label>
      <div className="dashboard-events">
        {loading && <p>Carregando eventos...</p>}
        {error && <p className="error-text">Erro: {error.message}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="muted">Nenhum evento cadastrado.</p>
        )}
        {!loading &&
          !error &&
          paginatedAdminEvents.map((event) => (
            <article key={event.id} className="dashboard-event-item">
              <div>
                <h4>{event.title}</h4>
                <p className="muted">
                  {formatDate(event.dateInit ?? event.date)} até{" "}
                  {formatDate(event.dateFinal ?? event.date)}
                </p>
                <small>{event.location}</small>
                {(event.appHeaderImageUrl || event.certificateHeaderImageUrl) && (
                  <small>
                    Identidade visual configurada
                  </small>
                )}
              </div>
              <button
                className="btn danger ghost"
                onClick={() => deleteEvent(event.id)}
              >
                Remover
              </button>
            </article>
          ))}
        {!loading && !error && totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn ghost"
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </button>
            <span className="muted">Página {page} de {totalPages}</span>
            <button
              className="btn ghost"
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              Próxima
            </button>
          </div>
        )}
      </div>
      <OperationalFlowsPanel />
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
