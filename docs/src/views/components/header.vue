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
      <v-form-line
        :cols="[{span: 8,path:'/otherMark'},{span: 8,path:'/otherRate'},{span: 8,path:'/otherCurr'}]"
        :span="6"
        label="杂费"
      >
        <code-select
          v-model="header.otherMark"
          type="DEC_OTHER_MARK"
        />
        <el-input
          v-model="header.otherRate"
        />
        <code-select
          v-model="header.otherCurr"
          type="CUS_MAPPING_CURRENCY_CODE_V"
        />
      </v-form-line>
      <v-form-line
        :cols="[{span: 6, label:'申报地海关', path: '/customMaster',required: '#faffbd'},{span: 6, label:'出入境关别', path: '/iEPort',required: '#faffbd'},{ span: 6, path:'/ciqEntyPortCode',label:'离境口岸',required: '#faffbd'},{ span: 6, path:'/billType',label:header.billType?'清单类型':''}]"
      >
        <code-select
          v-model="header.customMaster"
          type="CUS_CUSTOMS"
        />
        <code-select
          v-model="header.iEPort"
          type="CUS_CUSTOMS"
        />
        <code-select
          v-model="header.ciqEntyPortCode"
          type="CIQ_PORT_CN"
        />
        <code-select
          v-model="header.billType"
          type="DEC_BILL_TYPE"
        />
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
        label3: '',
        header: {}
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