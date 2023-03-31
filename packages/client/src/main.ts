import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import './assets/vars.css'
import { router } from '~/router'

const app = createApp(App)
app.use(router)
app.mount('#app')
