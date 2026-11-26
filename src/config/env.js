// Endereço da API. Vem de VITE_API_URL (arquivo .env); sem ele, usa o backend local.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
