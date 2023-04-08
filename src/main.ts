// Firebase
import { init } from '@/firebase'
init()

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import webFontLoader from 'webfontloader'

webFontLoader.load({
  google: {
    families: ['Roboto:100,300,400,500,700,900&display=swap']
  }
})

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
