import axios from "axios";

const runtimeUrl =
  (globalThis?.__APP_CONFIG__ && globalThis.__APP_CONFIG__.VITE_API_URL) || null;
const API_URL = runtimeUrl || import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para incluir JWT automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;