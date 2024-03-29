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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var Validator = {
  data: function data() {
    return {
      validators: [],
      formLines: []
    };
  },
  created: function created() {
    var _this = this;

    this.$on('form.line.add.validator', function (cols) {
      _this.formLines = _this.formLines.concat(cols);
    });
    this.$on('form.line.remove.validator', function (cols) {
      cols.forEach(function (d) {
        var index = _this.formLines.findIndex(function (line) {
          return line.path === d.path;
        });

        var idx = _this.validators.findIndex(function (line) {
          return line.path === d.path;
        });

        index > -1 && _this.formLines.splice(index, 1);
        idx > -1 && _this.validators.splice(idx, 1);
      });
    });
  },
  methods: {
    validateField: function validateField(path, rule) {
      var _this2 = this;

      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.data;

      if (!path) {
        console.error('需要校验的字段，必须具有 path 属性');
        return {};
      }

      if (typeof rule !== 'function') {
        console.error("\u6821\u9A8Crule [".concat(rule, "]\uFF0C\u5FC5\u987B\u662F\u51FD\u6570"));
        return {};
      }

      if (!data) {
        console.error('使用校验时，必须传入源数据 data');
        return {};
      }

      var value = this.getPathValue(data, path);
      var result = rule(value, path);

      var type = function type(params) {
        return Object.prototype.toString.call(params).match(/ (\w+)]/)[1];
      };

      var validate = function validate(params) {
        var validator = _objectSpread2({
          path: path
        }, params);

        var message = validator.message,
            _validator$stop = validator.stop,
            stop = _validator$stop === void 0 ? false : _validator$stop;

        var index = _this2.validators.findIndex(function (d) {
          return d.path === path;
        });

        index === -1 ? _this2.validators.push(validator) : _this2.validators.splice(index, 1, validator);

        _this2.$emit('validate', {
          path: path,
          success: !message,
          message: message,
          stop: stop
        });

        return {
          path: path,
          success: !message,
          message: message,
          stop: stop
        };
      };

      return type(result) === 'Promise' ? result.then(function (res) {
        return validate(res);
      }) : validate(result);
    },
    validate: function validate(cb) {
      var _this3 = this;

      if (typeof cb !== 'function') {
        console.error('validate参数必须是函数');
        return;
      }

      Promise.all(this.formLines.map(function (d) {
        return _this3.validateField(d.path, d.validator);
      })).then(function (validators) {
        cb(!validators.find(function (rule) {
          return rule.stop && rule.message;
        }), validators);
      });
    },
    clearValidate: function clearValidate(paths) {
      var _this4 = this;

      if (!paths) {
        this.validators = [];
      } else if (Array.isArray(paths)) {
        paths.forEach(function (path) {
          var index = _this4.validators.findIndex(function (d) {
            return d.path === path;
          });

          _this4.validators.splice(index, 1);
        });
      } else console.error('clearValidate参数必须是数组');
    },
    getPathValue: function getPathValue(data, path) {
      return path.split('/').filter(function (d) {
        return d;
      }).reduce(function (acc, cur) {
        return acc[cur];
      }, data);
    }
  }
};

