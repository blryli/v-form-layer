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
      const getComponent = getOneChildComponent(this)
      if(this.$children.length && getComponent) {
        // 如果组件存在并且有 getInput 方法
        if(getComponent.getInput) {
          this.handlerNode = this.input = getComponent.getInput()
        } else {
          this.$on.apply(getComponent, ['focus', () => this.onFocus(getComponent)])
          this.$on.apply(getComponent, ['blur', this.onBlur])
          this.validator && this.$on.apply(getComponent, [this.trigger, this.inputValidateField])
          this.handlerNode = this.validator && getOneChildNode(getComponent.$el) || getComponent.$el
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
      this.form.focusOpen && this.$emit.apply(this.form, ['line-slot-change', {path: this.path, slot: this, input: this.input}])
    },
    setNodeStyle() {
      this.handlerNode.style.border = `${this.getStyle.referenceBorderColor ? ' 1px solid '+this.getStyle.referenceBorderColor : ''}`
      this.handlerNode.style.backgroundColor = `${this.getStyle.referenceBgColor || (typeof this.required === 'string' ? this.required : '')}`
    },
    onFocus(component) {
      this.form.focusOpen && this.$emit.apply(this.form, ['on-focus', this.path])
      // 聚焦时全选
      this.$el.parentNode.classList.add('v-layer-item--focus')
      if(this.form.focusTextAllSelected) {
        if(this.input) {
          this.input.select && this.input.select()
        } else component && component.select && component.select()
      }
    },
    onBlur() {
      this.form.focusOpen && this.$emit.apply(this.form, ['on-blur', this])
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
        && this.validator && off(this.input, this.trigger, this.inputValidateField)
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
 