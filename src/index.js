import Form from 'components/Form.vue'
import FormLine from 'components/FormLine.vue'

const components = [Form, FormLine]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
