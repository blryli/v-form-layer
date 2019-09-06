<template>
  <v-slot class="v-text" :class="'v-text__'+placement" v-show="!disabled" :style="{color: effect}" :message="message"></v-slot>
</template>

<script>
import VSlot from './Slot'
export default {
  name: "VText",
  components: {VSlot},
  props: {
    referenceId: String,
    message: [String, Object, Array],
    disabled: Boolean,
    effect: String,
    placement: {
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      reference: null
    };
  },
  methods: {
    calculateCoordinate() {
      if (!this.$el) return;
      switch (this.placement) {
        case "top":
          this.$el.style.top = -this.$el.offsetHeight - 3 + "px";
          break;
        case "right":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = this.reference.offsetWidth + 3 + "px";
          break;
        case "bottom":
          break;
        case "left":
          this.$el.style.width = this.$el.offsetWidth + "px";
          this.$el.style.left = -this.$el.offsetWidth - 3 + "px";
          break;
        default:
          console.error("placement 必须是 top/right/bottom/left");
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = document.getElementById(this.referenceId);
      this.calculateCoordinate();
    });
  }
};
</script>

<style scoped>
.v-text {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 1.2;
  color: #666;
  font-size: 12px;
}

.v-text.v-text__bottom {
  top: 100%;
  left: 0;
  padding-top: 4px;
}

.v-text.v-text__right,
.v-text.v-text__left {
  top: 50%;
  transform: translate(0, -50%);
}
</style>

