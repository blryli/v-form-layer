import __vue_normalize__ from 'F:lrylicomponents-form-layer
ode_modulesollup-plugin-vueuntime
ormalize.js';

//
//
//
//
//
//
var script = {
  name: 'VCol',
  props: {
    span: {
      type: Number,
      "default": 24
    },
    noFirst: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {};
  },
  inject: ['form'],
  computed: {
    style: function style() {
      var style = {};

      if (this.span) {
        var width = Math.floor(this.span / 24 * 100 * 10000) / 10000 + '%';
        style.width = this.noFirst && !this.form.isResponse ? "calc(".concat(width, " + 1px)") : width;
      } else {
        style.width = '100%';
      }

      return style;
    }
  },
  methods: {}
};

/* script */
const __vue_script__ = script;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "v-col", style: _vm.style },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-5d820805";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

// import Form from './components/Form.vue'
var components = [__vue_component__];
var plugin = {
  install: function install(Vue) {
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  }
}; // Auto-install

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
