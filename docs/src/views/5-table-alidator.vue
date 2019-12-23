<template>
  <div>
    <h3>表格校验</h3>
    <v-form ref="form" v-model="layer" :data="data" rowledge="0">
      <div class="table">
        <div class="table-row">
          <div class="table-cell">
            <div class="cell">必填字段</div>
          </div>
          <div class="table-cell">
            <div class="cell">必填字段</div>
          </div>
        </div>
        <div v-for="(d, i) in data" :key="i" class="table-row">
          <div class="table-cell">
            <div class="cell">
              <v-form-line :cols="[{path: `/${i}/error`, validator: rules.error}]">
                <input v-model="d.error">
              </v-form-line>
            </div>
          </div>
          <div class="table-cell">
            <div class="cell">
              <v-form-line :cols="[{path: `/${i}/warn`, validator: rules.warn}]">
                <input v-model="d.warn">
              </v-form-line>
            </div>
          </div>
        </div>
      </div>
    </v-form>
    <p />
    <button @click="validate">校验</button>
    <button @click="clearValidate">清除校验</button>
  </div>
</template>

<script>
import { validateSuccess, validateError, validateWarn } from '@/utils/validate'
import mock from 'mockjs'

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
      }
    }
    return {
      rules,
      data: [],
      layer: []
    }
  },
  mounted() {
    this.data = mock.mock({
      'arr|8': [
        {
          person: {
            value: '',
            data: mock.mock({
              'arr|5': [{
                name: '',
                age: ''
              }]
            }).arr
          },
          age: '',
          height: ''
        }
      ]
    }).arr
  },
  methods: {
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log('字段校验结果：', JSON.stringify(validators, null, 2))
        console.log(val, val ? '校验通过' : '校验不通过')
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style scoped>
.table {
  display: table;
  width: 100%;
}
.table-row {
  display: table-row;
}
.table-cell {
  display: table-cell;
}
.cell{
  padding: 10px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  overflow: hidden;
}

</style>
