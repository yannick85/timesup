/* Global Scss with Foundation6 CSS */
import './styles/global.scss'

import 'script-loader!jquery/dist/jquery.min'
import 'script-loader!foundation-sites/dist/js/foundation.min'

import Vue from 'vue'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export const SocketInstance = socketio(process.env.VUE_APP_BACK_URL);

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketInstance
}))

library.add(fas)

Vue.component('faicon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
