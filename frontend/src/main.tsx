import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRouters";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithNavigate>
        <AppRoutes />
      </Auth0ProviderWithNavigate>
    </Router>
  </React.StrictMode>
);
