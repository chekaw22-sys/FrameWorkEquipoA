import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LandingPage from "./pages/LandingPage";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Toaster position="top-center" richColors />
      <Routes location={location} key={location.pathname}>
        {/* Landing Page como Home */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Página no encontrada */}
        <Route path="*" element={
          <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            color: "var(--text-primary)"
          }}>
            <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
            <p>Página no encontrada</p>
            <button
              onClick={() => window.location.href = "/"}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                background: "var(--accent-primary)",
                color: "white",
                cursor: "pointer"
              }}
            >
              Volver al inicio
            </button>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  );
}
