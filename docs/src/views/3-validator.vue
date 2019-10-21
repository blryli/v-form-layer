<template>
  <div>
    <h3>表单校验</h3>
    <v-form ref="form" focus-open v-model="layer" :data="form" label-width="120px">
      <v-form-line
        :cols="[{path: '/name', label: '必填校验', required: true,validator: rules.error},{path: '/age', label: '警告校验',validator: rules.warn}]"
      >
        <el-input v-model="form.name"/>
        <input v-model="form.age"/>
      </v-form-line>
      <v-form-line
        :cols="[{path: '/async', label: '异步校验', required: true,validator: rules.async},{path: '/select', label: 'select', required: true,validator: rules.select, trigger: 'change'}]"
      >
        <input v-model="form.async"/>
        <el-select
          style="width: 100%;"
          class="w-100"
          v-model="form.select"
          ref="select"
          placeholder="请选择"
          automatic-dropdown
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </v-form-line>
    </v-form>
    <button type="primary" @click="validate">校 验</button>
    <button @click="clearValidate">清除校验</button>
  </div>
</template>

<script>
import { validateSuccess, validateError, validateWarn } from '@/utils/validate';
export default {
  data() {
    const rules = {
      error:val => {
        if (!val) {
          return validateError('必填字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      warn:val => {
        if (!val) {
          return validateWarn('警告字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      select:val => {
        if (!val) {
          return validateError('警告字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      async:async val => {
        if (await this.getDate()) {
          return validateError('异步校验测试文本')
        } else {
          return validateSuccess()
        }
      }
    }
    return {
      form: {},
      layer: [],
      rules,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
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
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style>

</style>
