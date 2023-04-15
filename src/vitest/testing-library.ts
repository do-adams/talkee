import { render, type RenderOptions } from '@testing-library/vue'

import { createPinia } from 'pinia'
import { createVuetify, type VuetifyOptions } from 'vuetify'
import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

interface CustomOptions {
  render?: RenderOptions
  router?: RouterOptions
  vuetify?: VuetifyOptions
}

const defaultOptions: CustomOptions = {
  router: { history: createWebHistory(), routes: [] },
  vuetify: {}
}

const customRender = (ui: unknown, options: CustomOptions = {}) => {
  options = { ...defaultOptions, ...options }

  render(ui, {
    ...options.render,
    global: {
      plugins: [
        createPinia(),
        createRouter(options.router as RouterOptions),
        createVuetify(options.vuetify)
      ]
    }
  })
}

// re-export everything
export * from '@testing-library/vue'

// override render method
export { customRender as render }
