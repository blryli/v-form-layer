// import Form from './components/Form.vue'
// import FormLine from './components/FormLine'
import Col from './components/Col'

const components = [Col]

const plugin = {
  install(Vue, opts = {}) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

export default plugin
