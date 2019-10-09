<script>
import { on, off, getChildNodes } from 'utils/dom';

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
    },
    required: [Boolean, String],
  },
  data() {
    return {
      handlerNode: null,
      input: null
    };
  },
  inject: ['form'],
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
  watch: {
    layerRow(row) {
      this.$nextTick(() => {
        this.setHandlerNodesStyle()
      });
    }
  },
  render(h) {
    return this.vNode
  },
  created() {
    this.$nextTick(() => {
      // 获取操作节点
      const handlerNodes = getChildNodes(this.$el);
      if (handlerNodes.length >= 1) {
        this.handlerNode = handlerNodes[0];
      } else {
        this.handlerNode = this.$el;
      }
      this.setHandlerNodesStyle()

      // 获取input
      const input = ["TEXTAREA", "INPUT", "SELECT"].includes(this.handlerNode.nodeName) && this.handlerNode
      this.input = input
      const path = this.path

      if(input) {
        // 监听 focus/blur 事件
        on(input, 'focus', this.inputFocus)
        on(input, 'blur', this.inputBlur)
        // on(this.handlerNode, 'mouseenter', this.handlerNodeMouseenter)
        // on(this.handlerNode, 'mouseleave', this.handlerNodeMouseleave)
        if(path) {
          // 监听键盘事件
          if (this.form.focusOpen) {
            // 处理 v-if 切换之后重新生成的节点，替换旧节点
            const index = this.form.inputs.findIndex(input => input.path === path)
            if(index !== -1) {
              this.form.inputs.splice(index, 1, { path, input })
            } else {
              // 初始化添加节点
              this.form.inputs.push({path, input})
            }
            on(input, 'keyup', this.inputKeyup)
          }
  
          // 监听 blur/change 事件，触发校验
          this.validator && on(input, this.trigger, this.inputValidateField)
        }
      }
    })
  },
  methods: {
    setHandlerNodesStyle() {
      this.handlerNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid '+this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor || this.required}`;
    },
    inputKeyup(e) {
      // 发送 input 事件
      this.$emit.apply(this.form, ['listener-input-event', this.path, e])
    },
    inputFocus() {
      // 聚焦时全选
      this.$el.parentNode.classList.add('v-layer-item--focus')
      this.form.focusTextAllSelected && this.input.select && this.input.select()
    },
    inputBlur() {
      this.$el.parentNode.classList.remove('v-layer-item--focus')
    },
    inputValidateField() {
      this.validator && this.form.validateField(this.path, this.validator)
    },
    handlerNodeMouseenter(e) {
      this.$el.parentNode.classList.add('v-layer-item--hover')
    },
    handlerNodeMouseleave(e) {
      this.$el.parentNode.classList.remove('v-layer-item--hover')
    }
  },
  beforeDestroy () {
    if(this.input) {
        off(this.input, 'focus', this.inputFocus)
        off(this.input, 'blur', this.inputBlur)
        // off(this.handlerNode, 'mouseenter', this.handlerNodeMouseenter)
        // off(this.handlerNode, 'mouseleave', this.handlerNodeMouseleave)
        if(this.path) {
          if (this.form.focusOpen) {
            off(this.input, 'keyup', this.inputKeyup)
          }
          this.validator && off(this.input, this.trigger, this.inputValidateField)
        }
      }
  }
}
</script>

<style lang="scss">
.v-layer-item--focus, .is-validator{
  position: relative;
  z-index: 1;
}
</style>
 