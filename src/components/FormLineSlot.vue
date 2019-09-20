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

      const path = this.path
      const input = ["TEXTAREA", "INPUT", "SELECT"].includes(this.handlerNode.nodeName) && this.handlerNode // 获取input
      this.input = input

      if(input && path) {
        // 监听键盘事件
        if (this.form.focusCtrl.open) {
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

        // 监听 focus 事件，聚焦时全选
        this.form.focusTextAllSelected && on(input, 'focus', this.inputFocus)

        // 监听 blur/change 事件，触发校验
        this.validator && on(input, this.trigger, this.inputValidateField)
      }
      
      on(input, 'mouseenter', this.inputMouseenter)
      on(input, 'mouseleave', this.inputMouseleave)
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
    setHandlerNodesStyle() {
      this.handlerNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid '+this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor || this.required}`;
    },
    inputKeyup(e) {
      // 发送 input 事件
      this.$emit.apply(this.form, ['listener-input-event', this.path, e])
    },
    inputFocus() {
      this.input.select()
    },
    inputValidateField() {
      this.validator && this.form.validateField(this.path, this.validator)
    },
    inputMouseenter(e) {
      console.log('鼠标进入 ', e)
    },
    inputMouseleave(e) {
      console.log(this.form.layer)
      console.log(JSON.stringify(this.form.layer, null, 2))
      const history = {path: this.path, type: 'triangle', effect: 'red', message: '我变了'}
      const index = this.form.historys.findIndex(d => d.path === this.path)
      index === -1 ? this.form.historys.push(history) : this.form.historys.splice(index, 1, history)
      console.log('鼠标离开 ', e)
    }
  },
  beforeDestroy () {
    if(this.input && this.path) {
      off(this.input, 'keyup', this.inputKeyup)
      this.form.focusTextAllSelected && off(this.input, 'focus', this.inputSelect)
      this.validator && off(this.input, this.trigger, this.inputValidateField)
    }
  }
}
</script>
