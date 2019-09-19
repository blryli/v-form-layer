import Vue from 'vue'
import App from './App.vue'
import router from './views/router';
import VueFormLayer from '../../'
import '../../dist/v-form-layer.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.css'

Vue.use(VueFormLayer)
Vue.use(ElementUI, {
  size: 'small'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
