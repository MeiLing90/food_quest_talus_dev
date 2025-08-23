import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index.js'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
