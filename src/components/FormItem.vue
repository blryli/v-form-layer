<template>
  <div class="v-form-item" :class="{'is-required': required}" :style="{marginBottom: rowledge, '--lineHeight': lineHeight}">
    <label v-if="label" class="v-form-item__label" :style="{flex: `0 0 ${labelWidth}`}">{{ label }}</label>
    <div ref="formItemContent" class="v-form-item__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    required: Boolean
  },
  data() {
    return {}
  },
  inject: ['form'],
  computed: {
    lineHeight() {
      return this.form.lineHeight
    },
    // 行距
    rowledge() {
      return this.form.rowledge
    }
  }
}
</script>

<style scoped>
.v-form-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.v-form-item:before {
  display: table;
  content: "";
}

.v-form-item:after {
  display: table;
  content: "";
  clear: both;
}

.v-form-item .vue-popover-trigger {
  position: relative;
}

.v-form-item.is-required>.v-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.v-form-item__label {
  text-align: right;
  font-size: 14px;
  color: #606266;
  padding-right: 12px;
  height: var(--lineHeight);
  line-height: var(--lineHeight);
  box-sizing: border-box;
}

.v-form-item__content {
  width: 100%;
  position: relative;
  line-height: var(--lineHeight);
  font-size: 14px;
}

.v-form-item__content::before,
.v-form-item__content::after {
  display: table;
  content: "";
}

.v-form-item__content:after {
  clear: both;
}

.v-form--label-left .v-form-item__label {
  text-align: left;
}

.v-form--label-right .v-form-item__label {
  text-align: right;
}

.v-form--label-top .v-form-item {
  display: block;
}

.v-form--label-top .v-form-item__label {
  text-align: left;
  padding-right: 0;
  padding-bottom: 10px;
}
</style>

