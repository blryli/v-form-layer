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
      handlerNode: null
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

      if(input && path) {
        // 监听键盘事件
        if (this.form.enter) {
          // 处理 v-if 切换之后重新生成的节点，替换旧节点
          const index = this.form.inputs.findIndex(input => input.path === path)
          if(index !== -1) {
            this.form.inputs.splice(index, 1, { path, input })
          } else {
            // 初始化添加节点
            this.form.inputs.push({path, input})
          }
          on(input, 'keydown', this.handleKeydown)
        }

        // 监听 focus 事件，聚焦时全选
        this.form.focusTextAllSelected && on(input, 'focus', () => input.select() && console.log(this.path, 'focus'))

        // 监听 blur/change 事件，触发校验
        this.validator && on(input, this.trigger, () => this.validator && this.form.validateField(this.path, this.validator))
      }
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
    handleKeydown(e) {
      // 回车时是否聚焦下一个 input
      if(e.keyCode == "13") {
        this.$emit.apply(this.form, ['listener-enter-event', this.path])
        console.log('enter ,', this.path)
      }
    }
  }
}
</script>
