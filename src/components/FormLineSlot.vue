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
