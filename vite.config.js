import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/it-infra-pm/',
  plugins: [react()],
})
