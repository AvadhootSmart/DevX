import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',          // <-- gives you document/window
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/tests/**/*.test.{ts,tsx}'],
  },
})
