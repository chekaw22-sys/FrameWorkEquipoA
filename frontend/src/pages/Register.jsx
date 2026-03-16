import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { motion } from "framer-motion";

import { UserPlus, User, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await api.post("/auth/register", {
        username,
        password,
      });
      setMessage("¡Registro exitoso! Redirigiendo...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Error al registrar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGlow} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
        className="glass-effect"
      >
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <UserPlus size={32} color="var(--accent-primary)" />
          </div>
          <h1 className="gradient-text" style={styles.title}>Crear Cuenta</h1>
          <p style={styles.subtitle}>Únete a nuestra comunidad hoy</p>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Elige un nombre de usuario"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña segura"
                required
                style={styles.input}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.error}
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.success}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Cargando..." : (
              <>
                Registrarse <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </motion.button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={styles.link}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  backgroundGlow: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "var(--accent-glow)",
    filter: "blur(100px)",
    borderRadius: "50%",
    top: "30%",
    right: "20%",
    zIndex: -1,
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "2.5rem",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-secondary)",
    marginLeft: "4px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    color: "var(--text-muted)",
  },
  input: {
    width: "100%",
    padding: "0.8rem 1rem 0.8rem 2.5rem",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--glass-border)",
    background: "rgba(0, 0, 0, 0.2)",
    color: "var(--text-primary)",
    outline: "none",
  },
  error: {
    color: "var(--error)",
    fontSize: "0.85rem",
    textAlign: "center",
    margin: "0",
  },
  success: {
    color: "var(--success)",
    fontSize: "0.85rem",
    textAlign: "center",
    margin: "0",
  },
  button: {
    padding: "0.8rem",
    borderRadius: "var(--radius-md)",
    border: "none",
    background: "var(--accent-primary)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "0.5rem",
  },
  footer: {
    marginTop: "2rem",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
  },
  link: {
    color: "var(--accent-primary)",
    textDecoration: "none",
    fontWeight: "600",
  },
};
