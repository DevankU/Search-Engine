import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from any network (default is 'localhost')
    port: 5173, // Set the port you want to use
    // You can also specify other server options if needed
  },
})
