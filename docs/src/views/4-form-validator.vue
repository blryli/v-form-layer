<template>
  <div>
    <h3>表单校验</h3>
    <el-button type="primary" @click="show1 = !show1">show1</el-button>
    <el-button type="primary" @click="show2 = !show2">show2</el-button>

    <v-form ref="form" v-model="layer" focus-open :data="form" label-width="120px" @validate="handleValidate">
      <v-form-line
        v-if="show1"
        :cols="[{path: '/name', label: '必填校验', required: true,validator: rules.error, trigger: 'validate'},{path: '/age', label: '警告校验',validator: rules.warn}]"
      >
        <input v-model="form.name">
        <input v-model="form.age">
      </v-form-line>
      <v-form-line
        v-if="show2"
        :cols="[{path: '/async', label: '异步校验', required: true,validator: rules.async},{path: '/select', label: 'select', required: true,validator: rules.select, trigger: 'change'}]"
      >
        <input v-model="form.async">
        <el-select
          ref="select"
          v-model="form.select"
          style="width: 100%;"
          class="w-100"
          placeholder="请选择"
          automatic-dropdown
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </v-form-line>
      <v-form-line
        :cols="[{path: '/autoClear', label: '自动移除校验', required: true,validator: rules.autoClear}]"
      >
        <input v-model="form.autoClear">
      </v-form-line>
    </v-form>
    <button type="primary" @click="validate">校 验</button>
    <button @click="clearValidate">清除校验</button>
  </div>
</template>

<script>
import { validateSuccess, validateError, validateWarn } from '@/utils/validate'
export default {
  data() {
    const rules = {
      error: val => {
        if (!val) {
          return validateError('必填字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      warn: val => {
        if (!val) {
          return validateWarn('警告字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      select: val => {
        if (!val) {
          return validateError('警告字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      autoClear: val => {
        if (!val) {
          return { ...validateError('自动移除字段测试文本'), showAlways: true }
        } else {
          return validateSuccess()
        }
      },
      async: async val => {
        if (await this.getDate()) {
          return validateError('异步校验测试文本')
        } else {
          return validateSuccess()
        }
      }
    }
    return {
      show1: true,
      show2: true,
      form: {},
      layer: [],
      rules,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
    }
  },
  methods: {
    async getDate() {
      const timeout = () => new Promise((resolve) => setTimeout(resolve, 500))
      await timeout()
      return true
    },
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log(JSON.stringify(validators, null, 2)) // 所有校验结果数组
        console.log(val, val ? '校验通过' : '校验不通过')
      })
    },
    handleValidate(obj) {
      const { path } = obj
      path === '/autoClear' && setTimeout(() => {
        this.$refs.form.clearValidate([path])
      }, 2000)
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style>

</style>
