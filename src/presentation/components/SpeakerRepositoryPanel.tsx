import { useState } from "react";
import { useSpeakerRepositoryMvp } from "../hooks/useSpeakerRepositoryMvp";

export const SpeakerRepositoryPanel: React.FC = () => {
  const {
    speakers,
    repositoryConfig,
    addSpeaker,
    updateRepository,
    testConnection,
    uploadValidation,
  } = useSpeakerRepositoryMvp();

  const [speakerForm, setSpeakerForm] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileSizeMb, setUploadFileSizeMb] = useState("1");
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [connectionFeedback, setConnectionFeedback] = useState<string | null>(null);

  return (
    <article className="panel-card" style={{ marginTop: 16 }}>
      <div className="panel-header">
        <p className="eyebrow">Palestrantes e repositório</p>
        <div>
          <h3>Gestão MVP de palestrantes/upload</h3>
          <p className="muted">Cadastro, validação de arquivo e configuração ativa.</p>
        </div>
      </div>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          addSpeaker(speakerForm);
          setSpeakerForm({ name: "", email: "", bio: "" });
        }}
      >
        <label className="form-field">
          <span>Nome do palestrante</span>
          <input
            value={speakerForm.name}
            onChange={(event) =>
              setSpeakerForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={speakerForm.email}
            onChange={(event) =>
              setSpeakerForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Bio</span>
          <input
            value={speakerForm.bio}
            onChange={(event) =>
              setSpeakerForm((current) => ({ ...current, bio: event.target.value }))
            }
          />
        </label>
        <button className="btn ghost" type="submit">
          Adicionar palestrante
        </button>
      </form>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          const extension = uploadFileName.split(".").pop()?.toLowerCase() || "";
          const fileSize = Number(uploadFileSizeMb);

          if (!uploadValidation.allowedExtensions.includes(extension)) {
            setUploadFeedback("Tipo de arquivo inválido.");
            return;
          }

          if (fileSize > uploadValidation.maxSizeInMb) {
            setUploadFeedback("Arquivo excede limite de tamanho.");
            return;
          }

          setUploadFeedback("Arquivo validado com sucesso.");
        }}
      >
        <label className="form-field">
          <span>Arquivo da apresentação</span>
          <input
            value={uploadFileName}
            onChange={(event) => setUploadFileName(event.target.value)}
            placeholder="apresentacao.pptx"
            required
          />
        </label>
        <label className="form-field">
          <span>Tamanho (MB)</span>
          <input
            type="number"
            min={1}
            value={uploadFileSizeMb}
            onChange={(event) => setUploadFileSizeMb(event.target.value)}
            required
          />
        </label>
        <button className="btn ghost" type="submit">
          Validar upload
        </button>
        {uploadFeedback && <p className="muted">{uploadFeedback}</p>}
      </form>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          void testConnection().then((connected) =>
            setConnectionFeedback(
              connected
                ? "Conexão com repositório validada."
                : "Falha na conexão. Verifique credenciais."
            )
          );
        }}
      >
        <label className="form-field">
          <span>Provider</span>
          <select
            value={repositoryConfig.provider}
            onChange={(event) =>
              updateRepository({
                ...repositoryConfig,
                provider: event.target.value as "local" | "drive" | "s3",
              })
            }
          >
            <option value="local">local</option>
            <option value="drive">drive</option>
            <option value="s3">s3</option>
          </select>
        </label>
        <label className="form-field">
          <span>Endpoint</span>
          <input
            value={repositoryConfig.endpoint}
            onChange={(event) =>
              updateRepository({ ...repositoryConfig, endpoint: event.target.value })
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Access key</span>
          <input
            value={repositoryConfig.accessKey}
            onChange={(event) =>
              updateRepository({ ...repositoryConfig, accessKey: event.target.value })
            }
            required
          />
        </label>
        <label className="form-field">
          <span>Secret key</span>
          <input
            type="password"
            value={repositoryConfig.secretKey}
            onChange={(event) =>
              updateRepository({ ...repositoryConfig, secretKey: event.target.value })
            }
            required
          />
        </label>
        <button className="btn ghost" type="submit">
          Testar conexão
        </button>
        {connectionFeedback && <p className="muted">{connectionFeedback}</p>}
      </form>

      <div className="dashboard-events">
        <p className="muted">Palestrantes cadastrados: {speakers.length}</p>
      </div>
    </article>
  );
};
