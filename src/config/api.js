// src/config/api.js
// Permite alternar facilmente entre o backend local e o backend hospedado no Render
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://suportechamados-6eyi.onrender.com");
