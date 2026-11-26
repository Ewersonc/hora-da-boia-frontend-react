import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A porta 5500 já está liberada no CORS do backend (CORS_ORIGENS).
export default defineConfig({
  plugins: [react()],
  server: { port: 5500, strictPort: true },
  preview: { port: 5500, strictPort: true },
});
