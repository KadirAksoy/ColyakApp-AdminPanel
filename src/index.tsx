import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./App";
import { AuthProvider } from "./auth/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
