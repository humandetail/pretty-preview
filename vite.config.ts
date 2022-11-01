import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  test: {
    environment: 'happy-dom'
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'PrettyPreview',
      fileName: 'pretty-preview',
      formats: ['es', 'iife']
    }
  },
  plugins: [
    dts()
  ]
})
