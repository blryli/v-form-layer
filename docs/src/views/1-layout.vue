<template>
  <div>
    <h3>布局</h3>
    <v-form label-width="80px">
      <v-form-line :cols="[{ label: '名字'},{ label: '年龄'}]">
        <el-input ref="input" v-model="form.name"/>
        <el-input v-model="form.age"/>
      </v-form-line>
      <v-form-line :cols="[{ label: '名字',span: 12},{ label: '年龄'},{ label: '身高'}]">
        <el-input v-model="form.name"/>
        <el-input v-model="form.age"/>
        <el-input v-model="form.height"/>
      </v-form-line>
      <v-form-line label="三围">
        <el-input v-model="form.xiong"/>
        <el-input v-model="form.yao"/>
        <el-input v-model="form.tun"/>
      </v-form-line>
      <v-form-line :cols="[{path: '/form/sex', label: '性别'}]" :span="12">
        <el-input v-model="form.sex"/>
      </v-form-line>
      <v-form-line label="三围" :span="12">
        <el-input v-model="form.xiong"/>
        <el-input v-model="form.yao"/>
        <el-input v-model="form.tun"/>
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
