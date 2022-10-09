import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom'
  },
  build: {
    lib: {
      entry: './packages/index.ts',
      name: 'pretty-preview'
    }
  }
})
