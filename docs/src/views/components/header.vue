<template>
  <div>
    <v-form enter v-model="layer" :data="form" ref="form">
    <v-form-line :cols="[{ label: '节点1', path: '/node1' },{ label: '监听回车', path: '/node2' },{ label: '监听聚焦', path: '/node3' }]">
      <el-input  v-model="form.node1" @enter="handleEnter" />
      <el-input  v-model="form.node2" />
      <el-select automatic-dropdown v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </v-form-line>
    <v-form-line label="动态禁用" :cols="[{ path: '/node4' },{ path: '/node5' },{ path: '/node6' }]">
      <el-input  v-model="form.node4" />
      <el-input  v-model="form.node5" :disabled="!!form.node4" />
      <el-input  v-model="form.node6" />
    </v-form-line>
    <v-form-line :cols="[{ label: '节点7', path: '/node7',span: 18}, {span: 6}]" :span="8">
      <el-input  v-model="form.node7" />
      <el-button style="width: 100%" @click="show8 = !show8">切换8显示</el-button>
    </v-form-line>
    <v-form-line :cols="[{ label: '节点8', path: '/node8', validator: rule.node8}]" :span="8">
      <el-input v-if="show8" v-model="form.node8" />
    </v-form-line>
    <v-form-line :cols="[{ label: '原生input', path: '/node9'}]" :span="8">
      <input v-model="form.node9" @keydown.enter="save" />
    </v-form-line>
  </v-form>
  </div>
</template>

<script>
import { validateSuccess, validateError } from '@/utils/validate';
  export default {
    name: 'VHeader',
    data () {
      return {
        form: {},
        layer: [],
        show8: true,
        rule: {
          node8:(val) => {
            if(!val) {
              return validateError('不能为空')
            } else {
              return validateSuccess()
            }
          }
        },
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    },
    methods: {
      handleEnter() {
        console.log('/node1 监听到回车，执行方法')
      },
      handleFocus() {
        console.log('/node3 监听到聚焦，执行方法')
      },
      save() {
        this.$refs['form'].validate((val, validators) => {
          console.log(JSON.stringify(validators, null, 2)) // 所有校验结果数组
          console.log(val, val ? '校验通过' : '校验不通过') 
          if(val) {
            this.$refs.form.focus()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>