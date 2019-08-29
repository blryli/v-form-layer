<template>
  <div>
    <h3>表单添加图层</h3>
    <v-form v-model="layer">
      <v-form-line :cols="[{path: '/name', label: '名字'},{path: '/age', label: '年龄'}]">
        <el-input v-model="form.name"/>
        <el-input v-model="form.age"/>
      </v-form-line>
      <v-form-line
        label="三围"
        :cols="[{path: '/xiong'},{path: '/yao'},{path: '/tun'}]"
      >
        <el-input v-model="form.xiong"/>
        <el-input v-model="form.yao"/>
        <el-input v-model="form.tun"/>
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      layer: [{
        id: 'message',
        show: true,
        data: [
          {
            path: '/name',
            message: '测试message',
          },
          {
            effect: 'light',
            path: '/age',
            message: '测试message'
          },
          {
            effect: 'warn',
            path: '/xiong',
            message: '测试message'
          },
          {
            effect: 'error',
            path: '/yao',
            message: '测试message'
          },
          {
            effect: 'warn',
            path: '/tun',
            message: '测试message'
          },
          {
            path: '/tun',
            message: '测试message'
          },
          {
            placement: 'bottom',
            effect: 'blue',
            path: '/tun',
            message: '测试message'
          },
          {
            placement: 'bottom',
            effect: 'error',
            path: '/tun',
            message: '测试message'
          },
          {
            placement: 'bottom',
            effect: 'orange',
            path: '/tun',
            message: '测试message'
          },
          {
            effect: 'error',
            path: '/tun',
            message: '测试message'
          }
        ]
      }]
    }
  }
}
</script>

<style>
</style>
