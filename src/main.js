import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import store from './store'
import "bootstrap";
import "./assets/scss/app.scss";
import layoutDefault from '@/views/layouts/layoutDefault';
import router from "./router";

const app = createApp(App)
app.component("layout-default", layoutDefault);
app.use(store)
app.use(router)

router.isReady().then(() => {
  app.mount("#app");
});