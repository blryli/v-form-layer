<script>
import { on, off, getOneChildNode, getOneChildComponent } from 'utils/dom';

export default {
  name: 'VFormLineSlot',
  componentName: 'VFormLineSlot',
  props: {
    vNode: {
      type: Object,
      default: () => {}
    },
    layerRow: {
      type: Object,
      default: () => {}
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
      component: null
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
    },
    required(val) {
      this.setNodeStyle()
    }
  },
  render(h) {
    return this.vNode
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.component = getOneChildComponent(this)
      if(this.$children.length && this.component) {
        // 如果组件存在并且有 getInput 方法
        if(this.component.getInput) {
          this.handlerNode = this.input = this.component.getInput()
        } else {
          this.component.$on('focus', () => this.onFocus(this.component))
          this.component.$on('blur', this.onBlur)
          this.validator && this.$on.apply(this.component, [this.trigger, this.inputValidateField])
          this.handlerNode = this.validator && getOneChildNode(this.component.$el) || this.component.$el
        }
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getOneChildNode(this.$el)
        this.handlerNode = this.input || this.$el
      }
      if(this.input) {
        // 监听 blur/change 事件，触发校验
        on(this.input, 'focus', () => this.onFocus())
        on(this.input, 'blur', () => this.onBlur())
        this.validator && on(this.input, this.trigger, this.inputValidateField)
      }
      this.setNodeStyle()
      this.form.focusOpen && this.form.$emit('line-slot-change', {path: this.path, slot: this, input: this.input})
    },
    setNodeStyle() {
      this.handlerNode.style.border = `${this.getStyle.referenceBorderColor ? ' 1px solid '+this.getStyle.referenceBorderColor : ''}`
      this.handlerNode.style.backgroundColor = `${this.getStyle.referenceBgColor || (typeof this.required === 'string' ? this.required : '')}`
    },
    onFocus(component) {
      this.form.focusOpen && this.form.$emit('on-focus', this.path)
      // 聚焦时全选
      this.$el.parentNode.classList.add('v-layer-item--focus')
      if(this.form.focusTextAllSelected) {
        if(this.input) {
          this.input.select && this.input.select()
        } else component && component.select && component.select()
      }
    },
    onBlur() {
      this.form.focusOpen && this.form.$emit('on-blur', this.path)
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
      off(this.input, 'focus', this.onFocus)
      off(this.input, 'blur', this.onBlur)
      this.validator && off(this.input, this.trigger, this.inputValidateField)
    }
    if(this.$children.length && this.component && !this.component.getInput) {
      this.component.$off('focus', () => this.onFocus(this.component))
      this.component.$off('blur', this.onBlur)
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
 