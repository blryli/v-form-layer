<template>
  <div class="v-col" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VCol',
  props: {
    span: {
      type: Number,
      default: 24
    },
    noFirst: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  inject: ['form'],
  computed: {
    style() {
      const style = {}
      const {span, noFirst, form: {isResponse}} = this

      if (span) {
        const width = Math.floor((span / 24 * 100) * 10000) / 10000 + '%'
        style.width = noFirst && !isResponse ? `calc(${width} + 1px)` : width
      } else {
        style.width = '100%'
      }

      return style
    }
  },
  methods: {}
}
</script>

<style scoped>
.v-col {
  float: left;
  box-sizing: border-box;
}
</style>

