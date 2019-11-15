<template>
  <div>
    <p>enter键：下一个 , shift+enter键：上一个</p>
    <p></p>
    <v-form ref="form" focus-open :focusOptions="{loop: true}" focusTextAllSelected>
      <v-form-line :cols="[{ path: '/label1', label: 'label1' },{ path: '/label2', label: 'label2' }]">
        <input autofocus v-model="value"  />
        <!-- <input v-model="value"  /> -->
        <code-select v-model="value1" type="CUS_MAPPING_COUNTRY_CODE_V"
          dep-gb="gb"></code-select>
      </v-form-line>
      <v-form-line :cols="[{ path: '/label3', label: 'label3' },{ path: '/label4', label: 'label4' }]" :span="12">
        <el-date-picker
          v-model="value"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周">
        </el-date-picker>
            <el-date-picker
          v-model="value"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </v-form-line>
      <v-form-line :cols="[{ path: '/label5', label: 'label5' },{ path: '/label6', label: 'label6' }]" :span="12">
        <input v-model="value"  />
        <input v-model="value"  />
      </v-form-line>
      <v-form-line label="label7" :cols="[{ path: '/label7' },{ path: '/label8' }]">
        <input v-model="value"  />
        <input v-model="value"  />
      </v-form-line>
      <v-form-line label="label8" :cols="[{ path: '/label9' },{ path: '/label10' }]" :span="12">
        <input v-model="value"  />
        <input v-model="value"  />
      </v-form-line>
      <v-form-line label="label9" :cols="[{ path: '/label11' },{ path: '/label12' }]" :span="12">
        <input v-model="value"  />
        <input v-model="value"  />
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'VHeader',
    data () {
      return {
        value: 'value',
        value1: 'value1'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>