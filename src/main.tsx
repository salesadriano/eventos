import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes.tsx";
import "./index.css";
import { AuthProvider } from "./presentation/contexts/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
