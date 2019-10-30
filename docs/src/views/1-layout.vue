<template>
  <div>
    <h3>表单布局</h3>
    <v-form label-width="120px" :itemGutter="10">
      <v-form-line :cols="[{ label: '2列并排布局2列并排布局2列并排布局2列并排布局' },{ label: '2列并排布局' }]">
        <input />
        <input />
      </v-form-line>
      <v-form-line :cols="[{label: '3列并排布局' },{ label: '3列并排布局' },{ label: '3列并排布局' }]">
        <input />
        <input />
        <input />
      </v-form-line>
      <v-form-line
        :cols="[{ label: '4列并排布局' },{ label: '4列并排布局' },{label: '4列并排布局' },{ label: '4列并排布局' }]"
      >
        <input />
        <input />
        <input />
        <input />
      </v-form-line>
      <v-form-line label="2列并列布局">
        <input />
        <input />
      </v-form-line>
      <v-form-line label="多段并列布局" :span="12">
        <input />
        <input />
        <input />
      </v-form-line>
      <v-form-line label="多段并列布局" :span="12">
        <input />
        <input />
        <input />
      </v-form-line>
    </v-form>
    <!-- <iframe src="/static/response-demo.html" width="320px" height="640px" frameborder="0"></iframe> -->
    <!-- <iframe src="https://jsfiddle.net/blryli/ntc6bwk4/embedded/result,html,js,css/" style="width: 100%; height: 400px"></iframe> -->
  </div>
</template>


