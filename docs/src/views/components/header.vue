<template>
  <div>
    <el-button class="m-b-20" v-model="layer" @click="show8 = !show8">toggle 节点8</el-button>
    <v-form focusControl>
    <v-form-line :cols="[{ label: '节点1', path: '/node1' },{ label: '跳过字段', path: '/node2' },{ label: 'select', path: '/node3' }]">
      <el-input  v-model="form.node1" placeholder="1" />
      <el-input  v-model="form.node2" placeholder="2" />
      <el-select ref="select" v-model="value" placeholder="请选择" automatic-dropdown @blur="blur">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </v-form-line>
    <v-form-line label="动态禁用" :cols="[{ path: '/node4' },{ path: '/node5' },{ path: '/node6' }]">
      <el-input  v-model="form.node4" placeholder="有值禁用5" />
      <el-input  v-model="form.node5" placeholder="5" :disabled="!!form.node4" />
      <el-input  v-model="form.node6" />
    </v-form-line>
    <v-form-line :cols="[{ label: '节点7', path: '/node7'}]" :span="8">
      <el-input  v-model="form.node7" />
    </v-form-line>
    <v-form-line :cols="[{ label: '节点8', path: '/node8'}]" :span="8">
      <el-input v-if="show8" v-model="form.node8" />
    </v-form-line>
    <v-form-line :cols="[{ label: '原生input', path: '/node9'}]" :span="8">
      <input v-model="form.node9" />
    </v-form-line>
  </v-form>
  </div>
</template>

<script>
  export default {
    name: 'VHeader',
    data () {
      return {
        form: {},
        layer: [],
        show8: true,
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
      blur(val) {
        this.$refs.select.blur()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>