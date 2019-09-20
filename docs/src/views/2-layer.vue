<template>
  <div>
    <h3>表单添加图层</h3>
    <v-form focusControl v-model="layer">
      <v-form-line :cols="[{path: '/name', label: '三角图层'},{path: '/age', label: '文字图层'}]">
        <el-input v-model="form.name" />
        <el-input v-model="form.age"/>
      </v-form-line>
      <v-form-line
        label="气泡"
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
      form: { name: '我是新值' },
      layer: [{
        id: 'message',
        show: true,
        data: [
          {
            type: 'triangle',
            path: '/name',
            message: '看什么看，我是旧值',
          },
          {
            type: 'text',
            effect: 'red',
            referenceBorderColor: 'red',
            path: '/age',
            message: '我错了'
          },
          {
            effect: 'warn',
            path: '/xiong',
            message: '橙泡'
          },
          {
            effect: 'error',
            path: '/yao',
            message: '红泡'
          },
          {
            effect: 'warn',
            path: '/tun',
            message: '五花泡'
          },
          {
            path: '/tun',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'blue',
            path: '/tun',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'error',
            path: '/tun',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'orange',
            path: '/tun',
            message: '五花泡'
          },
          {
            effect: 'error',
            path: '/tun',
            message: '五花泡'
          }
        ]
      }]
    }
  }
}
</script>

<style>
.table{
  display: table;
}
.table > *{
  display: table-cell;
  vertical-align: middle;
}
</style>
