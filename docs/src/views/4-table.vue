<template>
  <div>
    <h3>表格校验</h3>
    <v-form ref="form" v-model="layer" :data="data" rowledge="0">
      <el-table :data="data">
        <el-table-column label="名字">
          <template slot-scope="scope">
            <v-form-line :cols="[{path: `/${scope.$index}/person`}]">
              <el-popover placement="right" title="标题" width="200" trigger="hover">
                <el-input slot="reference" v-model.lazy="scope.row.person.name"/>
              </el-popover>
            </v-form-line>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <v-form-line :cols="[{path: `/${scope.$index}/age`, validator: rules.age}]">
              <el-input v-model.lazy="scope.row.age"/>
            </v-form-line>
          </template>
        </el-table-column>
        <el-table-column label="身高">
          <template slot-scope="scope">
            <v-form-line :cols="[{path: `/${scope.$index}/height`}]">
              <el-input v-model.lazy="scope.row.height"/>
            </v-form-line>
          </template>
        </el-table-column>
      </el-table>
    </v-form>
    <p></p>
    <el-button @click="validate">校验</el-button>
    <el-button @click="clearValidate">清除校验</el-button>
  </div>
</template>

<script>
import rules from '@/utils/rules';
import mock from 'mockjs';

export default {
  data() {
    return {
      rules,
      data: [],
      layer: []
    }
  },
  methods: {
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log(JSON.stringify(validators, null, 2))
        console.log(val, val ? '校验通过' : '校验不通过')
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
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
  }
}
</script>

<style>
</style>
