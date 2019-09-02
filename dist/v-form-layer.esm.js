function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var Validator = {
  data() {
    return {
      validators: []
    };
  },

  methods: {
    validateField(path, rule, data) {
      var value = this.getPathValue(data || this.data, path);

      var validator = _objectSpread2({
        path
      }, rule(value, path));

      var message = validator.message,
          stop = validator.stop;
      var index = this.validators.findIndex(function (d) {
        return d.path === path;
      });
      index === -1 ? this.validators.push(validator) : this.validators.splice(index, 1, validator);
      this.$emit('validate', {
        path,
        success: !message,
        message,
        stop
      });
    },

    validate(cb) {
      if (typeof cb !== 'function') {
        console.error('validate参数必须是函数');
        return;
      }

      this.$emit('form.line.validate');
      var validators = this.validators.map(function (d) {
        var path = d.path,
            message = d.message,
            stop = d.stop;
        return {
          path,
          success: !message,
          message,
          stop
        };
      });
      cb(!validators.find(function (rule) {
        return rule.stop && rule.message;
      }), validators);
    },

    clearValidate(paths) {
      var _this = this;

      if (!paths) {
        this.validators = [];
      } else if (Array.isArray(paths)) {
        paths.forEach(function (path) {
          var index = _this.validators.findIndex(function (d) {
            return d.path === path;
          });

          _this.validators.splice(index, 1);
        });
      } else console.error('clearValidate参数必须是数组');
    },

    getPathValue(data, path) {
      return path.split('/').filter(function (d) {
        return d;
      }).reduce(function (acc, cur) {
        return acc[cur];
      }, data);
    }

  }
};

var script = {
  name: 'VForm',
  mixins: [Validator],
  props: {
    value: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    data: [Object, Array],
    rules: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    currentPath: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: ''
    },
    lineHeight: {
      type: String,
      default: '32px'
    },
    itemGutter: {
      type: Number,
      default: 0
    },
    response: {
      type: Boolean,
      default: true
    },
    rowledge: {
      type: String,
      default: '24px'
    }
  },

  provide() {
    return {
      form: this
    };
  },

  data() {
    return {
      layer: [],
      initLayer: Object.freeze([]),
      isResponse: false,
      validators: [],
      isValidate: false
    };
  },

  created() {
    this.init();
  },

  watch: {
    value() {
      this.init();
    },

    validators(data) {
      var layer = {
        id: '_validator',
        show: true,
        data
      };
      var index = this.layer.findIndex(function (d) {
        return d.id === '_validator';
      });
      index === -1 ? this.layer.push(layer) : this.layer.splice(index, 1, layer);
      this.$emit('input', this.layer);
    }

  },
  computed: {
    formClass() {
      var formClass = "v-form ";
      this.labelPosition && (formClass += `v-form--label-${this.labelPosition} `);
      this.response && this.isResponse && (formClass += "v-form-response");
      return formClass;
    }

  },
  methods: {
    init() {
      this.layer = this.value;
      this.initLayer = Object.freeze(this.formationLayer());
    },

    formationLayer() {
      return (this.layer || []).reduce(function (acc, cur) {
        var show = cur.show === undefined ? true : cur.show;
        (cur.data || []).forEach(function (da) {
          da.id = cur.id;

          var layer = _objectSpread2({
            placement: 'top'
          }, cur.view, {}, da, {}, {
            show
          });

          var findIndex = acc.findIndex(function (l) {
            return l.path === da.path;
          });

          if (findIndex === -1) {
            acc.push({
              path: da.path,
              layer: [layer]
            });
          } else {
            acc[findIndex].layer.push(layer);
          }
        });
        return acc;
      }, []);
    }

  },

  mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true);
    }
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.formClass }, [_vm._t("default")], 2)
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-54ae360c";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Form = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
var script$1 = {
  name: 'VFormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    required: Boolean
  },

  data() {
    return {};
  },

  inject: ['form'],
  computed: {
    lineHeight() {
      return this.form.lineHeight;
    },

    // 行距
    rowledge() {
      return this.form.rowledge;
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "v-form-item",
      class: { "is-required": _vm.required },
      style: { marginBottom: _vm.rowledge, "--lineHeight": _vm.lineHeight }
    },
    [
      _vm.label
        ? _c(
            "label",
            {
              staticClass: "v-form-item__label",
              style: { flex: "0 0 " + _vm.labelWidth }
            },
            [_vm._v(_vm._s(_vm.label))]
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        { ref: "formItemContent", staticClass: "v-form-item__content" },
        [_vm._t("default")],
        2
      )
    ]
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = "data-v-2dcfdf90";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VFormItem = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var on = function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, function (e) {
          handler(e);
        }, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function (e) {
          handler(e);
        });
      }
    };
  }
}(); // 解除绑定事件

