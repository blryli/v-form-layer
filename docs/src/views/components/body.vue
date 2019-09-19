<template>
  <v-form enter>
    <v-form-line :cols="[{ label: '节点1', path: '/node1' },{ label: '监听回车', path: '/node2' },{ label: '监听聚焦', path: '/node3' }]">
      <el-input  v-model="form.node1" @enter="handleEnter"></el-input>
      <el-input  v-model="form.node2"></el-input>
      <el-input  v-model="form.node3" @focus="handleFocus"></el-input>
    </v-form-line>
    <v-form-line label="动态禁用" :cols="[{ path: '/node4' },{ path: '/node5' },{ path: '/node6' }]">
      <el-input  v-model="form.node4"></el-input>
      <el-input  v-model="form.node5" :disabled="!!form.node4"></el-input>
      <el-input  v-model="form.node6"></el-input>
    </v-form-line>
    <v-form-line :cols="[{ label: '节点7', path: '/node7',span: 18}, {span: 6}]" :span="8">
      <el-input  v-model="form.node7"></el-input>
      <el-button style="width: 100%" @click="show8 = !show8">切换8显示</el-button>
    </v-form-line>
    <v-form-line :cols="[{ label: '节点8', path: '/node8'}]" :span="8">
      <el-input v-if="show8" v-model="form.node8"></el-input>
    </v-form-line>
    <v-form-line :cols="[{ label: '节点9', path: '/node9'}]" :span="8">
      <el-input  v-model="form.node9"></el-input>
    </v-form-line>
  </v-form>
</template>

<script>
  export default {
    name: 'VHeader',
    data () {
      return {
        form: {},
        show8: true
      }
    },
    methods: {
      handleEnter() {
        console.log('/node1 监听到回车，执行方法')
      },
      handleFocus() {
        console.log('/node3 监听到聚焦，执行方法')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>