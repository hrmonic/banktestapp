import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "@/lib/auth/authProvider.js";
import { PermissionsProvder } from "@/lib/security/rbac.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Browser>Router>
      <AuthProvider>
        <PermissionsProvider>
          <App />
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
