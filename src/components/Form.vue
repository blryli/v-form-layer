<template>
  <div :class="formClass">
    <slot />
  </div>
</template>

<script>
import Validator from 'mixins/validator';
import Enter from 'mixins/enter';
export default {
  name: 'VForm',
  mixins: [Validator, Enter],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: [Object, Array],
    rules: {
      type: Array,
      default: () => []
    },
    currentPath: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: ''
    },
    lineHeight: {
      type: String,
      default: '32px'
    },
    itemGutter: {
      type: Number,
      default: 0
    },
    response: {
      type: Boolean,
      default: true
    },
    rowledge: {
      type: String,
      default: '24px'
    },
    enter: {
      type: Boolean,
      default: false
    },
    focusTextAllSelected: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    }
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
      isValidate: false
    }
  },
  created () {
    this.init()
  },
  watch: {
    value() {
      this.init();
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
  computed: {
    formClass() {
      let formClass = "v-form ";
      if (this.response && this.isResponse) {
        formClass += "v-form-response v-form--label-top"
      } else {
        this.labelPosition &&
        (formClass += `v-form--label-${this.labelPosition} `);
      }
      return formClass
    }
  },
  methods: {
    init() {
      console.log('init')
      this.layer = this.value
      this.initLayer = Object.freeze(this.formationLayer());
    },
    formationLayer() {
      return (this.layer || []).reduce((acc, cur) => {
        const show = cur.show === undefined ? true : cur.show;
        (cur.data || []).forEach(da => {
          da.id = cur.id;
          const layer = {...cur.view, ...da, ...{show} };
          const findIndex = acc.findIndex(l => l.path === da.path);
          if (findIndex === -1) {
            acc.push({
              path: da.path,
              layer: [layer]
            });
          } else {
            acc[findIndex].layer.push(layer);
          }
        });
        return acc;
      }, [])
    }
  },
  mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true)
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
