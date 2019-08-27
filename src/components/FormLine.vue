<script>
import VFormItem from './FormItem'
import VFormLineSlot from './FormLineSlot'
import VLayer from './Layer'
import VCol from './Col'
export default {
  name: 'VFormLine',
  components: {
    VFormItem,
    VFormLineSlot,
    VLayer,
    VCol
  },
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    required: Boolean,
    span: {
      type: Number,
      default: 24
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  inject: ['form'],
  data() {
    return {
      slotsLen: 0
    }
  },
  created () {
    this.$on.apply(this.form, ['form.line.validate', () => {
      this.cols.forEach(d => {
        d.validator && this.form.validateField(d.path, d.validator)
      })
    }])
  },
  computed: {
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
    }
  },
  mounted() {
    this.slotsLen = (this.$slots.default || []).filter((d, i) => d.tag).length
  },
  render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    const slots = (this.$slots.default || []).filter((d, i) => d.tag)
    this.slotsLen
    let nodes = [] // form-line 实际插入的节点
    let abreastSlots = [] // form-item 内并排节点
    slots.forEach((slot, index) => {
      // 获取节点属性
      let span, labelWidth;
      const { label, path, required, validator, trigger } = this.cols.length && this.cols[index]
      if (this.cols.length && this.cols[index]) {
        span = this.cols[index].span || this.lineFreeSpace;
        labelWidth = this.cols[index].labelWidth || this.labelWidth || this.form.labelWidth || "80px";
      } else {
        span = this.lineFreeSpace;
      }
      this.isResponse && (span = 24);

      // 添加图层
      validator && (this.form.isValidate = true)
      const layerRow = this.form.initLayer.find(d => d.path === path)
      slot = h('v-form-line-slot', { attrs: { id: path, path, vNode: slot, layerRow, validator, trigger } }) // 扩展原始节点
      if (layerRow) {
        slot = h(
          "v-layer",
          {
            attrs: {
              layer: layerRow.layer,
              path
            }
          },
          [slot]
        )
      } else if (validator) {
        slot = h(
          "v-layer",
          {
            attrs: {
              layer: [{
                placement: 'top',
                disabled: true,
                path,
                message: ''
              }],
              path
            }
          },
          [slot]
        )
      }


      // 无form-item布局
      if (!this.label && !label) {
        nodes.push(slot);
        return;
      }
      if (label) {
        // form-item基本布局
        nodes.push(
          h(
            "v-col",
            {
              attrs: {
                span: span
              },
              style: {
                padding: `0 ${this.itemGutter}`
              }
            },
            [
              h(
                "v-form-item",
                {
                  attrs: {
                    label: label,
                    labelWidth: labelWidth,
                    required: required
                  }
                },
                [slot]
              )
            ]
          )
        );
      }
      if (this.label) {
        // form-item并列布局
        abreastSlots.push([
          h(
            "v-col",
            {
              attrs: {
                span: span
              },
              class: "v-form-line--abreast"
            },
            [slot]
          )
        ]);
      }
    })
    // 并列布局添加节点
    if (this.label) {
      nodes.push(
        h(
          "v-form-item",
          {
            attrs: {
              label: this.label,
              labelWidth: this.labelWidth || this.form.labelWidth || "80px",
              required: this.required
            },
            style: { padding: `0 ${this.itemGutter}` }
          },
          [abreastSlots]
        )
      );
    }
    const span = this.isResponse ? 24 : this.span;
    return h(
      'v-col',
      {
        attrs: { span: span }
      },
      [
        h('div', { class: 'v-form-line', style: { margin: `0 -${this.itemGutter}` } }, [nodes])
      ]
    )
  }
}
</script>

<style scoped>
.v-form-line:before {
  display: table;
  content: "";
}

.v-form-line:after {
  display: table;
  content: "";
  clear: both;
}

.v-form-line--abreast + .v-form-line--abreast {
  margin-left: -1px;
}
</style>

