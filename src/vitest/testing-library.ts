import { render } from '@testing-library/vue'

import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'

const customRender: typeof render = (ui, options) =>
  render(ui, {
    ...options,
    global: {
      plugins: [
        createPinia(),
        createRouter({ history: createWebHistory(), routes: [] }),
        createVuetify()
      ]
    }
  })

// re-export everything
export * from '@testing-library/vue'

// override render method
export { customRender as render }
