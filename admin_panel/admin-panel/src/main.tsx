import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
      <ToastContainer
        position="top-right"
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </AuthProvider>
  </React.StrictMode>
);