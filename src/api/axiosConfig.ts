import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://record-book-backend.onrender.com"); // replace with your Render backend

const api = axios.create({
  baseURL: API_URL,
});

export default api;
