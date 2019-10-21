import Vue from 'vue'
import App from './App.vue'
import router from './views/router';
import VueFormLayer from '../../'
import customsCN from 'customs-cn'
import '../../dist/v-form-layer.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.css'

Vue.use(VueFormLayer)
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(customsCN, { serverURL: 'http://cheetah-server.dev.yunbaoguan.cn' })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
