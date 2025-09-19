import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Centralized axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Optional: log API base
if (import.meta.env.MODE === "development") {
  console.log(`Using API_BASE: ${API_BASE} (development)`);
} else {
  console.log(`Using API_BASE: ${API_BASE} (production)`);
}

export default api;
