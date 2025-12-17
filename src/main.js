import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/styles/variables.css'
import VueApexCharts from 'vue3-apexcharts'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './assets/styles/table_style.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Toast)
app.use(VueApexCharts)
app.mount('#app')
