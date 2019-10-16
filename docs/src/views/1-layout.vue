<template>
  <div>
    <h3>表单布局</h3>
    <v-form>
      <v-form-line :cols="[{ label: 'label1', path: '1111' },{ label: 'label2' }]">
        <input />
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
      <v-form-line :cols="[{ label: 'label3' },{ label: 'label4' }]" :span="12">
        <input />
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
        <input />
      </v-form-line>
      <v-form-line label="label7">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label7" :span="12">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="label7" :span="12">
        <input />
        <input />
      </v-form-line>
    </v-form>
    <!-- <iframe src="https://jsfiddle.net/blryli/ntc6bwk4/embedded/result,html,js,css/" style="width: 100%; height: 400px"></iframe> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      value: ""
    };
  }
};
</script>
