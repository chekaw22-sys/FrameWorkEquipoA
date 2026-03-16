import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

import {
  Send,
  LogOut,
  MessageSquare,
  User as UserIcon,
  Plus,
  History,
  Settings,
  Bot,
  Trash2,
  Menu,
  X,
  Sun,
  Moon,
  Mic,
  Download,
  LayoutDashboard
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import { toast } from "sonner";



export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  }, [isDarkMode]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/chat/history");
      // Flatten the response if necessary. Backend returns List<ChatLog>

      // Flatten the response if necessary. Backend returns List<ChatLog>
      // Convert it to local chat format
      const formattedHistory = res.data.map(log => ([
        { text: log.prompt, sender: "user", id: `p-${log.id}` },
        { text: log.response, sender: "bot", id: `r-${log.id}` }
      ])).flat();
      setChat(formattedHistory);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!prompt.trim() || isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const userMsg = { text: prompt, sender: "user", id: Date.now() };
    setChat((prev) => [...prev, userMsg]);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await api.post("/chat", { message: prompt });


      const serverResponse = res.data?.response ?? "Sin respuesta";
      setChat((prev) => [
        ...prev,
        { text: serverResponse, sender: "bot", id: Date.now() + 1 },
      ]);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setChat((prev) => [
        ...prev,
        { text: "Error al conectar con el servidor.", sender: "bot", id: Date.now() + 2 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Tu navegador no soporta dictado por voz.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Escuchando...");
    };
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => prev + " " + transcript);
    };

    recognition.start();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Informe Médico - IA Helper", 20, 20);

    doc.setFontSize(12);
    let y = 40;

    chat.forEach((msg, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const sender = msg.sender === "user" ? "Doctor: " : "IA: ";
      const text = doc.splitTextToSize(sender + msg.text, 170);

      if (msg.sender === "bot") {
        doc.setTextColor(0, 0, 255);
      } else {
        doc.setTextColor(0, 0, 0);
      }

      doc.text(text, 20, y);
      y += text.length * 7 + 5;
    });

    doc.save("informe_medico.pdf");
    toast.success("Informe descargado correctamente");
  };

  const clearChat = () => {
    setChat([]);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            style={styles.sidebar}
            className="glass-effect"
          >
            <div style={styles.sidebarHeader}>
              <div style={styles.logo}>
                <Bot size={24} color="var(--accent-primary)" />
                <span style={styles.logoText}>IA Helper</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} style={styles.iconButton}>
                <X size={20} />
              </button>
            </div>

            <button onClick={clearChat} style={styles.newChatButton}>
              <Plus size={18} /> Nuevo Chat
            </button>

            <Link to="/dashboard" style={styles.navItem}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            <div style={styles.historySection}>
              <p style={styles.sectionTitle}><History size={14} /> Recientes</p>
              <div style={styles.historyList}>
                {/* Mocked history items for visual variety */}
                <div style={styles.historyItem}>Consulta sobre React</div>
                <div style={styles.historyItem}>Explicación de Spring Boot</div>
                <div style={styles.historyItem}>Refactorización de código</div>
              </div>
            </div>

            <div style={styles.sidebarFooter}>
              <div style={styles.profileSection}>
                <div style={styles.avatar}>
                  <UserIcon size={20} />
                </div>
                <div style={styles.profileInfo}>
                  <span style={styles.profileName}>Usuario</span>
                  <span style={styles.profileStatus}>Online</span>
                </div>
              </div>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <LogOut size={18} /> Salir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={styles.main}>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{ ...styles.iconButton, position: "absolute", top: "20px", left: "20px", zIndex: 10 }}
          >
            <Menu size={20} />
          </button>
        )}

        <header style={styles.chatHeader}>
          <div style={styles.headerInfo}>
            <h2 style={styles.headerTitle}>Chat de Asistencia AI</h2>
            <p style={styles.headerSubtitle}>Siempre listo para ayudarte</p>
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={handleExportPDF}
              style={styles.iconButton}
              title="Exportar PDF"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={styles.iconButton}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button style={styles.iconButton}><Settings size={20} /></button>
            <button onClick={clearChat} style={styles.iconButton}><Trash2 size={20} /></button>
          </div>

        </header>

        <div style={styles.chatArea}>
          {chat.length === 0 ? (
            <div style={styles.emptyState}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.welcomeCard}
                className="glass-effect"
              >
                <Bot size={48} color="var(--accent-primary)" style={{ marginBottom: "1rem" }} />
                <h3>Hola, ¿en qué puedo ayudarte hoy?</h3>
                <p>Hazme cualquier pregunta sobre programación, diseño o lo que necesites.</p>
                <div style={styles.suggestions}>
                  <button onClick={() => setPrompt("¿Qué es un DTO?")}>¿Qué es un DTO?</button>
                  <button onClick={() => setPrompt("Explícame Framer Motion")}>Explícame Framer Motion</button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div style={styles.messagesContainer}>
              {chat.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.sender === "bot" && (
                    <div style={styles.botAvatar}>
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor: msg.sender === "user" ? "var(--accent-primary)" : "var(--bg-tertiary)",
                      borderRadius: msg.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                      border: msg.sender === "user" ? "none" : "1px solid var(--glass-border)",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div style={styles.loadingWrapper}>
                  <div style={styles.dot} />
                  <div style={{ ...styles.dot, animationDelay: "0.2s" }} />
                  <div style={{ ...styles.dot, animationDelay: "0.4s" }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <form style={styles.inputForm} onSubmit={handleSend} className="glass-effect">
            <input
              type="text"
              placeholder="Escribe un mensaje aquí..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              style={{ ...styles.iconButton, color: isListening ? "#ef4444" : "var(--text-secondary)", marginRight: "10px" }}
            >
              <Mic size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!prompt.trim() || isLoading}
              style={{
                ...styles.sendButton,
                opacity: !prompt.trim() || isLoading ? 0.5 : 1,
              }}
            >
              <Send size={20} />
            </motion.button>
          </form>
          <p style={styles.disclaimer}>Utilizando IA Generativa de última generación.</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    backgroundColor: "var(--bg-primary)",
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    zIndex: 100,
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  newChatButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.8rem",
    borderRadius: "var(--radius-md)",
    border: "1px dashed var(--glass-border)",
    background: "transparent",
    color: "var(--text-primary)",
    marginBottom: "2rem",
    fontWeight: "600",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Match alignment of newChatButton if desired, or flex-start
    gap: "0.5rem",
    padding: "0.8rem",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
    color: "var(--text-secondary)",
    marginBottom: "1rem",
    transition: "0.2s",
    border: "1px solid transparent",
  },
  historySection: {
    flex: 1,
    overflowY: "auto",
  },
  sectionTitle: {
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "0.05rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  historyItem: {
    padding: "0.75rem",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "var(--transition-base)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      background: "var(--glass-bg)",
      color: "var(--text-primary)",
    },
  },
  sidebarFooter: {
    borderTop: "1px solid var(--glass-border)",
    paddingTop: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "var(--accent-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent-primary)",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
  },
  profileName: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  profileStatus: {
    fontSize: "0.75rem",
    color: "var(--success)",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem",
    color: "var(--error)",
    background: "transparent",
    border: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    width: "fit-content",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  chatHeader: {
    padding: "1.25rem 2rem",
    borderBottom: "1px solid var(--glass-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(10, 10, 15, 0.5)",
    backdropFilter: "blur(4px)",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
  },
  headerActions: {
    display: "flex",
    gap: "0.5rem",
  },
  iconButton: {
    padding: "0.5rem",
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: "var(--glass-bg)",
      color: "var(--text-primary)",
    },
  },
  chatArea: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeCard: {
    padding: "3rem",
    borderRadius: "var(--radius-lg)",
    textAlign: "center",
    maxWidth: "500px",
  },
  suggestions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    marginTop: "1.5rem",
    flexWrap: "wrap",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.75rem",
  },
  botAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "var(--accent-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent-primary)",
    marginBottom: "4px",
  },
  bubble: {
    maxWidth: "70%",
    padding: "0.9rem 1.25rem",
    fontSize: "0.95rem",
    lineHeight: "1.4",
    color: "white",
    boxShadow: "var(--shadow-sm)",
  },
  loadingWrapper: {
    display: "flex",
    gap: "4px",
    padding: "1rem",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent-primary)",
    animation: "bounce 1.4s infinite ease-in-out",
  },
  inputArea: {
    padding: "1.5rem 2rem 2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  inputForm: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius-xl)",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    padding: "0.75rem",
    outline: "none",
    fontSize: "1rem",
  },
  sendButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "var(--accent-primary)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  disclaimer: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
  },
};


