import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <App />
      </AppTheme>
    </BrowserRouter>
  </>
);
