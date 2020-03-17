<template>
  <v-form ref="form">
    <v-form-line :cols="[{ label: '节点1' },{ label: '节点2' },{ label: '节点3' }]">
      <el-input v-model="form.node1" />
      <el-input v-model="form.node2" />
      <el-input v-model="form.node3" />
    </v-form-line>
  </v-form>
</template>

<script>
export default {
  name: 'VHeader',
  data() {
    return {
      form: {}
    }
  },
  methods: {
    focus() {
      this.$refs.form.focus()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
