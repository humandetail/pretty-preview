import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  return {
    test: {
      environment: 'happy-dom'
    },
    plugins: [
      dts({
        copyDtsFiles: true
      })
    ],
    build: {
      lib: {
        entry: './index.ts',
        name: 'PrettyPreview',
        fileName: 'pretty-preview',
        formats: ['es', 'iife']
      },
      sourcemap: mode !== 'production'
    }
  }
})
