
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
    Users, Activity, Calendar, Settings, LogOut, LayoutDashboard, MessageSquare,
    TrendingUp, AlertCircle, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const dataVisits = [
    { name: "Lun", consultas: 12 },
    { name: "Mar", consultas: 19 },
    { name: "Mié", consultas: 15 },
    { name: "Jue", consultas: 22 },
    { name: "Vie", consultas: 28 },
    { name: "Sáb", consultas: 10 },
    { name: "Dom", consultas: 5 },
];

const dataDist = [
    { name: "Gripe", value: 35 },
    { name: "Covid-19", value: 20 },
    { name: "Alergias", value: 15 },
    { name: "Migraña", value: 10 },
    { name: "Otros", value: 20 },
];

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}><Activity size={28} color="white" /></div>
                    <h1 style={styles.logoText}>MediAI</h1>
                </div>

                <nav style={styles.nav}>
                    <Link to="/dashboard" style={{ ...styles.navItem, ...styles.navItemActive }}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/chat" style={styles.navItem}>
                        <MessageSquare size={20} /> Chat Médico
                    </Link>
                    <Link to="#" style={styles.navItem}>
                        <Calendar size={20} /> Citas
                    </Link>
                    <Link to="#" style={styles.navItem}>
                        <Users size={20} /> Pacientes
                    </Link>
                    <Link to="#" style={styles.navItem}>
                        <Settings size={20} /> Configuración
                    </Link>
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Panel General</h2>
                        <p style={styles.subtitle}>Bienvenido, Dr. Usuario</p>
                    </div>
                    <div style={styles.headerRight}>
                        <span style={styles.date}>{new Date().toLocaleDateString()}</span>
                        <div style={styles.avatar}>DR</div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div style={styles.gridCards}>
                    <StatCard
                        title="Pacientes Hoy"
                        value="24"
                        icon={<Users size={24} color="#6366f1" />}
                        trend="+12%"
                        color="rgba(99, 102, 241, 0.1)"
                    />
                    <StatCard
                        title="Consultas IA"
                        value="156"
                        icon={<Activity size={24} color="#ec4899" />}
                        trend="+8%"
                        color="rgba(236, 72, 153, 0.1)"
                    />
                    <StatCard
                        title="Precisión"
                        value="98.5%"
                        icon={<CheckCircle size={24} color="#10b981" />}
                        trend="+2%"
                        color="rgba(16, 185, 129, 0.1)"
                    />
                    <StatCard
                        title="Alertas"
                        value="3"
                        icon={<AlertCircle size={24} color="#f59e0b" />}
                        trend="Bajo"
                        color="rgba(245, 158, 11, 0.1)"
                    />
                </div>

                {/* Charts */}
                <div style={styles.gridCharts}>
                    {/* Main Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.cardTitle}>Consultas Semanales</h3>
                        <div style={{ height: 300, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dataVisits}>
                                    <defs>
                                        <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="consultas" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorConsultas)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.cardTitle}>Enfermedades Frecuentes</h3>
                        <div style={{ height: 300, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataDist}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            style={{ ...styles.statCard, borderBottom: `4px solid ${color.replace('0.1', '1')}` }}
        >
            <div style={{ ...styles.iconBox, backgroundColor: color }}>
                {icon}
            </div>
            <div>
                <h4 style={styles.statTitle}>{title}</h4>
                <div style={styles.statValueRow}>
                    <span style={styles.statValue}>{value}</span>
                    <span style={styles.statTrend}>{trend}</span>
                </div>
            </div>
        </motion.div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
        width: "260px",
        backgroundColor: "var(--bg-secondary)", // Sidebar color
        borderRight: "1px solid var(--glass-border)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
    },
    logoArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "3rem",
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
        fontSize: "1.4rem",
        fontWeight: "700",
        background: "linear-gradient(to right, #6366f1, #8b5cf6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1,
    },
    navItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "12px",
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: "500",
        transition: "all 0.2s ease",
    },
    navItemActive: {
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        color: "#6366f1",
    },
    logoutBtn: {
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px",
        border: "none",
        background: "transparent",
        color: "#ef4444",
        cursor: "pointer",
        fontSize: "0.95rem",
        transition: "0.2s",
    },
    main: {
        flex: 1,
        padding: "2rem",
        overflowY: "auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    title: {
        fontSize: "1.8rem",
        fontWeight: "700",
        marginBottom: "0.2rem",
    },
    subtitle: {
        color: "var(--text-secondary)",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
    },
    date: {
        color: "var(--text-secondary)",
        fontSize: "0.9rem",
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ec4899, #f43f5e)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(236, 72, 153, 0.3)",
    },
    gridCards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.5rem",
        marginBottom: "2rem",
    },
    statCard: {
        backgroundColor: "var(--bg-tertiary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        cursor: "default",
    },
    iconBox: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statTitle: {
        fontSize: "0.9rem",
        color: "var(--text-secondary)",
        marginBottom: "0.2rem",
    },
    statValueRow: {
        display: "flex",
        alignItems: "baseline",
        gap: "0.5rem",
    },
    statValue: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "var(--text-primary)",
    },
    statTrend: {
        fontSize: "0.8rem",
        color: "#10b981",
        fontWeight: "600",
    },
    gridCharts: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "1.5rem",
    },
    chartCard: {
        backgroundColor: "var(--bg-tertiary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-sm)",
        minHeight: "350px",
    },
    cardTitle: {
        fontSize: "1.1rem",
        fontWeight: "600",
        marginBottom: "1.5rem",
    }
};
