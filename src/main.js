import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
