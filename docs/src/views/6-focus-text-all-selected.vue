<template>
  <div>
    <p>enter键：下一个 , shift+enter键：上一个</p>
    <p />
    <v-form ref="form" focus-open :focus-options="{loop: true}" focus-text-all-selected>
      <v-form-line :cols="[{ path: '/label1', label: 'label1' },{ path: '/label2', label: 'label2' }]">
        <input v-model="value" autofocus>
        <input v-model="value">
      </v-form-line>
      <v-form-line :cols="[{ path: '/label3', label: 'label3' },{ path: '/label4', label: 'label4' }]" :span="12">
        <el-date-picker
          v-model="value2"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
        />
        <el-date-picker
          v-model="value3"
          type="month"
          placeholder="选择月"
        />
      </v-form-line>
      <v-form-line :cols="[{ path: '/label5', label: 'label5' },{ path: '/label6', label: 'label6' }]" :span="12">
        <input v-model="value">
        <input v-model="value">
      </v-form-line>
      <v-form-line label="label7" :cols="[{ path: '/label7' },{ path: '/label8' }]">
        <input v-model="value">
        <input v-model="value">
      </v-form-line>
      <v-form-line label="label8" :cols="[{ path: '/label9' },{ path: '/label10' }]" :span="12">
        <input v-model="value">
        <input v-model="value">
      </v-form-line>
      <v-form-line label="label9" :cols="[{ path: '/label11' },{ path: '/label12' }]" :span="12">
        <input v-model="value">
        <input v-model="value">
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'VHeader',
  data() {
    return {
      value: 'value',
      value1: 'value1',
      value2: 'value2',
      value3: 'value3'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
