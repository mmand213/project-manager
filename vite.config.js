// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/it-infra-pm/',    // ← ensures assets load from the right sub-path
  plugins: [react()],
})
