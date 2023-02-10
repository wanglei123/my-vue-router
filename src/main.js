import Vue from 'vue'
import App from './App.vue'
import router from './my-router'
import store from './my-store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
