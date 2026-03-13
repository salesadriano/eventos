import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { Alert } from "./Alert";
import styles from "./Toast.module.css";
import {
  ToastContext,
  type NotifyPayload,
  type ToastItem,
} from "./toastContext";

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (payload: NotifyPayload) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const next: ToastItem = {
        id,
        title: payload.title,
        description: payload.description,
        variant: payload.variant ?? "info",
      };

      setToasts((prev) => [next, ...prev]);

      const duration = payload.durationMs ?? 3500;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={styles.viewport} role="region" aria-label="Notificacoes">
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast}>
            <Alert
              variant={toast.variant}
              title={toast.title}
              onClose={() => dismiss(toast.id)}
            >
              {toast.description}
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
