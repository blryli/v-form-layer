<template>
  <v-form ref="form" enter>
    <v-form-line :cols="[{ label: '节点1', path: '/node1' },{ label: '节点2', path: '/node2' },{ label: '节点3', path: '/node3' }]">
      <el-input  v-model="form.node1"></el-input>
      <el-input  v-model="form.node2"></el-input>
      <el-input  v-model="form.node3"></el-input>
    </v-form-line>
  </v-form>
</template>

<script>
  export default {
    name: 'VHeader',
    data () {
      return {
        form: {}
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>