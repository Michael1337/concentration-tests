import { createApp } from 'vue'
import { createHead } from "@vueuse/head"
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { languages, defaultLocale } from '@/assets/text'
const messages = Object.assign(languages)
const i18n = createI18n({
    allowComposition: true,
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages,
})

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(i18n)

app.mount('#app')
