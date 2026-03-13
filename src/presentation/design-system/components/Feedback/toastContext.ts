import { createContext, useContext } from "react";
import type { AlertVariant } from "./Alert";

export interface ToastItem {
  id: number;
  title: string;
  description: string;
  variant: AlertVariant;
}

export interface NotifyPayload {
  title: string;
  description: string;
  variant?: AlertVariant;
  durationMs?: number;
}

export interface ToastContextValue {
  notify: (payload: NotifyPayload) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }

  return ctx;
};