var off = function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
}();
/**
 * 获取所有父节点
 * @param {documentElement} node 
 */

var getParentNodes = function getParentNodes(node) {
  var parentNodes = [window];

  while (node !== document.body) {
    parentNodes.push(node);
    if (!node.parentNode || node.parentNode.name) return parentNodes;
    node = node.parentNode;
  }

  return parentNodes;
};
/**
 * 节点绑定 resize scroll 事件
 * @param {array} node 
 * @param {function} handler 
 */

var enableEventListener = function enableEventListener(nodes, handler) {
  nodes.forEach(function (p) {
    p.addEventListener('resize', handler, {
      passive: true
    });
    p.addEventListener('scroll', handler, {
      passive: true
    });
  });
};
/**
 * 节点解绑 resize scroll 事件
 * @param {array} node 
 * @param {function} handler 
 */

var removeEventListener = function removeEventListener(nodes, handler) {
  nodes.forEach(function (p) {
    p.removeEventListener('resize', handler);
    p.removeEventListener('scroll', handler);
  });
};
/**
 * * 获取节点 getBoundingClientRect
 * @param {节点} target 
 */

var getDomClientRect = function getDomClientRect(target) {
  if (!target) console.error('获取id节点失败');
  var targetRect = target.getBoundingClientRect();
  var top = targetRect.top;
  var bottom = targetRect.bottom;
  var left = targetRect.left;
  var right = targetRect.right;
  var width = targetRect.width || right - left;
  var height = targetRect.height || bottom - top;
  return {
    width,
    height,
    top,
    right,
    bottom,
    left,
    centerX: left + width / 2,
    centerY: top + height / 2
  };
};
/**
 * * 获取所有子节点 getChildNodes
 * @param {节点} node 
 * @param {节点} names 
 */

var getChildNodes = function getChildNodes(node) {
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["TEXTAREA", "INPUT", "SELECT"];
  // 1.创建全部节点的数组
  var allCN = [];
  names.find(function (d) {
    return d === node.nodeName;
  }) && allCN.push(node); // 2.递归获取全部节点

  var getAllChildNodes = function getAllChildNodes(node, names, allCN) {
    // 获取当前元素所有的子节点nodes
    var nodes = node.childNodes; // 获取nodes的子节点

    for (var i = 0; i < nodes.length; i++) {
      var child = nodes[i]; // 判断是否为指定类型节点

      if (names.find(function (d) {
        return d === child.nodeName;
      })) {
        allCN.push(child);
      }

      getAllChildNodes(child, names, allCN);
    }
  };

  getAllChildNodes(node, names, allCN); // 3.返回全部节点的数组

  return allCN;
};

