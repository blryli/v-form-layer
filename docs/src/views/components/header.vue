<template>
  <div>
    <p>enter键：下一个 , shift+enter键：上一个</p>
    <p><button @click="$refs.form.focus()">form focus</button></p>
    <p></p>
    <v-form ref="form" focus-open @last-focused-node-next="lastFocusedNodeNext" @first-focused-node-prev="firstFocusedNodePrev">
      <v-form-line :cols="[{ path: '/label1', label: 'label1' },{ path: '/label2', label: 'label2' }]">
        <header-item autofocus></header-item>
        <header-item></header-item>
      </v-form-line>
      <v-form-line :cols="[{ path: '/label3', label: 'label3' },{ path: '/label4', label: 'label4' }]" :span="12">
        <header-item></header-item>
        <header-item></header-item>
      </v-form-line>
      <v-form-line :cols="[{ path: '/label5', label: 'label5' },{ path: '/label6', label: 'label6' }]" :span="12">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label7" :cols="[{ path: '/label7' },{ path: '/label8' }]">
        <input />
        <header-item></header-item>
      </v-form-line>
      <v-form-line label="label8" :cols="[{ path: '/label9' },{ path: '/label10' }]" :span="12">
        <input />
        <header-item></header-item>
      </v-form-line>
      <v-form-line label="label9" :cols="[{ path: '/label11' }]" :span="12">
        <header-item></header-item>
      </v-form-line>
    </v-form>
    <p>header到body跨表单聚焦</p>
  </div>
</template>

<script>
import HeaderItem from './HeaderItem'
  export default {
    name: 'VHeader',
    components: {
      HeaderItem
    },
    data () {
      return {
        show2: true,
        label3: ''
      }
    },
    inject: ['root'],
    methods: {
      firstFocusedNodePrev(path) {
        console.log('firstFocusedNodePrev', path)
      },
      lastFocusedNodeNext(path) {
        console.log('last-focused-node-next', path)
        this.root.$refs.body.focus()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>