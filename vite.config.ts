import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {},
  build: {
    lib: {
      entry: './packages/index.ts',
      name: 'pretty-preview'
    }
  }
})