var script$2 = {
  name: 'VFormLineSlot',
  props: {
    vNode: {
      type: Object,
      default: function _default() {}
    },
    layerRow: {
      type: Object,
      default: function _default() {}
    },
    path: {
      type: String,
      default: ''
    },
    validator: Function,
    trigger: {
      type: String,
      default: 'blur',

      validator(value) {
        return ['blur', 'change'].indexOf(value) !== -1;
      }

    }
  },

  data() {
    return {
      focusNode: null
    };
  },

  inject: ['form'],
  watch: {
    layerRow(row) {
      var _this = this;

      this.$nextTick(function () {
        _this.setFocusNodeStyle();
      });
    }

  },

  render(h) {
    return this.vNode;
  },

  created() {
    var _this2 = this;

    this.$nextTick(function () {
      // 监听校验触发事件
      if (!_this2.validator) return;

      if (!_this2.vNode.componentInstance || !_this2.vNode.componentInstance['blur'] && !_this2.vNode.componentInstance['change']) {
        console.warn('需要校验的路径所对应的节点必须具有 blur 或 change 事件，或者主动执行 validateField(path, rule, model) 方法');
      }

      _this2.validator && _this2.vNode.componentInstance && _this2.$on.apply(_this2.vNode.componentInstance, [_this2.trigger, function () {
        console.log(`on ${_this2.trigger} ...`);
        _this2.validator && _this2.form.validateField(_this2.path, _this2.validator);
      }]);
    });
  },

  computed: {
    getStyle() {
      var referenceBorderColor, referenceBgColor;
      (this.layerRow && this.layerRow.layer || []).forEach(function (d) {
        referenceBorderColor = d.referenceBorderColor;
        referenceBgColor = d.referenceBgColor;
      });
      return {
        referenceBorderColor,
        referenceBgColor
      };
    }

  },
  methods: {
    setFocusNodeStyle() {
      this.focusNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid ' + this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor}`;
    }

  },

  mounted() {
    var _this3 = this;

    this.$nextTick(function () {
      var focusNodes = getChildNodes(_this3.$el);

      if (focusNodes.length >= 1) {
        _this3.focusNode = focusNodes[0];
      } else {
        _this3.focusNode = _this3.$el;
      }

      _this3.setFocusNodeStyle();
    });
  }

};

/* script */
const __vue_script__$2 = script$2;

/* template */

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VFormLineSlot = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var script$3 = {
  name: "VSlot",
  props: {
    message: [Array, Object, String]
  },

  render(h) {
    return h("div", {
      class: 'v-popover-content'
    }, [this.message]);
  }

};

/* script */
const __vue_script__$3 = script$3;

/* template */

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VSlot = normalizeComponent_1(
    {},
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

var debounce = function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var immediate = arguments.length > 2 ? arguments[2] : undefined;
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
};

function $(params) {
  return document.getElementById(params);
}

