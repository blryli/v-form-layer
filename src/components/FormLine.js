import VFormItem from './FormItem'
import VFormLineSlot from './FormLineSlot'
import VLayer from './Layer'
import VCol from './Col'
export default {
  name: 'VFormLine',
  componentName: 'VFormLine',
  components: {
    VFormItem,
    VFormLineSlot,
    VLayer,
    VCol
  },
  props: {
    cols: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    span: { type: Number, default: 24 },
    labelWidth: { type: String, default: '' },
    required: { type: Boolean, default: false }
  },
  inject: ['form'],
  computed: {
    slotsLen() {
      return (this.$slots.default || []).filter((d, i) => d.tag).length
    },
    lineFreeSpace() {
      let freeSpace = 24
      let freeNodeNum = this.slotsLen;
      (this.cols || []).forEach(d => {
        if (d.span) {
          freeSpace -= d.span
          freeNodeNum--
        }
      })
      return freeSpace / freeNodeNum
    },
    // 间距
    itemGutter() {
      return this.form.itemGutter / 2 + 'px'
    },
    // 响应式
    isResponse() {
      return this.form.isResponse
    },
    // 行距
    rowledge() {
      return this.form.rowledge
    },
    id(length = 6) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    }
  },
  created() {
    const validator = this.cols.filter(d => d.validator)
    validator.length && this.form.$emit('form.line.cols.validator', validator)
  },
  render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    const slots = (this.$slots.default || []).filter((d, i) => d.tag)
    const nodes = [] // form-line 实际插入的节点
    const abreastSlots = [] // form-item 内并排节点
    slots.forEach((slot, index) => {
      // 获取节点属性
      let span, labelWidth
      const { label, path = `_${this.id}-${index + 1}_`, required = false, validator, trigger } =
        (this.cols.length && this.cols[index]) || {}
      if (this.cols.length && this.cols[index]) {
        span = this.cols[index].span || this.lineFreeSpace
        labelWidth =
          this.cols[index].labelWidth ||
          this.labelWidth ||
          this.form.labelWidth ||
          '80px'
      } else {
        span = this.lineFreeSpace
      }
      this.isResponse && (span = 24)

      // 添加图层
      const layerRow = this.form.initLayer.find(d => d.path === path)
      slot = h('v-form-line-slot', {
        attrs: { path, vNode: slot, layerRow, validator, trigger, required }
      })

      const layer = layerRow && layerRow.layer || []
      slot = h(
        'v-layer',
        {
          attrs: { id: path, layer, path }
        },
        [slot]
      )

      if (!this.label) {
        // form-item基本布局
        const node = label
          ? h(
            'v-form-item',
            {
              attrs: {
                label: label,
                labelWidth: labelWidth,
                required: required
              }
            },
            [slot]
          )
          : slot
        nodes.push(
          h(
            'v-col',
            {
              attrs: {
                span: span
              }
            },
            [node]
          )
        )
      }
      if (this.label) {
        // form-item并列布局
        const noFirst = !!abreastSlots.length
        abreastSlots.push([
          h(
            'v-col',
            {
              attrs: {
                span: span,
                noFirst: noFirst
              },
              class: 'v-form-line--abreast'
            },
            [slot]
          )
        ])
      }
    })
    // 并列布局添加节点
    if (this.label) {
      nodes.push(
        h(
          'v-form-item',
          {
            attrs: {
              label: this.label,
              labelWidth: this.labelWidth || this.form.labelWidth || '80px',
              required: this.required
            }
          },
          [abreastSlots]
        )
      )
    }
    const span = this.isResponse ? 24 : this.span
    const style = {}
    if (this.itemGutter) {
      style['margin-left'] = '-' + this.itemGutter
      style['margin-right'] = '-' + this.itemGutter
    }
    return h(
      'v-col',
      {
        attrs: { span: span },
        style
      },
      [
        h(
          'div',
          { class: 'v-form-line', style: { padding: `0 ${this.itemGutter}`, marginBottom: this.rowledge }},
          [nodes]
        )
      ]
    )
  }
}
