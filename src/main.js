import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Inicializar auth después del mount para no bloquear render inicial
const authStore = useAuthStore()
authStore.initAuth()