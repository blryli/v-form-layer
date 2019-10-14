<template>
  <div>
    <h3>表单布局</h3>
    <v-form>
      <v-form-line :cols="[{ label: 'label1' },{ label: 'label2' }]">
        <input />
        <input />
      </v-form-line>
      <v-form-line :cols="[{ label: 'label3' },{ label: 'label4' }]" :span="12">
        <input />
        <input />
      </v-form-line>
      <v-form-line :cols="[{ label: 'label5' },{ label: 'label6' }]" :span="12">
        <input />
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
