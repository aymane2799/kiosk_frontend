import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { MutationCache, QueryCache, VueQueryPlugin } from '@tanstack/vue-query'
import { installAuth } from './features/auth/installAuth.ts'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

const { onError } = installAuth(router)

app.use(VueQueryPlugin, {
  queryClientConfig: {
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
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