var Mixin = {
  methods: {
    // 获取参考点ID
    getReferenceId() {
      var _this = this;

      if (this.placementId) {
        var samePlacementArr = this.placementObj[this.placement].sort(this.compare("disabled"));
        var index = samePlacementArr.findIndex(function (d) {
          return d.id === _this.placementId;
        });
        if (index !== -1 && samePlacementArr[index - 1]) return samePlacementArr[index - 1].id; // 取同向的前一个
      }
    },

    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },

    // 参考点是否在叛逆列表
    referenceInBetrayet() {
      var _this2 = this;

      return this.betraye[this.placement].find(function (d) {
        return d === _this2.getReferenceId();
      });
    },

    // 获取变化后的参考点
    getChangeReference(placement) {
      var _this3 = this;

      var last = this.placementObj[placement].find(function (d, i) {
        return i === _this3.placementObj[placement].length - 1;
      }); // 取反方向的最后一个

      return last ? $(last.id) : this.reference;
    },

    getPlacementAllRect() {
      var placement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.placement;
      var width = 0;
      var height = 0;
      (this.placementObj[placement] || []).forEach(function (d) {
        height += getDomClientRect($(d.id)).height + 12;
        width += getDomClientRect($(d.id)).width + 12;
      });
      return {
        width: width,
        height: height
      };
    },

    calculateCoordinate() {
      !this.addedBody && this.popoverAddedBody();
      var popoverRect = getDomClientRect(this.$el);
      var reference = $(this.getReferenceId()) || this.reference;
      var referenceRect = getDomClientRect(reference);
      var referenceRectCount = referenceRect; // 判断是否改变方向与确定最终参考点

      switch (this.placement) {
        case "top":
          if (getDomClientRect(this.reference).top - this.getPlacementAllRect().height < 0 && getDomClientRect(this.reference).bottom + this.getPlacementAllRect("bottom").height > window.innerHeight) {
            this.momentPlacement = "top";
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = "bottom";
          } else {
            if (referenceRect.top - popoverRect.height - 12 < 0) {
              this.momentPlacement = "bottom";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "top";
            }
          }

          break;

        case "left":
          if (getDomClientRect(this.reference).left - this.getPlacementAllRect().width < 0 && getDomClientRect(this.reference).right + this.getPlacementAllRect("right").width > window.innerWidth) {
            this.momentPlacement = "left";
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = "right";
          } else {
            if (referenceRect.left - popoverRect.width - 12 < 0) {
              this.momentPlacement = "right";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "left";
            }
          }

          break;

        case "right":
          if (getDomClientRect(this.reference).left - this.getPlacementAllRect("left").width < 0 && getDomClientRect(this.reference).right + this.getPlacementAllRect().width > window.innerWidth) {
            this.momentPlacement = "right";
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = "left";
          } else {
            if (referenceRect.right + popoverRect.width + 12 > window.innerWidth) {
              this.momentPlacement = "left";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "right";
            }
          }

          break;

        case "bottom":
          if (getDomClientRect(this.reference).top - this.getPlacementAllRect("top").height < 0 && getDomClientRect(this.reference).bottom + this.getPlacementAllRect().height > window.innerHeight) {
            this.momentPlacement = "bottom";
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = "top";
          } else {
            if (referenceRect.bottom + popoverRect.height + 12 > window.innerHeight) {
              this.momentPlacement = "top";
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = "bottom";
            }
          }

          break;

        default:
          console.error("Wrong placement prop");
      } // 计算节点坐标


      var top, left;

      switch (this.momentPlacement) {
        case "top":
          left = referenceRectCount.centerX - popoverRect.width / 2;
          top = referenceRectCount.top - popoverRect.height - 12;
          break;

        case "left":
          left = referenceRectCount.left - popoverRect.width - 12;
          top = referenceRectCount.centerY - popoverRect.height / 2;
          break;

        case "right":
          left = referenceRectCount.right + 12;
          top = referenceRectCount.centerY - popoverRect.height / 2;
          break;

        case "bottom":
          left = referenceRectCount.centerX - popoverRect.width / 2;
          top = referenceRectCount.bottom + 12;
          break;

        default:
          console.error("Wrong placement prop");
      }

      this.$el.style.top = top + "px";
      this.$el.style.left = left + "px";
    }

  }
};

