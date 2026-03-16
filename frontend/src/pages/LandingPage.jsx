
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, ArrowRight, Bot, Database } from "lucide-react";

export default function LandingPage() {
    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.nav}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}><Activity size={24} color="white" /></div>
                    <span style={styles.logoText}>MediAI</span>
                </div>
                <div style={styles.navLinks}>
                    <Link to="/login" style={styles.link}>Iniciar Sesión</Link>
                    <Link to="/register" style={styles.ctaButton}>Registrarse</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={styles.hero}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={styles.heroContent}
                >
                    <div style={styles.badge}>
                        <span style={styles.badgetext}>Nuevo Motor de IA 2.0</span>
                    </div>
                    <h1 style={styles.title}>
                        Diagnósticos Médicos <br />
                        <span style={styles.gradientText}>Potenciados por IA</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Una herramienta revolucionaria para profesionales de la salud.
                        Detecta enfermedades, sugiere tratamientos y genera informes en segundos.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/register" style={styles.primaryButton}>
                            Prueba Gratis <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" style={styles.secondaryButton}>
                            Ver Demo
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={styles.heroImage}
                >
                    <div style={styles.floatingCard1}>
                        <Bot size={32} color="#8b5cf6" />
                        <div>
                            <strong>Análisis Rápido</strong>
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Procesando síntomas...</p>
                        </div>
                    </div>
                    <div style={styles.floatingCard2}>
                        <Shield size={32} color="#10b981" />
                        <div>
                            <strong>Datos Seguros</strong>
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Encriptación E2E</p>
                        </div>
                    </div>
                    <div style={styles.circleGradient} />
                </motion.div>
            </section>

            {/* Features Grid */}
            <section style={styles.features}>
                <FeatureCard
                    icon={<Bot size={32} color="#8b5cf6" />}
                    title="IA Avanzada"
                    desc="Algoritmos de aprendizaje profundo entrenados con miles de casos clínicos."
                />
                <FeatureCard
                    icon={<Zap size={32} color="#f59e0b" />}
                    title="Resultados al Instante"
                    desc="Obtén pre-diagnósticos y recomendaciones de tratamiento en tiempo real."
                />
                <FeatureCard
                    icon={<Database size={32} color="#ec4899" />}
                    title="Base de Conocimiento"
                    desc="Acceso a una biblioteca médica actualizada constantemente."
                />
            </section>

            <footer style={styles.footer}>
                <p>© 2026 MediAI Solutions. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            style={styles.featureCard}
        >
            <div style={styles.iconBox}>{icon}</div>
            <h3 style={styles.featureTitle}>{title}</h3>
            <p style={styles.featureDesc}>{desc}</p>
        </motion.div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
    },
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 3rem",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    logoIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {
        fontSize: "1.5rem",
        fontWeight: "700",
        letterSpacing: "-0.5px",
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "2rem",
    },
    link: {
        textDecoration: "none",
        color: "var(--text-secondary)",
        fontWeight: "500",
        transition: "0.2s",
    },
    ctaButton: {
        textDecoration: "none",
        backgroundColor: "var(--text-primary)", // Contrast
        color: "var(--bg-primary)",
        padding: "0.8rem 1.5rem",
        borderRadius: "50px",
        fontWeight: "600",
        transition: "0.2s",
    },
    hero: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4rem 3rem",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "80vh",
    },
    heroContent: {
        flex: 1,
        maxWidth: "600px",
    },
    badge: {
        display: "inline-block",
        padding: "0.5rem 1rem",
        borderRadius: "50px",
        background: "rgba(99, 102, 241, 0.1)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        marginBottom: "1.5rem",
    },
    badgetext: {
        color: "#6366f1",
        fontWeight: "600",
        fontSize: "0.9rem",
    },
    title: {
        fontSize: "3.5rem",
        fontWeight: "800",
        lineHeight: "1.1",
        marginBottom: "1.5rem",
        letterSpacing: "-1px",
    },
    gradientText: {
        background: "linear-gradient(to right, #6366f1, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "var(--text-secondary)",
        marginBottom: "2.5rem",
        lineHeight: "1.6",
    },
    heroButtons: {
        display: "flex",
        gap: "1rem",
    },
    primaryButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        backgroundColor: "#6366f1",
        color: "white",
        padding: "1rem 2rem",
        borderRadius: "12px",
        fontWeight: "600",
        boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
        transition: "0.2s",
    },
    secondaryButton: {
        textDecoration: "none",
        backgroundColor: "var(--bg-tertiary)",
        color: "var(--text-primary)",
        padding: "1rem 2rem",
        borderRadius: "12px",
        fontWeight: "600",
        border: "1px solid var(--glass-border)",
    },
    heroImage: {
        flex: 1,
        position: "relative",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    circleGradient: {
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #ec4899 180deg, #6366f1 360deg)",
        filter: "blur(80px)",
        opacity: 0.3,
        position: "absolute",
        zIndex: -1,
    },
    floatingCard1: {
        position: "absolute",
        top: "20%",
        right: "10%",
        background: "var(--bg-tertiary)",
        padding: "1.5rem",
        borderRadius: "20px",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        animation: "float 6s ease-in-out infinite",
    },
    floatingCard2: {
        position: "absolute",
        bottom: "20%",
        left: "10%",
        background: "var(--bg-tertiary)",
        padding: "1.5rem",
        borderRadius: "20px",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        animation: "float 8s ease-in-out infinite reverse",
    },
    features: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
        padding: "4rem 3rem",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    featureCard: {
        background: "var(--bg-tertiary)",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid var(--glass-border)",
    },
    iconBox: {
        background: "var(--glass-bg)",
        width: "60px",
        height: "60px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
    },
    featureTitle: {
        fontSize: "1.25rem",
        fontWeight: "700",
        marginBottom: "0.5rem",
    },
    featureDesc: {
        color: "var(--text-secondary)",
        lineHeight: "1.6",
    },
    footer: {
        textAlign: "center",
        padding: "2rem",
        borderTop: "1px solid var(--glass-border)",
        color: "var(--text-muted)",
        fontSize: "0.9rem",
    }
};
