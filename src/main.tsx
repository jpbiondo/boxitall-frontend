import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <App />
      </AppTheme>
    </BrowserRouter>
  </StrictMode>
);
