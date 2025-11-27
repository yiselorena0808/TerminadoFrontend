import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 server: {
    proxy: {
      "/capture": "http://10.3.43.191:5000"
    }
  }
})