//
var script$4 = {
  name: "VPopover",
  mixins: [Mixin],
  components: {
    VSlot
  },
  props: {
    referenceId: String,
    // 需要监听的事件
    trigger: {
      type: String,
      default: "hover"
    },
    effect: {
      type: String,
      default: "dark"
    },
    borderColor: String,
    // popover消息提示
    message: [String, Object, Array],
    disabled: [Boolean, Number],
    placement: {
      type: String,
      default: "top"
    },
    placementId: String,
    betraye: Object,
    // 叛逆者对象
    placementObj: Object,
    // popover 各个方向成员
    visibleArrow: {
      type: Boolean,
      default: true
    },
    showAlways: Boolean,
    positions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    enterable: Boolean,
    popoverClass: String,
    hideDelay: {
      type: Number,
      default: 200
    },
    path: String
  },

  data() {
    return {
      reference: null,
      show: false,
      addedBody: false,
      timeoutPending: null,
      momentPlacement: this.placement,
      parentNodes: []
    };
  },

  inject: ['form'],
  watch: {
    show(val) {
      if (this.showAlways) return;

      if (val) {
        this.form.$emit("show", this.path);
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.form.$emit("hide", this.path);
      }
    },

    // 叛逆者管理
    momentPlacement(val) {
      val === this.placement ? this.$emit("removeBetrayer", {
        id: this.placementId,
        placement: this.placement
      }) : this.$emit("addBetrayer", {
        id: this.placementId,
        placement: this.placement
      });
    }

  },
  computed: {
    // 对应方向是否有多个图层
    isMorePlacement() {
      var _this = this;

      var isMorePlacement = false;

      if (['top', 'bottom'].find(function (d) {
        return d === _this.placement;
      })) {
        this.placementObj['top'].length + this.placementObj['bottom'].length >= 2 && (isMorePlacement = true);
      }

      if (['left', 'right'].find(function (d) {
        return d === _this.placement;
      })) {
        return this.placementObj['left'].length + this.placementObj['right'].length >= 2 && (isMorePlacement = true);
      }

      return isMorePlacement;
    },

    isVisible() {
      return (this.showAlways || this.show) && !this.disabled;
    },

    pClass() {
      return `${this.effect ? `is-${this.effect}` : "is-light"}  v-popover__${this.momentPlacement} ${this.popoverClass || ""} ${this.isVisible ? "v-popover--visible" : "v-popover--hidden"}`;
    },

    popoverStyle() {
      var style = {
        "--borderColor": "#ccc",
        "--bgColor": "#fff"
      };

      if (typeof this.effect === "string") {
        switch (this.effect) {
          case "light":
            style["--borderColor"] = "#ccc";
            style["--bgColor"] = "#fff";
            break;

          case "dark":
            style["--borderColor"] = "#303133";
            style["--bgColor"] = "#303133";
            style["--color"] = "#fff";
            break;

          case "warn":
            style["--borderColor"] = "#e6a23c";
            style["--bgColor"] = "#e6a23c";
            style["--color"] = "#fff";
            break;

          case "error":
            style["--borderColor"] = "#f56c6c";
            style["--bgColor"] = "#f56c6c";
            style["--color"] = "#fff";
            break;

          default:
            style["--borderColor"] = this.borderColor || this.effect;
            style["--bgColor"] = this.effect;
            style["--color"] = "#fff";
            break;
        }
      }

      return style;
    }

  },
  methods: {
    popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$el);
        this.addedBody = true;
      }
    },

    triggerClick(e) {
      var popover = this.$el;
      var trigger = this.reference;
      if (!popover || !trigger || !e.target) return;

      if (trigger.contains(e.target)) {
        !this.disabled && (this.show = !this.show);
      } else if (popover.contains(e.target)) {
        return;
      } else {
        this.show = false;
      }
    },

    doShow() {
      if (!this.disabled && this.trigger !== "click") {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending);
          this.show = true;
        } else {
          this.show = true;
        }
      }
    },

    doHide() {
      var _this2 = this;

      if (!this.disabled && this.trigger !== "click") {
        this.timeoutPending = setTimeout(function () {
          _this2.show = false;
        }, this.hideDelay);
      }
    },

    mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending);
    },

    mouseleaveWrap() {
      var _this3 = this;

      if (this.enterable && this.trigger !== "click") {
        this.timeoutPending = setTimeout(function () {
          _this3.show = false;
        }, 200);
      }
    },

    scrollChange() {
      if (this.isVisible) {
        this.calculateCoordinate(); // 可见的popover实时计算位置
      } else {
        this.isMorePlacement && debounce(this.calculateCoordinate)(); // 不可见的popover,如果是多图层，位置计算开启节流
      }
    }

  },

  mounted() {
    var _this4 = this;

    this.$nextTick(function () {
      var referenceId = document.getElementById(_this4.referenceId);
      if (!referenceId) return;
      var childNodes = getChildNodes(referenceId);

      if (childNodes.length >= 1) {
        _this4.reference = childNodes[0];
      } else {
        _this4.reference = referenceId;
      }

      _this4.parentNodes = getParentNodes(_this4.reference);
      enableEventListener(_this4.parentNodes, _this4.scrollChange);

      _this4.calculateCoordinate();

      if (_this4.trigger === "hover") {
        on(_this4.reference, "mouseenter", _this4.doShow);
        on(_this4.reference, "mouseleave", _this4.doHide);
      } else if (_this4.trigger === "focus") {
        on(_this4.reference, "focus", _this4.doShow);
        on(_this4.reference, "blur", _this4.doHide);
      } else {
        on(window, "click", _this4.triggerClick);
      }
    });
  },

  beforeDestroy() {
    if (!this.reference || !this.reference.nodeName) return;
    removeEventListener(this.parentNodes, this.scrollChange);

    if (this.trigger === "hover") {
      off(this.reference, "mouseenter", this.doShow);
      off(this.reference, "mouseleave", this.doHide);
    } else if (this.trigger === "focus") {
      off(this.reference, "focus", this.doShow);
      off(this.reference, "blur", this.doHide);
    } else {
      off(window, "click", this.triggerClick);
    }

    this.addedBody && document.body.removeChild(this.$el);
  }

};

