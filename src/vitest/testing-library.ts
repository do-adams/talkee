import { render, type RenderOptions } from '@testing-library/vue'

import type { Pinia } from 'pinia'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { createVuetify, type VuetifyOptions } from 'vuetify'
import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

interface CustomOptions {
  render: RenderOptions
  pinia: Pinia | TestingPinia
  router: RouterOptions
  vuetify: VuetifyOptions
}

let defaultOptions: CustomOptions = {
  render: {},
  pinia: createTestingPinia(),
  router: { history: createWebHistory(), routes: [{ path: '/', component: {} }] },
  vuetify: {}
}

const customRender = (ui: unknown, options?: Partial<CustomOptions>) => {
  defaultOptions = { ...defaultOptions, ...options }

  render(ui, {
    ...defaultOptions.render,
    global: {
      plugins: [
        defaultOptions.pinia,
        createRouter(defaultOptions.router),
        createVuetify(defaultOptions.vuetify)
      ]
    }
  })
}

// re-export everything
export * from '@testing-library/vue'

// override render method
export { customRender as render }
