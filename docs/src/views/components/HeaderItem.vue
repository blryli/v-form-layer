<template>
  <div class="header-item">
    <input
      ref="input"
      :autofocus="autofocus"
      :disabled="disabled"
      type="text"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    >
    <el-button type="primary" @click="disabled = !disabled">{{ disabled ? '启用' : '禁用' }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'HeaderItem',
  props: ['autofocus'],
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    focus() {
      console.log('focus')
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    getInput() {
      return this.$refs.input
    }
  }
}
</script>

<style scoped>
.header-item{
  display: flex;
}
</style>
