<template>
  <div>
    <h3>表单布局</h3>
    <el-form label-position="left" label-width="80px">
      <el-form-item label="我是那波我是那波我是那波我是那波">
        <el-input></el-input>
      </el-form-item>
    </el-form>
    <v-form label-width="120px">
      <v-form-line :cols="[{ path: '/name', label: '我是那波我是那波我是那波我是那波',span: 12},{ path: '/age', label: '年龄'},{ path: '/height', label: '身高'}]">
        <el-input v-model="form.name"/>
        <el-input v-model="form.age"/>
        <el-input v-model="form.height"/>
      </v-form-line>
      <v-form-line label="并列布局" :cols="[{ path: '/xiong'},{ path: '/yao'},{ path: '/tun'}]">
        <el-input v-model="form.xiong"/>
        <el-input v-model="form.yao"/>
        <el-input v-model="form.tun"/>
      </v-form-line>
      <v-form-line :cols="[{label: '性别', path: '/sex'}]" :span="12">
        <el-input v-model="form.sex"/>
      </v-form-line>
      <v-form-line label="分段并列布局" :span="12" :cols="[{ path: '/lian'},{ path: '/yan'},{ path: '/zui'}]">
        <el-input v-model="form.lian"/>
        <el-input v-model="form.yan"/>
        <el-input v-model="form.zui"/>
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {}
    }
  }
}
</script>
