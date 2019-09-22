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
  computed: {
    style() {
      const style = {}

      if (this.gutter) {
        style.paddingLeft = this.gutter / 2 + 'px'
        style.paddingRight = style.paddingLeft
      }

      if (this.span) {
        const width = Math.floor((this.span / 24 * 100) * 10000) / 10000 + '%'
        style.width = this.noFirst ? `calc(${width} + 1px)` : width
      } else {
        style.width = '100%'
      }

      return style
    },
    gutter() {
      let parent = this.$parent
      while (parent && parent.$options.name !== 'VueRow') {
        parent = parent.$parent
      }
      return parent ? parent.gutter : 0
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

