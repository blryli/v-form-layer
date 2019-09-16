<script>
import { getChildNodes } from 'utils/dom';

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
      const vNodeComponent = this.vNode.componentInstance

      // 监听 focus 事件，聚焦之后选中内容
      vNodeComponent && vNodeComponent['focus'] && this.$on.apply(vNodeComponent, ['focus', () => vNodeComponent.select()])

      // 监听 blur/change 事件，触发校验
      if (!this.validator) return
      if (!vNodeComponent || (!vNodeComponent['blur'] && !vNodeComponent['change'])) {
        console.warn(`${this.path} 需要校验的路径所对应的节点组件必须具有 blur 或 change 事件，或者节点主动执行 validateField(path, rule, model) 方法`)
      }
      this.validator && vNodeComponent && this.$on.apply(vNodeComponent, [this.trigger, () => {
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
      this.focusNode.style.cssText = `${this.getStyle.referenceBorderColor ? 'border: 1px solid '+this.getStyle.referenceBorderColor : ''};background-color: ${this.getStyle.referenceBgColor || this.required}`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      const focusNodes = getChildNodes(this.$el);
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
