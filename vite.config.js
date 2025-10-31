import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: '../backend/src/main/resources/static', // Spring 프로젝트 구조에 맞게 경로 지정
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Spring API 프록시
    },
    port: 8080,
    open: true,
    historyApiFallback: true, // React Router SPA 지원
  },
});
