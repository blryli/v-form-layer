<script>
import VFormItem from "./FormItem";
import VFormLineSlot from "./FormLineSlot";
import VLayer from "./Layer";
import VCol from "./Col";
export default {
  name: "VFormLine",
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
      default: ""
    },
    span: {
      type: Number,
      default: 24
    },
    labelWidth: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  inject: ["form"],
  created() {
    this.$emit.apply(this.form, [
      "form.line.cols", this.cols
    ]);
  },
  computed: {
    slotsLen() {
      return (this.$slots.default || []).filter((d, i) => d.tag).length;
    },
    lineFreeSpace() {
      let freeSpace = 24;
      let freeNodeNum = this.slotsLen;
      (this.cols || []).forEach(d => {
        if (d.span) {
          freeSpace -= d.span;
          freeNodeNum--;
        }
      });
      return freeSpace / freeNodeNum;
    },
    // 间距
    itemGutter() {
      return this.form.itemGutter / 2 + "px";
    },
    // 响应式
    isResponse() {
      return this.form.isResponse;
    }
  },
  render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    const slots = (this.$slots.default || []).filter((d, i) => d.tag);
    let nodes = []; // form-line 实际插入的节点
    let abreastSlots = []; // form-item 内并排节点
    slots.forEach((slot, index) => {
      // 获取节点属性
      let span, labelWidth;
      const { label, path, required, validator, trigger } =
        (this.cols.length && this.cols[index]) || {};
      if (this.cols.length && this.cols[index]) {
        span = this.cols[index].span || this.lineFreeSpace;
        labelWidth =
          this.cols[index].labelWidth ||
          this.labelWidth ||
          this.form.labelWidth ||
          "80px";
      } else {
        span = this.lineFreeSpace;
      }
      this.isResponse && (span = 24);

      // 回车节点处理
      if(this.path && this.form.enter) {
        this.form.inputs.forEach(input => {
          // input.path === path && (input.component = slot)
        })
      }
      // 添加图层
      validator && (this.form.isValidate = true);
      const layerRow = this.form.initLayer.find(d => d.path === path);
      slot = h("v-form-line-slot", {
        attrs: { id: path, path, vNode: slot, layerRow, validator, trigger, required }
      }); // 扩展原始节点
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
        );
      } else if (validator) {
        slot = h(
          "v-layer",
          {
            attrs: {
              layer: [
                {
                  placement: "top",
                  disabled: true,
                  path,
                  message: ""
                }
              ],
              path
            }
          },
          [slot]
        );
      }

      if (!this.label) {
        // form-item基本布局
        const node = label
          ? h(
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
          : slot;
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
            [node]
          )
        );
      }
      if (this.label) {
        // form-item并列布局
        const noFirst = !!abreastSlots.length
        abreastSlots.push([
          h(
            "v-col",
            {
              attrs: {
                span: span,
                noFirst: noFirst
              },
              class: "v-form-line--abreast"
            },
            [slot]
          )
        ]);
      }
    });
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
      "v-col",
      {
        attrs: { span: span }
      },
      [
        h(
          "div",
          { class: "v-form-line", style: { margin: `0 -${this.itemGutter}` } },
          [nodes]
        )
      ]
    );
  }
};
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
  width: calc(100% + 1px);
}
</style>

