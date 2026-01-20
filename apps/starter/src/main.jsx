import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "@/lib/auth/authProvider.js";
import { PermissionsProvider } from "@/lib/security/rbac.js";
import "./index.css";

/**
 * Application entrypoint.
 *
 * Router + Auth + Permissions providers are all wired here so that
 * the rest of the app can remain focused on business logic and UI.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PermissionsProvider>
          <App />
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
