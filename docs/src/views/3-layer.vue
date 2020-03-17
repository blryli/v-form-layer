<template>
  <div>
    <h3>表单添加图层</h3>
    <v-form v-model="layer">
      <v-form-line :cols="[{path: '/triangle', label: '三角图层'},{path: '/text', label: '文字图层'}]">
        <input>
        <input>
      </v-form-line>
      <v-form-line label="气泡" :cols="[{path: '/orange'},{path: '/red'},{path: '/colours'}]">
        <input>
        <input>
        <input>
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layer: [{
        id: 'message',
        show: true,
        data: [
          {
            type: 'triangle',
            path: '/triangle',
            message: 'old value'
          },
          {
            type: 'text',
            path: '/text',
            effect: 'red',
            referenceBorderColor: 'red',
            message: '我错了'
          },
          {
            effect: 'orange',
            path: '/orange',
            message: '橙泡'
          },
          {
            effect: 'error',
            path: '/red',
            message: '红泡'
          },
          {
            effect: 'Warn',
            path: '/colours',
            message: '五花泡'
          },
          {
            path: '/colours',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'blue',
            path: '/colours',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'error',
            path: '/colours',
            message: '五花泡'
          },
          {
            placement: 'bottom',
            effect: 'orange',
            path: '/colours',
            message: '五花泡'
          },
          {
            effect: 'error',
            path: '/colours',
            message: '五花泡'
          }
        ]
      }]
    }
  }
}
</script>

<style>

</style>
