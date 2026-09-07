import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { useAuthStore } from './stores/auth.ts'
import { setTokenGetter } from './shared/api/tokens.ts'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)

setTokenGetter((audience) => auth.getTokenFor(audience))

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  },
})

app.mount('#app')
