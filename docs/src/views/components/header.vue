<template>
  <div>
    <p>enter键：下一个 , shift+enter键：上一个</p>
    <p><button @click="show2 = !show2">label2 {{show2 ? '隐藏' : '显示'}}</button></p>
    <p></p>
    <v-form focus-open @last-focused-node-next="lastFocusedNodeNext" @first-focused-node-prev="firstFocusedNodePrev">
      <v-form-line :cols="[{ path: '/label1', label: 'label1' },{ path: '/label2', label: 'label2' }]">
        <input autofocus />
        <input v-show="show2" />
      </v-form-line>
      <v-form-line :cols="[{ path: '/label3', label: 'label3' },{ path: '/label4', label: 'label4' }]" :span="12">
        <input v-model="label3" placeholder="label3 有值禁用 label4" />
        <input :disabled="!!label3" />
      </v-form-line>
      <v-form-line :cols="[{ path: '/label5', label: 'label5' },{ path: '/label6', label: 'label6' }]" :span="12">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label7" :cols="[{ path: '/label7' },{ path: '/label8' }]">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label8" :cols="[{ path: '/label9' },{ path: '/label10' }]" :span="12">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label9" :cols="[{ path: '/label11' },{ path: '/label12' }]" :span="12">
        <input />
        <input disabled />
      </v-form-line>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'VHeader',
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