/* script */
const __vue_script__$4 = script$4;
/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", { attrs: { name: "fade" } }, [
    _c(
      "div",
      {
        staticClass: "v-popover",
        class: _vm.pClass,
        style: _vm.popoverStyle,
        attrs: { id: _vm.placementId },
        on: { mouseenter: _vm.mouseenterWrap, mouseleave: _vm.mouseleaveWrap }
      },
      [
        _vm.visibleArrow
          ? _c("div", { staticClass: "v-popover__arrow" })
          : _vm._e(),
        _vm._v(" "),
        _c("v-slot", { attrs: { message: _vm.message } })
      ],
      1
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = "data-v-e8b6b370";
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VPopover = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

//
var script$5 = {
  name: "VText",
  components: {
    VSlot
  },
  props: {
    referenceId: String,
    message: [String, Object, Array],
    disabled: Boolean,
    effect: String,
    placement: {
      type: String,
      default: "bottom"
    }
  },

  data() {
    return {
      reference: null
    };
  },

  methods: {
    calculateCoordinate() {
      if (!this.$el) return;

      switch (this.placement) {
        case "top":
          this.$el.style.top = -this.$el.offsetHeight - 3 + "px";
          break;

        case "right":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = this.reference.offsetWidth + 3 + "px";
          break;

        case "bottom":
          break;

        case "left":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = -this.$el.offsetWidth - 3 + "px";
          break;

        default:
          console.error("placement 必须是 top/right/bottom/left");
      }
    }

  },

  mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.reference = document.getElementById(_this.referenceId);

      _this.calculateCoordinate();
    });
  }

};

/* script */
const __vue_script__$5 = script$5;
/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("v-slot", {
    directives: [
      {
        name: "show",
        rawName: "v-show",
        value: !_vm.disabled,
        expression: "!disabled"
      }
    ],
    staticClass: "v-text-content",
    class: "v-text__" + _vm.placement,
    style: { color: _vm.effect },
    attrs: { message: _vm.message }
  })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = "data-v-16c192ea";
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VText = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

