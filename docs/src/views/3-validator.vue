<template>
  <div>
    <h3>表单校验</h3>
    <v-form ref="form" focus-open v-model="layer" :data="form" label-width="120px">
      <v-form-line
        :cols="[{path: '/name', label: '必填校验', required: true,validator: rules.error},{path: '/age', label: '警告校验',validator: rules.warn}]"
      >
        <input v-model="form.name"/>
        <input v-model="form.age"/>
      </v-form-line>
    </v-form>
    <button type="primary" @click="validate">校 验</button>
    <button @click="clearValidate">清除校验</button>
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
