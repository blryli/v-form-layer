<template>
  <div>
    <h3>表单校验</h3>
    <v-form ref="form" v-model="layer" :data="form">
      <v-form-line
        :cols="[{path: '/name', label: '名字',validator: rules.name},{path: '/age', label: '年龄',validator: rules.age}]"
      >
        <el-input v-model="form.name"/>
        <el-input v-model="form.age"/>
      </v-form-line>
    </v-form>
    <el-button @click="validate">校验</el-button>
    <el-button @click="clearValidate">清除校验</el-button>
  </div>
</template>

<script>
import rules from '@/utils/rules';
export default {
  data() {
    return {
      form: {},
      layer: [],
      rules
    }
  },
  methods: {
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log(JSON.stringify(validators, null, 2)) // 所有校验结果数组
        console.log(val, val ? '校验通过' : '校验不通过') 
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style>
</style>
