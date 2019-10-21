<template>
  <div>
    <h3>表单布局</h3>
    <v-form>
      <v-form-line :cols="[{ label: 'label1', path: '1' },{ label: 'label2', path: '2' }]">
        <div class="aaaa">
          <div class="bbbb">
            <el-input v-model="form.a" />
          </div>
        </div>
        <el-select
          v-model="value"
          ref="select"
          placeholder="请选择"
          automatic-dropdown
          style="width: 100%;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </v-form-line>
      <v-form-line :cols="[{ label: 'label3', path: '3' },{ label: 'label4', path: '4' }]" :span="12">
        <el-input v-model="form.b" />
      </v-form-line>
      <v-form-line :cols="[{ label: 'label5' },{ label: 'label6' }]" :span="12">
        <el-time-picker
          is-range
          v-model="value1"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
        <el-input v-model="form.c" />
      </v-form-line>
      <v-form-line label="label7">
        <el-input v-model="form.d" />
        <el-input v-model="form.j" />
      </v-form-line>
      <v-form-line label="label7" :span="12">
        <code-select
          ref="otherMark"
          v-model="form.e"
          type="DEC_FEE_MARK"
        />
        <!-- <el-input v-model="form.e" /> -->
        <variation-select
          ref="promise1"
          :disabled="Boolean(form.e)"
          v-model="form.f"
          :options="promiseOptions"
        />
      </v-form-line>
      <v-form-line
        :cols="[{span: 8,path:'/feeMark'},{span: 8,path:'/feeRate'},{span: 8,path:'/feeCurr'}]"
        :span="6"
        label="运费"
      >
        <code-select
          v-model="header.feeMark"
          type="DEC_FEE_MARK"
        />
        <el-input
          v-model="header.feeRate"
        />
        <code-select
          ref="feeCurr"
          v-model="header.feeCurr"
          :disabled="Boolean(header.feeMark)"
          type="CUS_MAPPING_CURRENCY_CODE_V"
          dep-gb="gb"
        />
      </v-form-line>
      <v-form-line
        :cols="[{span: 6, label: '贸易国别(地区)',path:'/cusTradeNationCode'},{span: 6, label: '启运国(地区)  ',path:'/cusTradeCountry'},{span: 6, label: '经停港',path:'/despPortCode'},1?{span: 6, label: '启运港',path:'/despPortCode1'}:{}]"
      >
        <code-select
          v-model="header.cusTradeNationCode"
          type="CUS_MAPPING_COUNTRY_CODE_V"
          dep-gb="gb"
        />
        <code-select
          v-model="header.cusTradeCountry"
          type="CUS_MAPPING_COUNTRY_CODE_V"
          dep-gb="gb"
        />
        <code-select
          v-model="header.arrivPortCode"
          type="CUS_MAPPING_PORT_CODE_V"
          dep-gb="gb"
        />
        <code-select
          v-model="header.despPortCode"
          type="CUS_MAPPING_PORT_CODE_V"
          dep-gb="gb"
        />
      </v-form-line>
      <v-form-line label="label7" :span="12">
        <el-input v-model="form.g" />
        <el-input v-model="form.h" />
      </v-form-line>
    </v-form>
    <!-- <iframe src="https://jsfiddle.net/blryli/ntc6bwk4/embedded/result,html,js,css/" style="width: 100%; height: 400px"></iframe> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: {},
      form: {},
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      promiseOptions: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
        { label: '空', value: '9' }
      ]
    };
  },
  methods: {
    focus(e) {
      // console.log('focus', e)
      // console.log(this.$refs.select)
    }
  }
};
</script>
