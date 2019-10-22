<script>
import { on, off, getOneChildNode, getOneChildComponent } from 'utils/dom';
import FormLineSlotContent from "./FormLineSlotContent";

export default {
  name: 'VFormLineSlot',
  componentName: 'VFormLineSlot',
  components: {
    FormLineSlotContent
  },
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
      if(this.$children.length) {
        const getComponent = getOneChildComponent(this)
        if(getComponent) {
          this.$on.apply(getComponent, ['focus', () => this.onFocus(getComponent)])
          this.path && this.validator && this.$on.apply(getComponent, [this.trigger, this.inputValidateField])
          this.handlerNode = getComponent.getInput && getComponent.getInput() || this.validator && getOneChildNode(getComponent.$el) || getComponent.$el
        } else {
          this.handlerNode = this.$el
        }
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getOneChildNode(this.$el)
        this.handlerNode = this.input || this.$el
        // 监听 blur/change 事件，触发校验
        on(this.input, 'focus', this.onFocus)
        on(this.input, 'blur', this.onBlur)
        this.path && this.validator && on(this.input, this.trigger, this.inputValidateField)
      }
      this.setNodeStyle()
      this.path && this.$emit.apply(this.form, ['line-slot-change', {path: this.path, slot: this, input: this.input}])
    },
    setNodeStyle() {
      this.handlerNode.style.border = `${this.getStyle.referenceBorderColor ? ' 1px solid '+this.getStyle.referenceBorderColor : ''}`
      this.handlerNode.style.backgroundColor = `${this.getStyle.referenceBgColor || this.required}`
    },
    onFocus(component) {
      this.form.focusOpen && this.path && this.$emit.apply(this.form, ['listener-focus', this.path])
      // 聚焦时全选
      if(this.form.focusTextAllSelected) {
        this.$el.parentNode.classList.add('v-layer-item--focus')
        this.input && this.input.select && this.input.select()
        component && component.select && component.select()
      }
    },
    onBlur() {
      this.form.focusOpen && this.$emit.apply(this.form, ['listener-blur', this])
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
 