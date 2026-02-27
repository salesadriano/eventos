import { useState } from "react";
import { useOperationalFlows } from "../hooks/useOperationalFlows";

export const OperationalFlowsPanel: React.FC = () => {
  const {
    loading,
    inscriptions,
    presences,
    eligibleCertificates,
    createInscription,
    createPresence,
  } = useOperationalFlows();

  const [inscriptionForm, setInscriptionForm] = useState({
    eventId: "",
    userId: "",
    activityId: "",
  });
  const [presenceForm, setPresenceForm] = useState({
    eventId: "",
    userId: "",
    activityId: "",
  });

  return (
    <article className="panel-card" style={{ marginTop: 16 }}>
      <div className="panel-header">
        <p className="eyebrow">Operacional</p>
        <div>
          <h3>Inscrições, presença e certificado</h3>
          <p className="muted">Fluxo MVP para registro e elegibilidade.</p>
        </div>
      </div>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          void createInscription({
            eventId: inscriptionForm.eventId,
            userId: inscriptionForm.userId,
            activityId: inscriptionForm.activityId || undefined,
            status: "confirmed",
          }).then(() =>
            setInscriptionForm({ eventId: "", userId: "", activityId: "" })
          );
        }}
      >
        <label className="form-field">
          <span>Evento (inscrição)</span>
          <input
            value={inscriptionForm.eventId}
            onChange={(event) =>
              setInscriptionForm((current) => ({
                ...current,
                eventId: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Usuário (inscrição)</span>
          <input
            value={inscriptionForm.userId}
            onChange={(event) =>
              setInscriptionForm((current) => ({
                ...current,
                userId: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Atividade (opcional)</span>
          <input
            value={inscriptionForm.activityId}
            onChange={(event) =>
              setInscriptionForm((current) => ({
                ...current,
                activityId: event.target.value,
              }))
            }
          />
        </label>
        <button className="btn ghost" type="submit">
          Registrar inscrição
        </button>
      </form>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          void createPresence({
            eventId: presenceForm.eventId,
            userId: presenceForm.userId,
            activityId: presenceForm.activityId || undefined,
          }).then(() =>
            setPresenceForm({ eventId: "", userId: "", activityId: "" })
          );
        }}
      >
        <label className="form-field">
          <span>Evento (presença)</span>
          <input
            value={presenceForm.eventId}
            onChange={(event) =>
              setPresenceForm((current) => ({
                ...current,
                eventId: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Usuário (presença)</span>
          <input
            value={presenceForm.userId}
            onChange={(event) =>
              setPresenceForm((current) => ({
                ...current,
                userId: event.target.value,
              }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Atividade (opcional)</span>
          <input
            value={presenceForm.activityId}
            onChange={(event) =>
              setPresenceForm((current) => ({
                ...current,
                activityId: event.target.value,
              }))
            }
          />
        </label>
        <button className="btn ghost" type="submit">
          Registrar presença
        </button>
      </form>

      <div className="dashboard-events">
        <p className="muted">
          {loading
            ? "Atualizando fluxo operacional..."
            : `Inscrições: ${inscriptions.length} · Presenças: ${presences.length} · Elegíveis: ${eligibleCertificates.length}`}
        </p>
      </div>
    </article>
  );
};
