<script>
export default {
  name: 'VFormLineSlot',
  props: {
    vNode: {
      type: Object,
      default: () => { }
    },
    layerRow: {
      type: Object,
      default: () => { }
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
        return ['blur', 'change'].indexOf(value) !== -1
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
      this.$nextTick(() => {
        this.setFocusNodeStyle()
      });
    }
  },
  render(h) {
    return this.vNode
  },
  created() {
    this.$nextTick(() => {
      // 监听校验触发事件
      if (!this.validator) return
      if (!this.vNode.componentInstance || (!this.vNode.componentInstance['blur'] && !this.vNode.componentInstance['change'])) {
        console.warn('需要校验的路径所对应的节点必须具有 blur 或 change 事件，或者主动执行 validateField(path, rule, model) 方法')
      }
      this.validator && this.vNode.componentInstance && this.$on.apply(this.vNode.componentInstance, [this.trigger, () => {
        console.log(`on ${this.trigger} ...`)
        this.validator && this.form.validateField(this.path, this.validator)
      }])
    })
  },
  computed: {
    getStyle() {
      let referenceBorderColor, referenceBgColor;
      (this.layerRow && this.layerRow.layer || []).forEach(d => {
        referenceBorderColor = d.referenceBorderColor
        referenceBgColor = d.referenceBgColor
      })
      return { referenceBorderColor, referenceBgColor }
    }
  },
  methods: {
    setFocusNodeStyle() {
      this.focusNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid '+this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor}`;
    },
    allChildNodes(node, names) {
      // 1.创建全部节点的数组
      var allCN = [];
      names.find(d => d === node.nodeName) && allCN.push(node)

      // 2.递归获取全部节点
      var getAllChildNodes = function (node, names, allCN) {
        // 获取当前元素所有的子节点nodes
        var nodes = node.childNodes;
        // 获取nodes的子节点
        for (var i = 0; i < nodes.length; i++) {
          var child = nodes[i];
          // 判断是否为指定类型节点
          if (names.find(d => d === child.nodeName)) {
            allCN.push(child);
          }
          getAllChildNodes(child, names, allCN);
        }
      };
      getAllChildNodes(node, names, allCN);
      // 3.返回全部节点的数组
      return allCN;
    }
  },
  mounted() {
    this.$nextTick(() => {
      const focusNodes = this.allChildNodes(this.$el, ["TEXTAREA", "INPUT", "SELECT"]);
      if (focusNodes.length >= 1) {
        this.focusNode = focusNodes[0];
      } else {
        this.focusNode = this.$el;
      }
      this.setFocusNodeStyle()
    });
  }
}
</script>
