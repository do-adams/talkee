import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globalSetup: [fileURLToPath(new URL('./src/vitest/setup.ts', import.meta.url))],
      deps: {
        // Fixes build issues for Vuetify 3: https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1481017103
        inline: ['vuetify']
      }
    }
  })
)
