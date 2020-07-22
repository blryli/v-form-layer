
<template>
  <div :class="formClass" :style="{width: isResponse ? '' : width}">
    <slot />
  </div>
</template>
<script>
import Validator from 'mixins/validator'
import FocusControl from 'mixins/focusControl'
export default {
  name: 'VForm',
  mixins: [Validator, FocusControl],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: [Object, Array], default: () => [] },
    rules: { type: Array, default: () => [] },
    currentPath: { type: String, default: '' },
    labelWidth: { type: String, default: '' },
    labelPosition: { type: String, default: '' },
    lineHeight: { type: String, default: '32px' },
    itemGutter: { type: Number, default: 0 },
    response: { type: Boolean, default: true },
    rowledge: { type: String, default: '24px' },
    focusOpen: { type: Boolean, default: true },
    focusOptions: { type: Object, default: () => {} },
    focusTextAllSelected: { type: Boolean, default: true },
    width: { type: String, default: '' },
    focusStop: Boolean
  },
  provide() {
    return {
      form: this
    }
  },
  data() {
    return {
      layer: [],
      initLayer: Object.freeze([]),
      isResponse: false,
      validators: [],
      inputIndex: 0
    }
  },
  computed: {
    formClass() {
      let formClass = 'v-form '
      if (this.response && this.isResponse) {
        formClass += 'is-response'
      } else {
        this.labelPosition &&
        (formClass += `v-form--label-${this.labelPosition} `)
      }
      return formClass
    }
  },
  watch: {
    value() {
      this.init()
    },
    validators(data) {
      const layer = {
        id: '_validator',
        show: true,
        data
      }
      const index = this.layer.findIndex(d => d.id === '_validator')
      index === -1 ? this.layer.push(layer) : this.layer.splice(index, 1, layer)
      this.$emit('input', this.layer)
    }
  },
  created() {
    this.formLines = []
    this.init()
  },
  mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true)
    }
  },
  methods: {
    init() {
      this.layer = this.value
      this.initLayer = Object.freeze(this.formationLayer())
    },
    formationLayer() {
      return (this.layer || []).reduce((acc, cur) => {
        const show = cur.show === undefined ? true : cur.show;
        (cur.data || []).forEach(da => {
          da.id = cur.id
          const layer = { ...cur.view, ...da, ...{ show }}
          const findIndex = acc.findIndex(l => l.path === da.path)
          if (findIndex === -1) {
            acc.push({
              path: da.path,
              layer: [layer]
            })
          } else {
            acc[findIndex].layer.push(layer)
          }
        })
        return acc
      }, [])
    }
  }
}
</script>

<style scoped>
.v-form::before,
.v-form::after {
  display: table;
  content: "";
}

.v-form:after {
  clear: both;
}
</style>

<style>
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

.v-layer{
  position: relative;
}

.v-layer-item--focus, .is-validator{
  position: relative;
  z-index: 1;
}
</style>