//
var script$6 = {
  name: 'VLayer',
  props: {
    path: String,
    layer: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  components: {
    VPopover,
    VText
  },

  provide() {
    return {
      layer: this
    };
  },

  data() {
    return {
      betraye: {
        left: [],
        right: [],
        top: [],
        bottom: []
      },
      loadLayer: false
    };
  },

  render(h) {
    var _this = this;

    var placementObj = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    var layers = [];
    this.layer.forEach(function (layerItem) {
      var layer = {};
      var referenceId = _this.path; // 参考点id

      var template = layerItem.template,
          placement = layerItem.placement,
          type = layerItem.type,
          effect = layerItem.effect,
          show = layerItem.show;
      var message = layerItem.message,
          disabled = layerItem.disabled;
      message = typeof template === "function" ? template(message, referenceId) : message; // 展示内容

      if (!type || type === "popover") {
        disabled = disabled === true || show === false ? 1 : 0; // 是否禁用

        var placementId = `${_this.path}/${placement}/${placementObj[placement].length + 1}`;
        placementObj[placement].push({
          id: placementId,
          disabled: disabled
        }); // 图层懒加载

        if (layerItem.showAlways || _this.loadLayer) {
          var trigger = layerItem.trigger,
              visibleArrow = layerItem.visibleArrow,
              borderColor = layerItem.borderColor,
              showAlways = layerItem.showAlways,
              enterable = layerItem.enterable,
              popoverClass = layerItem.popoverClass,
              hideDelay = layerItem.hideDelay;
          layer = h("v-popover", {
            attrs: {
              referenceId,
              placementId,
              message,
              placement,
              disabled,
              effect,
              trigger,
              visibleArrow,
              borderColor,
              showAlways,
              enterable,
              popoverClass,
              hideDelay,
              path: _this.path,
              betraye: _this.betraye,
              placementObj: placementObj
            },
            on: {
              addBetrayer: _this.addBetrayer,
              removeBetrayer: _this.removeBetrayer
            }
          });
          layers.push(layer);
        }
      } else if (type === "text") {
        layer = h("v-text", {
          attrs: {
            referenceId,
            message,
            placement,
            disabled,
            effect
          }
        });
        layers.push(layer);
      }
    });
    return h("div", {
      on: {
        mouseenter: this.handleLoadLayer
      },
      class: "v-layer"
    }, [this.$slots.default[0], layers]);
  },

  methods: {
    // 计算叛逆列表
    addBetrayer(betrayer) {
      betrayer.id && !this.betraye[betrayer.placement].find(function (d) {
        return d === betrayer.id;
      }) && this.betraye[betrayer.placement].push(betrayer.id);
    },

    removeBetrayer(betrayer) {
      var index = this.betraye[betrayer.placement].findIndex(function (d) {
        return d === betrayer.id;
      });
      index !== -1 && this.betraye[betrayer.placement].splice(index, 1);
    },

    // 加载图层
    handleLoadLayer() {
      if (!this.loadLayer) {
        this.loadLayer = true;
      }
    }

  }
};

/* script */
const __vue_script__$6 = script$6;
/* template */

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VLayer = normalizeComponent_1(
    {},
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

//
//
//
//
//
//
var script$7 = {
  name: 'VCol',
  props: {
    span: {
      type: Number,
      default: 24
    }
  },

  data() {
    return {};
  },

  computed: {
    style() {
      var style = {};

      if (this.gutter) {
        style.paddingLeft = this.gutter / 2 + 'px';
        style.paddingRight = style.paddingLeft;
      }

      if (this.span) {
        style.width = Math.floor(this.span / 24 * 100 * 10000) / 10000 + '%';
      } else {
        style.width = '100%';
      }

      return style;
    },

    gutter() {
      var parent = this.$parent;

      while (parent && parent.$options.name !== 'VueRow') {
        parent = parent.$parent;
      }

      return parent ? parent.gutter : 0;
    }

  },
  methods: {}
};

/* script */
const __vue_script__$7 = script$7;
/* template */
var __vue_render__$4 = function() {
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
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = "data-v-41d7f482";
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VCol = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

var script$8 = {
  name: 'VFormLine',
  components: {
    VFormItem,
    VFormLineSlot,
    VLayer,
    VCol
  },
  props: {
    cols: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    label: {
      type: String,
      default: ''
    },
    required: Boolean,
    span: {
      type: Number,
      default: 24
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  inject: ['form'],

  data() {
    return {
      slotsLen: 0
    };
  },

  created() {
    var _this = this;

    this.$on.apply(this.form, ['form.line.validate', function () {
      _this.cols.forEach(function (d) {
        d.validator && _this.form.validateField(d.path, d.validator);
      });
    }]);
  },

  computed: {
    lineFreeSpace() {
      var freeSpace = 24;
      var freeNodeNum = this.slotsLen;
      (this.cols || []).forEach(function (d) {
        if (d.span) {
          freeSpace -= d.span;
          freeNodeNum--;
        }
      });
      return freeSpace / freeNodeNum;
    },

    // 间距
    itemGutter() {
      return this.form.itemGutter / 2 + 'px';
    },

    // 响应式
    isResponse() {
      return this.form.isResponse;
    }

  },

  mounted() {
    this.slotsLen = (this.$slots.default || []).filter(function (d, i) {
      return d.tag;
    }).length;
  },

  render(h) {
    var _this2 = this;

    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    var slots = (this.$slots.default || []).filter(function (d, i) {
      return d.tag;
    });
    this.slotsLen;
    var nodes = []; // form-line 实际插入的节点

    var abreastSlots = []; // form-item 内并排节点

    slots.forEach(function (slot, index) {
      // 获取节点属性
      var span, labelWidth;

      var _ref = _this2.cols.length && _this2.cols[index],
          label = _ref.label,
          path = _ref.path,
          required = _ref.required,
          validator = _ref.validator,
          trigger = _ref.trigger;

      if (_this2.cols.length && _this2.cols[index]) {
        span = _this2.cols[index].span || _this2.lineFreeSpace;
        labelWidth = _this2.cols[index].labelWidth || _this2.labelWidth || _this2.form.labelWidth || "80px";
      } else {
        span = _this2.lineFreeSpace;
      }

      _this2.isResponse && (span = 24); // 添加图层

      validator && (_this2.form.isValidate = true);

      var layerRow = _this2.form.initLayer.find(function (d) {
        return d.path === path;
      });

      slot = h('v-form-line-slot', {
        attrs: {
          id: path,
          path,
          vNode: slot,
          layerRow,
          validator,
          trigger
        }
      }); // 扩展原始节点

      if (layerRow) {
        slot = h("v-layer", {
          attrs: {
            layer: layerRow.layer,
            path
          }
        }, [slot]);
      } else if (validator) {
        slot = h("v-layer", {
          attrs: {
            layer: [{
              placement: 'top',
              disabled: true,
              path,
              message: ''
            }],
            path
          }
        }, [slot]);
      } // 无form-item布局


      if (!_this2.label && !label) {
        nodes.push(slot);
        return;
      }

      if (label) {
        // form-item基本布局
        nodes.push(h("v-col", {
          attrs: {
            span: span
          },
          style: {
            padding: `0 ${_this2.itemGutter}`
          }
        }, [h("v-form-item", {
          attrs: {
            label: label,
            labelWidth: labelWidth,
            required: required
          }
        }, [slot])]));
      }

      if (_this2.label) {
        // form-item并列布局
        abreastSlots.push([h("v-col", {
          attrs: {
            span: span
          },
          class: "v-form-line--abreast"
        }, [slot])]);
      }
    }); // 并列布局添加节点

    if (this.label) {
      nodes.push(h("v-form-item", {
        attrs: {
          label: this.label,
          labelWidth: this.labelWidth || this.form.labelWidth || "80px",
          required: this.required
        },
        style: {
          padding: `0 ${this.itemGutter}`
        }
      }, [abreastSlots]));
    }

    var span = this.isResponse ? 24 : this.span;
    return h('v-col', {
      attrs: {
        span: span
      }
    }, [h('div', {
      class: 'v-form-line',
      style: {
        margin: `0 -${this.itemGutter}`
      }
    }, [nodes])]);
  }

};

/* script */
const __vue_script__$8 = script$8;
/* template */

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = "data-v-5fdf8064";
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var FormLine = normalizeComponent_1(
    {},
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

var components = [Form, FormLine];

var install = function install(Vue) {
  components.forEach(function (component) {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;
