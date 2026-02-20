import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from '@tailwindcss/vite' // Add this line
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this line
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})