<script>
import { on, off, getChildNodes } from 'utils/dom';

export default {
  name: 'VFormLineSlot',
  componentName: 'VFormLineSlot',
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
      input: null,
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
        this.setNodeStyle()
      });
    }
  },
  render(h) {
    return this.vNode
  },
  created() {
    this.$nextTick(() => {
      // 如果是组件
      if(this.vNode.componentInstance) {
        // 如果组件内有 getInput 方法，则设置操作节点为该 input
        if(this.vNode.componentInstance.getInput) {
          this.input = this.vNode.componentInstance.getInput()
        } else {
          this.input = this.vNode.componentInstance.focus && getChildNodes(this.vNode.componentInstance.$el)[0]
          this.$on.apply(this.vNode.componentInstance, ['focus', () => this.onFocus] )
          this.$on.apply(this.vNode.componentInstance, ['blur', () => this.onBlur] )
        }
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getChildNodes(this.$el)[0]
      }
      this.handlerNode = this.input || this.$el
      this.setNodeStyle()

      if(this.input) {
        on(this.input, 'focus', this.onFocus)
        on(this.input, 'blur', this.onBlur)
  
        // 监听 blur/change 事件，触发校验
        this.path && this.validator && on(this.input, this.trigger, this.inputValidateField)
      }
    })
  },
  methods: {
    setNodeStyle() {
      this.handlerNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid '+this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor || this.required}`;
    },
    onFocus() {
      this.form.focusOpen && this.$emit.apply(this.form, ['listener-focus', this])
      // 聚焦时全选
      if(this.form.focusTextAllSelected) {
        this.$el.parentNode.classList.add('v-layer-item--focus')
        this.input.select && this.input.select()
      }
    },
    onBlur() {
      if(this.form.focusTextAllSelected) {
        this.$el.parentNode.classList.remove('v-layer-item--focus')
      }
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
        off(this.input, 'focus', this.onFocus)
        off(this.input, 'blur', this.onBlur)
        this.path && this.validator && off(this.input, this.trigger, this.inputValidateField)
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
 