var on = function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (element && event && handler) {
        element.addEventListener(event, function (e) {
          handler(e);
        }, options);
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
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (element && event) {
        element.removeEventListener(event, handler, options);
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
    width: width,
    height: height,
    top: top,
    right: right,
    bottom: bottom,
    left: left,
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
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['TEXTAREA', 'INPUT', 'SELECT'];
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
/**
 * * 判断节点是否可聚焦 isFocusNode
 * @param {element} node
 */

var isFocusNode = function isFocusNode(node) {
  return ['TEXTAREA', 'INPUT', 'SELECT'].includes(node.nodeName);
};
/**
 * * 获取单个子元素 getOneChildElement
 * @param {element} startElement
 * @param {function} rule
 * @param {string} type
 */

var getOneChildElement = function getOneChildElement(startElement, rule) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'childNodes';
  if (rule(startElement)) return startElement;

  var getChidElement = function getChidElement(element, rule) {
    var elements = element[type];
    if (!elements || !elements.length) return false;

    for (var i = 0; i < elements.length; i++) {
      var child = elements[i];
      if (child.nodeName === '#comment') continue;
      return rule(child) ? child : getChidElement(child, rule);
    }
  };

  return getChidElement(startElement, rule);
};
/**
 * * 获取单个子节点 getOneChildNode
 * @param {element} node
 * @param {function} rule
 */

var getOneChildNode = function getOneChildNode(node) {
  var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isFocusNode;
  return getOneChildElement(node, rule);
};
/**
 * * 获取单个子组件 getOneChildComponent
 * @param {element} component
 * @param {function} rule
 */

var getOneChildComponent = function getOneChildComponent(component) {
  var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (child) {
    return child.focus;
  };
  return getOneChildElement(component, rule, '$children');
};

var defaultFocusOptions = {
  prevKeys: 'shift+enter',
  nextKeys: 'enter',
  skips: [],
  loop: false
};
var FocusControl = {
  data: function data() {
    return {
      lineSlots: Object.freeze([]),
      curPath: null,
      direction: null
    };
  },
  created: function created() {
    var focusOpen = this.focusOpen,
        lineSlotChange = this.lineSlotChange,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        keyup = this.keyup,
        click = this.click;

    if (focusOpen) {
      this.$on('line-slot-change', lineSlotChange);
      this.$on('on-focus', onFocus);
      this.$on('on-blur', onBlur);
      on(window, 'keyup', keyup);
      on(window, 'click', click);
    }
  },
  computed: {
    focusCtrl: function focusCtrl() {
      return _objectSpread2({}, defaultFocusOptions, {}, this.focusOptions);
    },
    prevKeys: function prevKeys() {
      if (!this.focusCtrl.prevKeys) return '';
      return this.focusCtrl.prevKeys.toLowerCase().split('+').sort().toString();
    },
    nextKeys: function nextKeys() {
      if (!this.focusCtrl.prevKeys) return '';
      return this.focusCtrl.nextKeys.toLowerCase().split('+').sort().toString();
    },
    revLineSlots: function revLineSlots() {
      return _toConsumableArray(this.lineSlots).reverse();
    },
    lineSlotsPath: function lineSlotsPath() {
      return this.lineSlots.map(function (d) {
        return d.path;
      });
    }
  },
  methods: {
    lineSlotChange: function lineSlotChange(obj) {
      var lineSlots = _toConsumableArray(this.lineSlots);

      var index = lineSlots.findIndex(function (d) {
        return d.path === obj.path;
      });
      index === -1 ? lineSlots.push(obj) : lineSlots.splice(index, 1, obj);
      this.lineSlots = Object.freeze(lineSlots); // console.log(JSON.stringify(this.lineSlots.map(d => d.path), null, 2))
    },
    onFocus: function onFocus(path) {
      var _this = this;

      setTimeout(function () {
        _this.curPath = path;

        _this.$emit('focus', path);
      }, 50);
    },
    onBlur: function onBlur(path) {
      this.$emit('blur', path);
    },
    _clear: function _clear() {
      this.curPath = null;
    },
    click: function click(e) {
      var curPath = this.curPath,
          lineSlots = this.lineSlots,
          _clear = this._clear;
      if (!curPath) return;
      !lineSlots.find(function (d) {
        return d.slot.$el.contains(e.target);
      }) && _clear();
    },
    keyup: function keyup(e) {
      var curPath = this.curPath,
          focusStop = this.focusStop,
          prevKeys = this.prevKeys,
          nextKeys = this.nextKeys,
          lineSlotsPath = this.lineSlotsPath,
          prevFocus = this.prevFocus,
          nextFocus = this.nextFocus,
          focus = this.focus;
      var keyStr = e.key || e.keyIdentifier;
      if (!curPath || focusStop || !keyStr) return;
      var key = keyStr.toLowerCase();
      var keys = new Set();
      var keyArr = [{
        key: 'alt',
        down: e['altKey']
      }, {
        key: 'control',
        down: e['ctrlKey']
      }, {
        key: 'shift',
        down: e['shiftKey']
      }];
      keyArr.forEach(function (d) {
        d.down && keys.add(d.key.toLowerCase());
      });
      keys.add(key);
      var keysStr = Array.from(keys).sort().toString();
      keysStr === prevKeys && prevFocus(curPath); // 上一个

      keysStr === nextKeys && nextFocus(curPath); // 下一个
      // table上下键控制focus

      if (/\/\d\//.test(curPath)) {
        var getPath = function getPath(sign) {
          return curPath.replace(/\/(\d)\//, function (match, p1) {
            return "/".concat(+p1 + sign, "/");
          });
        };

        var prevPath = getPath(-1);
        var nextPath = getPath(1);
        keysStr === 'arrowup' && lineSlotsPath.includes(prevPath) && focus(prevPath);
        keysStr === 'arrowdown' && lineSlotsPath.includes(nextPath) && focus(nextPath);
      }

      this.$emit('keyup', keysStr, curPath, e);
    },
    prevFocus: function prevFocus() {
      var curPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.curPath;
      var revLineSlots = this.revLineSlots,
          nextNodeFocus = this.nextNodeFocus;
      this.direction = 'prev';
      nextNodeFocus(curPath, revLineSlots);
    },
    nextFocus: function nextFocus() {
      var curPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.curPath;
      var lineSlots = this.lineSlots,
          nextNodeFocus = this.nextNodeFocus;
      this.direction = 'next';
      nextNodeFocus(curPath, lineSlots);
    },
    nextNodeFocus: function nextNodeFocus(curPath, lineSlots) {
      var _this2 = this;

      var index = lineSlots.findIndex(function (d) {
        return d.path === curPath;
      }) || 0;
      if (index === -1) return;
      var nextIndex;
      var len = lineSlots.length;
      var curConponent = getOneChildComponent(lineSlots[index].slot);

      var handleBlur = function handleBlur() {
        // 处理失焦
        if (curConponent) {
          curConponent.blur && curConponent.blur();
          curConponent.handleClose && curConponent.handleClose();
        } else {
          var slotInput = lineSlots[index].input;
          slotInput && slotInput.blur && slotInput.blur();
        }
      };

      for (var i = index + 1; i < len; i++) {
        var slot = lineSlots[i];

        if (this._isCanFocus(slot)) {
          nextIndex = i;
          break;
        }
      } // 如果下一个节点是最后一个或是剩下的节点存在，且都为不可操作的节点


      if (index === len - 1 || nextIndex === undefined) {
        if (this.focusCtrl.loop) {
          nextIndex = lineSlots.findIndex(function (slot) {
            return _this2._isCanFocus(slot);
          });
        } else {
          var event = this.direction === 'prev' ? 'first-focused-node-prev' : 'last-focused-node-next';
          this.$emit(event, this.curPath);

          this._clear();

          handleBlur();
          return;
        }
      }

      var ev = this.direction === 'prev' ? 'focus-prev' : 'focus-next';
      this.$emit(ev, this.curPath);
      if (this.focusPause) return; // 上一个节点失焦

      nextIndex !== index && handleBlur();

      try {
        var focusNode = this.getFocusNode(nextIndex, lineSlots);
        focusNode && focusNode.focus && focusNode.focus();
      } catch (error) {
        console.error(error);
      }
    },
    getFocusNode: function getFocusNode(index) {
      var lineSlots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lineSlots;
      var nextSlot = lineSlots[index];
      var nextComponent = getOneChildComponent(nextSlot.slot);
      return nextSlot && (nextComponent || nextSlot.input);
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus: function _isCanFocus(lineSlot) {
      var path = lineSlot.path,
          slot = lineSlot.slot,
          input = lineSlot.input;
      var component = getOneChildComponent(slot);
      return (!path || path && !this.focusCtrl.skips.find(function (p) {
        return p === path;
      })) && (component && !component.disabled || !component && input && !input.disabled);
    },
    focus: function focus(path) {
      this.getInput(path).focus && this.getInput(path).focus();
    },
    blur: function blur(path) {
      this.getInput(path).blur && this.getInput(path).blur();
    },
    select: function select(path) {
      this.getInput(path).select && this.getInput(path).select();
    },
    getInput: function getInput(path) {
      var lineSlots = this.lineSlots,
          _isCanFocus = this._isCanFocus,
          getFocusNode = this.getFocusNode;

      if (path && !lineSlots.find(function (d) {
        return d.slot.path === path;
      })) {
        console.error("focus\u65B9\u6CD5\u4F20\u5165\u7684path [".concat(path, "] \u6CA1\u6709\u5B9A\u4E49"));
      }

      var index = path ? lineSlots.findIndex(function (d) {
        return d.path === path;
      }) : lineSlots.findIndex(function (d) {
        return _isCanFocus(d);
      });
      if (index === -1) return;
      return getFocusNode(index);
    }
  },
  beforeDestroy: function beforeDestroy() {
    var focusOpen = this.focusOpen,
        lineSlotChange = this.lineSlotChange,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        keyup = this.keyup,
        click = this.click;

    if (focusOpen) {
      this.$off('line-slot-change', lineSlotChange);
      this.$off('on-focus', onFocus);
      this.$off('on-blur', onBlur);
      off(window, 'keyup', keyup);
      off(window, 'click', click);
    }
  }
};

var script = {
  name: 'VForm',
  mixins: [Validator, FocusControl],
  props: {
    value: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    data: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    },
    cols: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    rules: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    currentPath: {
      type: String,
      "default": ''
    },
    labelWidth: {
      type: String,
      "default": ''
    },
    labelPosition: {
      type: String,
      "default": ''
    },
    lineHeight: {
      type: String,
      "default": '32px'
    },
    itemGutter: {
      type: Number,
      "default": 0
    },
    response: {
      type: Boolean,
      "default": true
    },
    rowledge: {
      type: String,
      "default": '24px'
    },
    focusOpen: {
      type: Boolean,
      "default": true
    },
    focusOptions: {
      type: Object,
      "default": function _default() {}
    },
    focusTextAllSelected: {
      type: Boolean,
      "default": true
    },
    width: {
      type: String,
      "default": ''
    },
    focusStop: Boolean,
    focusPause: Boolean
  },
  provide: function provide() {
    return {
      form: this
    };
  },
  data: function data() {
    return {
      layer: [],
      initLayer: Object.freeze([]),
      isResponse: false,
      validators: [],
      inputIndex: 0
    };
  },
  computed: {
    formClass: function formClass() {
      var response = this.response,
          isResponse = this.isResponse,
          labelPosition = this.labelPosition;
      var formClass = 'v-form ';

      if (response && isResponse) {
        formClass += 'is-response';
      } else {
        labelPosition && (formClass += "v-form--label-".concat(labelPosition, " "));
      }

      return formClass;
    }
  },
  watch: {
    value: function value() {
      this.init();
    },
    validators: function validators(data) {
      var layer = {
        id: '_validator',
        show: true,
        data: data
      };
      var index = this.layer.findIndex(function (d) {
        return d.id === '_validator';
      });
      index === -1 ? this.layer.push(layer) : this.layer.splice(index, 1, layer);
      this.$emit('input', this.layer);
    }
  },
  created: function created() {
    this.formLines = [];
    this.init();
  },
  mounted: function mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true);
    }
  },
  methods: {
    init: function init() {
      this.layer = this.value;
      this.initLayer = Object.freeze(this.formationLayer());
    },
    formationLayer: function formationLayer() {
      return (this.layer || []).reduce(function (acc, cur) {
        var show = cur.show === undefined ? true : cur.show;
        (cur.data || []).forEach(function (da) {
          da.id = cur.id;

          var layer = _objectSpread2({}, cur.view, {}, da, {}, {
            show: show
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
  render: function render(h) {
    var cols = this.cols,
        formClass = this.formClass,
        isResponse = this.isResponse,
        width = this.width,
        $slots = this.$slots;
    return h('div', {
      "class": formClass,
      style: {
        width: isResponse ? '' : width
      }
    }, [cols.map(function (d) {
      return h('v-form-line', {
        attrs: {
          cols: [Object.assign({}, d, {
            span: 24
          })],
          span: d.span
        }
      }, [h('el-input')]);
    }), $slots["default"]]);
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

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-5c35241e";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Form = normalizeComponent_1(
    {},
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
      "default": ''
    },
    labelWidth: {
      type: String,
      "default": ''
    },
    required: {
      type: [Boolean, String],
      "default": ''
    }
  },
  data: function data() {
    return {};
  },
  inject: ['form'],
  computed: {
    lineHeight: function lineHeight() {
      return this.form.lineHeight;
    }
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "v-form-item",
      class: { "is-required": _vm.required === true },
      style: { "--lineHeight": _vm.lineHeight }
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
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = "data-v-22123ee7";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VFormItem = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var VFormLineSlot = {
  name: 'VFormLineSlot',
  componentName: 'VFormLineSlot',
  props: {
    vNode: {
      type: Object,
      "default": function _default() {}
    },
    layerRow: {
      type: Object,
      "default": function _default() {}
    },
    path: {
      type: String,
      "default": ''
    },
    validator: Function,
    trigger: {
      type: String,
      "default": 'blur',
      validator: function validator(value) {
        return ['blur', 'change', 'validate'].indexOf(value) !== -1;
      }
    },
    required: {
      type: [Boolean, String],
      "default": ''
    }
  },
  data: function data() {
    return {
      handlerNode: null,
      input: null,
      component: null
    };
  },
  inject: ['form'],
  computed: {
    getStyle: function getStyle() {
      var layerRow = this.layerRow;
      var referenceBorderColor, referenceBgColor;
      (layerRow && layerRow.layer || []).forEach(function (d) {
        referenceBorderColor = d.referenceBorderColor;
        referenceBgColor = d.referenceBgColor;
      });
      return {
        referenceBorderColor: referenceBorderColor,
        referenceBgColor: referenceBgColor
      };
    },
    isValidator: function isValidator() {
      var validator = this.validator,
          trigger = this.trigger;
      return validator && trigger !== 'validate';
    }
  },
  watch: {
    layerRow: function layerRow(row) {
      var _this = this;

      this.$nextTick(function () {
        _this.setNodeStyle();
      });
    },
    required: function required(val) {
      this.setNodeStyle();
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.init();
    });
  },
  beforeDestroy: function beforeDestroy() {
    var input = this.input,
        trigger = this.trigger,
        inputValidateField = this.inputValidateField,
        component = this.component,
        onFocus = this.onFocus,
        onBlur = this.onBlur;

    if (input) {
      off(input, 'focus', onFocus);
      off(input, 'blur', onBlur);
      this.isValidator && off(input, trigger, inputValidateField);
    }

    if (this.$children.length && component && !component.getInput) {
      component.$off('focus', function () {
        return onFocus(component);
      });
      component.$off('blur', onBlur);
    }
  },
  methods: {
    init: function init() {
      this.component = getOneChildComponent(this);
      var form = this.form,
          path = this.path,
          component = this.component,
          isValidator = this.isValidator,
          trigger = this.trigger,
          $el = this.$el,
          onFocus = this.onFocus,
          onBlur = this.onBlur,
          inputValidateField = this.inputValidateField;

      if (this.$children.length && component) {
        // 如果组件存在并且有 getInput 方法
        if (component.getInput) {
          this.handlerNode = this.input = component.getInput();
        } else {
          component.$on('focus', function () {
            return onFocus(component);
          });
          component.$on('blur', onBlur);
          isValidator && this.$on.apply(component, [trigger, inputValidateField]);
          this.handlerNode = isValidator && getOneChildNode(component.$el) || component.$el;
        }
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getOneChildNode($el);
        this.handlerNode = this.input || $el;
      }

      var input = this.input;

      if (this.input) {
        // 监听 blur/change 事件，触发校验
        on(input, 'focus', function () {
          return onFocus();
        });
        on(input, 'blur', function () {
          return onBlur();
        });
        this.isValidator && on(input, trigger, inputValidateField);
      }

      this.setNodeStyle();
      form.focusOpen && form.$emit('line-slot-change', {
        path: path,
        slot: this,
        input: input
      });
    },
    setNodeStyle: function setNodeStyle() {
      var getStyle = this.getStyle,
          required = this.required;
      this.handlerNode.style.border = "".concat(getStyle.referenceBorderColor ? ' 1px solid ' + getStyle.referenceBorderColor : '');
      this.handlerNode.style.backgroundColor = "".concat(getStyle.referenceBgColor || (typeof required === 'string' ? required : ''));
    },
    onFocus: function onFocus(component) {
      this.form.focusOpen && this.form.$emit('on-focus', this.path); // 聚焦时全选

      this.$el.parentNode.classList.add('v-layer-item--focus');

      if (this.form.focusTextAllSelected) {
        if (this.input) {
          this.input.select && this.input.select();
        } else component && component.select && component.select();
      }
    },
    onBlur: function onBlur() {
      var form = this.form,
          $el = this.$el,
          path = this.path;
      form.focusOpen && form.$emit('on-blur', path);
      $el.parentNode.classList.remove('v-layer-item--focus');
    },
    inputValidateField: function inputValidateField() {
      var validator = this.validator,
          form = this.form,
          path = this.path;
      validator && form.validateField(path, validator);
    },
    handlerNodeMouseenter: function handlerNodeMouseenter(e) {
      this.$el.parentNode.classList.add('v-layer-item--hover');
    },
    handlerNodeMouseleave: function handlerNodeMouseleave(e) {
      this.$el.parentNode.classList.remove('v-layer-item--hover');
    }
  },
  render: function render(h) {
    return this.vNode;
  }
};

var VSlot = {
  name: 'VSlot',
  props: {
    message: {
      type: [String, Object, Array],
      "default": ''
    }
  },
  render: function render(h) {
    return h('div', {}, [this.message]);
  }
};

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
    getReferenceId: function getReferenceId() {
      var placementId = this.placementId,
          placementObj = this.placementObj,
          placement = this.placement,
          compare = this.compare;

      if (placementId) {
        var samePlacementArr = placementObj[placement].sort(compare('disabled'));
        var index = samePlacementArr.findIndex(function (d) {
          return d.id === placementId;
        });

        if (index !== -1 && samePlacementArr[index - 1]) {
          return samePlacementArr[index - 1].id;
        } // 取同向的前一个

      }
    },
    compare: function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    // 参考点是否在叛逆列表
    referenceInBetrayet: function referenceInBetrayet() {
      var _this = this;

      return this.betraye[this.placement].find(function (d) {
        return d === _this.getReferenceId();
      });
    },
    // 获取变化后的参考点
    getChangeReference: function getChangeReference(placement) {
      var reference = this.reference,
          placementObj = this.placementObj;
      var last = placementObj[placement].find(function (d, i) {
        return i === placementObj[placement].length - 1;
      }); // 取反方向的最后一个

      return last ? $(last.id) : reference;
    },
    getPlacementAllRect: function getPlacementAllRect() {
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
    calculateCoordinate: function calculateCoordinate() {
      !this.addedBody && this.popoverAddedBody();
      var popoverRect = getDomClientRect(this.$el);
      var reference = $(this.getReferenceId()) || this.reference;
      var referenceRect = getDomClientRect(reference);
      var referenceRectCount = referenceRect; // 判断是否改变方向与确定最终参考点

      switch (this.placement) {
        case 'top':
          if (getDomClientRect(this.reference).top - this.getPlacementAllRect().height < 0 && getDomClientRect(this.reference).bottom + this.getPlacementAllRect('bottom').height > window.innerHeight) {
            this.momentPlacement = 'top';
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = 'bottom';
          } else {
            if (referenceRect.top - popoverRect.height - 12 < 0) {
              this.momentPlacement = 'bottom';
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = 'top';
            }
          }

          break;

        case 'left':
          if (getDomClientRect(this.reference).left - this.getPlacementAllRect().width < 0 && getDomClientRect(this.reference).right + this.getPlacementAllRect('right').width > window.innerWidth) {
            this.momentPlacement = 'left';
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = 'right';
          } else {
            if (referenceRect.left - popoverRect.width - 12 < 0) {
              this.momentPlacement = 'right';
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = 'left';
            }
          }

          break;

        case 'right':
          if (getDomClientRect(this.reference).left - this.getPlacementAllRect('left').width < 0 && getDomClientRect(this.reference).right + this.getPlacementAllRect().width > window.innerWidth) {
            this.momentPlacement = 'right';
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = 'left';
          } else {
            if (referenceRect.right + popoverRect.width + 12 > window.innerWidth) {
              this.momentPlacement = 'left';
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = 'right';
            }
          }

          break;

        case 'bottom':
          if (getDomClientRect(this.reference).top - this.getPlacementAllRect('top').height < 0 && getDomClientRect(this.reference).bottom + this.getPlacementAllRect().height > window.innerHeight) {
            this.momentPlacement = 'bottom';
            break;
          }

          if (this.referenceInBetrayet()) {
            this.momentPlacement = 'top';
          } else {
            if (referenceRect.bottom + popoverRect.height + 12 > window.innerHeight) {
              this.momentPlacement = 'top';
              reference = this.getChangeReference(this.momentPlacement);
              referenceRectCount = getDomClientRect(reference);
            } else {
              this.momentPlacement = 'bottom';
            }
          }

          break;

        default:
          console.error('Wrong placement prop');
      } // 计算节点坐标


      var top, left;

      switch (this.momentPlacement) {
        case 'top':
          left = referenceRectCount.centerX - popoverRect.width / 2;
          top = referenceRectCount.top - popoverRect.height - 12;
          break;

        case 'left':
          left = referenceRectCount.left - popoverRect.width - 12;
          top = referenceRectCount.centerY - popoverRect.height / 2;
          break;

        case 'right':
          left = referenceRectCount.right + 12;
          top = referenceRectCount.centerY - popoverRect.height / 2;
          break;

        case 'bottom':
          left = referenceRectCount.centerX - popoverRect.width / 2;
          top = referenceRectCount.bottom + 12;
          break;

        default:
          console.error('Wrong placement prop');
      }

      this.$el.style.top = top + 'px';
      this.$el.style.left = left + 'px';
    }
  }
};

//
var script$2 = {
  name: 'VPopover',
  components: {
    VSlot: VSlot
  },
  mixins: [Mixin],
  props: {
    referenceId: {
      type: String,
      "default": ''
    },
    // 需要监听的事件
    trigger: {
      type: String,
      "default": 'hover'
    },
    effect: {
      type: String,
      "default": 'dark'
    },
    borderColor: {
      type: String,
      "default": ''
    },
    // popover消息提示
    message: {
      type: [String, Object, Array],
      "default": ''
    },
    disabled: {
      type: [Boolean, Number],
      "default": false
    },
    placement: {
      type: String,
      "default": 'top'
    },
    placementId: {
      type: String,
      "default": ''
    },
    betraye: {
      type: Object,
      "default": function _default() {}
    },
    // 叛逆者对象
    placementObj: {
      type: Object,
      "default": function _default() {}
    },
    // popover 各个方向成员
    visibleArrow: {
      type: Boolean,
      "default": true
    },
    showAlways: Boolean,
    positions: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    enterable: Boolean,
    popoverClass: {
      type: String,
      "default": ''
    },
    hideDelay: {
      type: Number,
      "default": 200
    },
    path: {
      type: String,
      "default": ''
    }
  },
  data: function data() {
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
  computed: {
    // 对应方向是否有多个图层
    isMorePlacement: function isMorePlacement() {
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
    isVisible: function isVisible() {
      return (this.showAlways || this.show) && !this.disabled && this.message;
    },
    pClass: function pClass() {
      return "".concat(this.effect ? "is-".concat(this.effect) : 'is-light', "  v-popover__").concat(this.momentPlacement, " ").concat(this.popoverClass || '', " ").concat(this.isVisible ? 'v-popover--visible' : 'v-popover--hidden');
    },
    popoverStyle: function popoverStyle() {
      var style = {
        '--borderColor': '#ccc',
        '--bgColor': '#fff'
      };

      if (typeof this.effect === 'string') {
        switch (this.effect) {
          case 'light':
            style['--borderColor'] = '#ccc';
            style['--bgColor'] = '#fff';
            break;

          case 'dark':
            style['--borderColor'] = '#303133';
            style['--bgColor'] = '#303133';
            style['--color'] = '#fff';
            break;

          case 'warn':
            style['--borderColor'] = '#e6a23c';
            style['--bgColor'] = '#e6a23c';
            style['--color'] = '#fff';
            break;

          case 'error':
            style['--borderColor'] = '#f56c6c';
            style['--bgColor'] = '#f56c6c';
            style['--color'] = '#fff';
            break;

          default:
            style['--borderColor'] = this.borderColor || this.effect;
            style['--bgColor'] = this.effect;
            style['--color'] = '#fff';
            break;
        }
      }

      return style;
    }
  },
  watch: {
    showAlways: function showAlways(val) {
      val && setTimeout(this.calculateCoordinate, 0);
    },
    show: function show(val) {
      if (val) {
        this.form.$emit('show', this.path);
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.form.$emit('hide', this.path);
      }
    },
    // 叛逆者管理
    momentPlacement: function momentPlacement(val) {
      val === this.placement ? this.$emit('removeBetrayer', {
        id: this.placementId,
        placement: this.placement
      }) : this.$emit('addBetrayer', {
        id: this.placementId,
        placement: this.placement
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      var referenceId = document.getElementById(_this2.referenceId);
      if (!referenceId) return;
      var childNodes = getChildNodes(referenceId);

      if (childNodes.length >= 1) {
        _this2.reference = childNodes[0];
      } else {
        _this2.reference = referenceId;
      }

      _this2.parentNodes = getParentNodes(_this2.reference);
      enableEventListener(_this2.parentNodes, _this2.scrollChange);

      _this2.calculateCoordinate();

      if (_this2.trigger === 'hover') {
        on(_this2.reference, 'mouseenter', _this2.doShow);
        on(_this2.reference, 'mouseleave', _this2.doHide);
      } else if (_this2.trigger === 'focus') {
        on(_this2.reference, 'focus', _this2.doShow);
        on(_this2.reference, 'blur', _this2.doHide);
      } else {
        on(window, 'click', _this2.triggerClick);
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    var reference = this.reference;
    if (!reference || !reference.nodeName) return;
    removeEventListener(this.parentNodes, this.scrollChange);

    if (this.trigger === 'hover') {
      off(reference, 'mouseenter', this.doShow);
      off(reference, 'mouseleave', this.doHide);
    } else if (this.trigger === 'focus') {
      off(reference, 'focus', this.doShow);
      off(reference, 'blur', this.doHide);
    } else {
      off(window, 'click', this.triggerClick);
    }

    this.addedBody && document.body.removeChild(this.$el);
    this.addedBody = false;
  },
  deactivated: function deactivated() {
    this.$options.beforeDestroy[0].call(this);
  },
  activated: function activated() {
    this.popoverAddedBody();
  },
  methods: {
    popoverAddedBody: function popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$el);
        this.addedBody = true;
      }
    },
    triggerClick: function triggerClick(e) {
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
    doShow: function doShow() {
      if (!this.disabled && this.trigger !== 'click') {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending);
          this.show = true;
        } else {
          this.show = true;
        }
      }
    },
    doHide: function doHide() {
      var _this3 = this;

      if (!this.disabled && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(function () {
          _this3.show = false;
        }, this.hideDelay);
      }
    },
    mouseenterWrap: function mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending);
    },
    mouseleaveWrap: function mouseleaveWrap() {
      var _this4 = this;

      if (this.enterable && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(function () {
          _this4.show = false;
        }, 200);
      }
    },
    scrollChange: function scrollChange() {
      if (this.isVisible) {
        this.calculateCoordinate(); // 可见的popover实时计算位置
      } else {
        this.isMorePlacement && debounce(this.calculateCoordinate)(); // 不可见的popover,如果是多图层，位置计算开启节流
      }
    }
  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */
var __vue_render__$1 = function() {
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
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = "data-v-dc3c293e";
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VPopover = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//
var script$3 = {
  name: 'VText',
  components: {
    VSlot: VSlot
  },
  props: {
    referenceId: {
      type: String,
      "default": ''
    },
    message: {
      type: [String, Object, Array],
      "default": ''
    },
    disabled: Boolean,
    effect: {
      type: String,
      "default": ''
    },
    placement: {
      type: String,
      "default": 'bottom'
    }
  },
  data: function data() {
    return {
      reference: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.reference = document.getElementById(_this.referenceId);

      _this.calculateCoordinate();
    });
  },
  methods: {
    calculateCoordinate: function calculateCoordinate() {
      var $el = this.$el,
          placement = this.placement,
          reference = this.reference;
      if (!$el) return;

      switch (placement) {
        case 'top':
          this.$el.style.top = -$el.offsetHeight - 3 + 'px';
          break;

        case 'right':
          this.$el.style.width = $el.offsetWidth + 'px';
          this.$el.style.left = reference.offsetWidth + 3 + 'px';
          break;

        case 'bottom':
          break;

        case 'left':
          this.$el.style.width = $el.offsetWidth + 'px';
          this.$el.style.left = -$el.offsetWidth - 3 + 'px';
          break;

        default:
          console.error('placement 必须是 top/right/bottom/left');
      }
    }
  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */
var __vue_render__$2 = function() {
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
    staticClass: "v-text",
    class: "v-text__" + _vm.placement,
    style: { color: _vm.effect },
    attrs: { message: _vm.message }
  })
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = "data-v-24bba890";
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VText = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

var script$4 = {
  name: 'VTriangle',
  props: {
    referenceId: {
      type: String,
      required: true
    },
    effect: {
      type: String,
      "default": '#F56C6C'
    },
    message: {
      type: String,
      "default": ''
    },
    placement: {
      type: String,
      "default": 'right-bottom',
      validator: function validator(val) {
        return ['left-top', 'left-bottom', 'right-top', 'right-bottom'].indexOf(val) !== -1;
      }
    },
    disabled: Boolean,
    size: {
      type: [String, Number],
      "default": '8px'
    }
  },
  data: function data() {
    return {
      reference: null
    };
  },
  computed: {
    referenceRect: function referenceRect() {
      return getDomClientRect(document.getElementById(this.referenceId));
    },
    style: function style() {
      var placement = this.placement,
          effect = this.effect,
          size = this.size;
      var pos = placement.split('-').reduce(function (acc, cur) {
        acc[cur] = 0;
        acc["border-".concat(cur, "-color")] = effect;
        return acc;
      }, {});
      return _objectSpread2({
        border: "".concat(parseInt(size) / 2, "px solid transparent")
      }, pos);
    }
  }
};

/* script */
const __vue_script__$4 = script$4;
/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [
      {
        name: "show",
        rawName: "v-show",
        value: !_vm.disabled,
        expression: "!disabled"
      }
    ],
    staticClass: "v-triangle",
    style: _vm.style,
    attrs: { title: _vm.message }
  })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = "data-v-186088bc";
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VTriangle = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

var VLayer = {
  name: 'VLayer',
  components: {
    VPopover: VPopover,
    VText: VText,
    VTriangle: VTriangle
  },
  props: {
    path: {
      type: String,
      "default": ''
    },
    layer: {
      type: Array,
      "default": function _default() {
        return [];
      }
    }
  },
  provide: function provide() {
    return {
      layer: this
    };
  },
  data: function data() {
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
  methods: {
    // 计算叛逆列表
    addBetrayer: function addBetrayer(betrayer) {
      var betraye = this.betraye;
      betrayer.id && !betraye[betrayer.placement].find(function (d) {
        return d === betrayer.id;
      }) && betraye[betrayer.placement].push(betrayer.id);
    },
    removeBetrayer: function removeBetrayer(betrayer) {
      var betraye = this.betraye;
      var index = betraye[betrayer.placement].findIndex(function (d) {
        return d === betrayer.id;
      });
      index !== -1 && betraye[betrayer.placement].splice(index, 1);
    },
    // 加载图层
    handleLoadLayer: function handleLoadLayer() {
      if (!this.loadLayer) {
        this.loadLayer = true;
      }
    }
  },
  render: function render(h) {
    var _this = this;

    var placementObj = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    var layers = [];
    var layerClassStr = 'v-layer';
    var path = this.path,
        betraye = this.betraye,
        addBetrayer = this.addBetrayer,
        removeBetrayer = this.removeBetrayer,
        handleLoadLayer = this.handleLoadLayer;
    this.layer.forEach(function (layerItem) {
      var layer = {};
      var referenceId = path; // 参考点id

      var template = layerItem.template,
          type = layerItem.type,
          show = layerItem.show,
          referenceBorderColor = layerItem.referenceBorderColor,
          layerClass = layerItem.layerClass;
      var effect = layerItem.effect && layerItem.effect.toLowerCase() || undefined;
      var placement = layerItem.placement,
          _layerItem$message = layerItem.message,
          message = _layerItem$message === void 0 ? '' : _layerItem$message,
          disabled = layerItem.disabled;
      referenceBorderColor && (layerClassStr += ' is-validator');
      layerClass && (layerClassStr += ' ' + layerClass);
      message = typeof template === 'function' ? template(message, referenceId) : message; // 展示内容

      if (message) {
        if (!type || type === 'popover') {
          !placement && (placement = 'top');
          disabled = disabled === true || show === false ? 1 : 0; // 是否禁用

          var placementId = "".concat(path, "/").concat(placement, "/").concat(placementObj[placement].length + 1);
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
            layer = h('v-popover', {
              attrs: {
                referenceId: referenceId,
                placementId: placementId,
                message: message,
                placement: placement,
                disabled: disabled,
                effect: effect,
                trigger: trigger,
                visibleArrow: visibleArrow,
                borderColor: borderColor,
                showAlways: showAlways,
                enterable: enterable,
                popoverClass: popoverClass,
                hideDelay: hideDelay,
                path: path,
                betraye: betraye,
                placementObj: placementObj
              },
              on: {
                addBetrayer: addBetrayer,
                removeBetrayer: removeBetrayer
              }
            });
            layers.push(layer);
          }
        } else if (type === 'text') {
          layer = h('v-text', {
            attrs: {
              referenceId: referenceId,
              message: message,
              placement: placement,
              disabled: disabled,
              effect: effect
            }
          });
          layers.push(layer);
        } else if (type === 'triangle') {
          layer = h('v-triangle', {
            attrs: {
              referenceId: referenceId,
              placement: placement,
              disabled: disabled,
              effect: effect,
              message: message
            }
          });
          layers.push(layer);
        }
      }
    });
    return h('div', {
      on: {
        mouseenter: handleLoadLayer
      },
      "class": layerClassStr
    }, [this.$slots["default"][0], layers]);
  }
};

var script$5 = {
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
      var span = this.span,
          noFirst = this.noFirst,
          isResponse = this.form.isResponse;

      if (span !== 24) {
        var width = Math.floor(span / 24 * 100 * 10000) / 10000 + '%';
        style.width = noFirst && !isResponse ? "calc(".concat(width, " + 1px)") : width;
      }

      return style;
    }
  },
  methods: {},
  render: function render(h) {
    var span = this.span,
        style = this.style,
        $slots = this.$slots;
    console.log($slots["default"]);
    if (span === 24) return $slots["default"];
    return h('div', {
      "class": 'v-col',
      style: style
    }, $slots["default"]);
  }
};

/* script */
const __vue_script__$5 = script$5;
/* template */

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = "data-v-5d969018";
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VCol = normalizeComponent_1(
    {},
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

var FormLine = {
  name: 'VFormLine',
  componentName: 'VFormLine',
  components: {
    VFormItem: VFormItem,
    VFormLineSlot: VFormLineSlot,
    VLayer: VLayer,
    VCol: VCol
  },
  props: {
    cols: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    label: {
      type: String,
      "default": ''
    },
    span: {
      type: Number,
      "default": 24
    },
    labelWidth: {
      type: String,
      "default": ''
    },
    required: {
      type: Boolean,
      "default": false
    }
  },
  inject: ['form'],
  computed: {
    slotsLen: function slotsLen() {
      return (this.$slots["default"] || []).filter(function (d, i) {
        return d.tag;
      }).length;
    },
    lineFreeSpace: function lineFreeSpace() {
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
    itemGutter: function itemGutter() {
      return this.form.itemGutter / 2 + 'px';
    },
    // 响应式
    isResponse: function isResponse() {
      return this.form.isResponse;
    },
    // 行距
    rowledge: function rowledge() {
      return this.form.rowledge;
    },
    id: function id() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    }
  },
  created: function created() {
    var cols = this.cols,
        form = this.form;
    var validatorCols = cols.filter(function (d) {
      return d.validator;
    });
    validatorCols.length && form.$emit('form.line.add.validator', validatorCols);
  },
  beforeDestroy: function beforeDestroy() {
    var cols = this.cols,
        form = this.form;
    var validatorCols = cols.filter(function (d) {
      return d.validator;
    });
    validatorCols.length && form.$emit('form.line.remove.validator', validatorCols);
  },
  render: function render(h) {
    var _this = this;

    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    var slots = (this.$slots["default"] || []).filter(function (d, i) {
      return d.tag;
    });
    var nodes = []; // form-line 实际插入的节点

    var abreastSlots = []; // form-item 内并排节点

    var form = this.form,
        cols = this.cols,
        lineFreeSpace = this.lineFreeSpace,
        isResponse = this.isResponse,
        itemGutter = this.itemGutter,
        rowledge = this.rowledge;
    slots.forEach(function (slot, index) {
      // 获取节点属性
      var span, labelWidth;
      var col = cols[index];

      var _ref = cols.length && col || {},
          label = _ref.label,
          _ref$path = _ref.path,
          path = _ref$path === void 0 ? "_".concat(_this.id, "-").concat(index + 1, "_") : _ref$path,
          _ref$required = _ref.required,
          required = _ref$required === void 0 ? false : _ref$required,
          validator = _ref.validator,
          trigger = _ref.trigger;

      if (cols.length && col) {
        span = col.span || lineFreeSpace;
        labelWidth = col.labelWidth || _this.labelWidth || form.labelWidth || '80px';
      } else {
        span = lineFreeSpace;
      }

      isResponse && (span = 24); // 添加图层

      var layerRow = form.initLayer.find(function (d) {
        return d.path === path;
      });
      slot = h('v-form-line-slot', {
        attrs: {
          path: path,
          vNode: slot,
          layerRow: layerRow,
          validator: validator,
          trigger: trigger,
          required: required
        }
      });
      var layer = layerRow && layerRow.layer || [];
      slot = h('v-layer', {
        attrs: {
          id: path,
          layer: layer,
          path: path
        }
      }, [slot]);

      if (!_this.label) {
        // form-item基本布局
        var node = label ? h('v-form-item', {
          attrs: {
            label: label,
            labelWidth: labelWidth,
            required: required
          }
        }, [slot]) : slot;
        nodes.push(h('v-col', {
          attrs: {
            span: span
          }
        }, [node]));
      }

      if (_this.label) {
        // form-item并列布局
        var noFirst = !!abreastSlots.length;
        abreastSlots.push([h('v-col', {
          attrs: {
            span: span,
            noFirst: noFirst
          },
          "class": 'v-form-line--abreast'
        }, [slot])]);
      }
    }); // 并列布局添加节点

    if (this.label) {
      var label = this.label,
          labelWidth = this.labelWidth,
          required = this.required;
      nodes.push(h('v-form-item', {
        attrs: {
          label: label,
          labelWidth: labelWidth || form.labelWidth || '80px',
          required: required
        }
      }, [abreastSlots]));
    }

    var span = isResponse ? 24 : this.span;
    var style = {};

    if (itemGutter) {
      style['margin-left'] = '-' + itemGutter;
      style['margin-right'] = '-' + itemGutter;
    }

    return h('v-col', {
      attrs: {
        span: span
      },
      style: style
    }, [h('div', {
      "class": 'v-form-line',
      style: {
        padding: "0 ".concat(itemGutter),
        marginBottom: rowledge
      }
    }, [nodes])]);
  }
};

var LayerItem = {
  name: 'VLayerItem',
  componentName: 'VLayerItem',
  components: {
    VFormItem: VFormItem,
    VFormLineSlot: VFormLineSlot,
    VLayer: VLayer,
    VCol: VCol
  },
  props: {
    label: {
      type: String,
      "default": ''
    },
    span: {
      type: Number,
      "default": 24
    },
    labelWidth: {
      type: String,
      "default": '80px'
    },
    required: {
      type: Boolean,
      "default": false
    },
    trigger: {
      type: String,
      "default": 'blur'
    },
    validator: Function
  },
  inject: ['form'],
  computed: {
    // 间距
    itemGutter: function itemGutter() {
      return this.form.itemGutter / 2 + 'px';
    },
    // 响应式
    isResponse: function isResponse() {
      return this.form.isResponse;
    },
    // 行距
    rowledge: function rowledge() {
      return this.form.rowledge;
    },
    id: function id() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    }
  },
  created: function created() {
    this.validator && this.form.$emit('form.line.cols.this.', [this.validator]);
  },
  render: function render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    var slot = this.$slots["default"][0];
    var span;
    var form = this.form,
        label = this.label,
        _this$path = this.path,
        path = _this$path === void 0 ? "_".concat(this.id, "_") : _this$path,
        _this$required = this.required,
        required = _this$required === void 0 ? false : _this$required,
        validator = this.validator,
        trigger = this.trigger,
        itemGutter = this.itemGutter,
        rowledge = this.rowledge;
    var labelWidth = this.labelWidth || form.labelWidth || '80px';
    this.isResponse && (this.span = 24); // 添加图层

    var layerRow = form.initLayer.find(function (d) {
      return d.path === path;
    });
    slot = h('v-form-line-slot', {
      attrs: {
        id: path,
        path: path,
        vNode: slot,
        layerRow: layerRow,
        validator: validator,
        trigger: trigger,
        required: required
      }
    });
    var layer = layerRow && layerRow.layer || [];
    slot = h('v-layer', {
      attrs: {
        layer: layer,
        path: path
      }
    }, [slot]);
    var node = label ? h('v-form-item', {
      attrs: {
        label: label,
        labelWidth: labelWidth,
        required: required
      }
    }, [slot]) : slot;
    var style = {};

    if (itemGutter) {
      style['margin-left'] = '-' + itemGutter;
      style['margin-right'] = '-' + itemGutter;
    }

    return h('v-col', {
      attrs: {
        span: span
      },
      style: {
        padding: "0 ".concat(itemGutter),
        marginBottom: rowledge
      }
    }, [h('div', {
      "class": 'v-layer-item',
      style: style
    }, [node])]);
  }
};

var components = [Form, FormLine, LayerItem];
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
export { VPopover };
