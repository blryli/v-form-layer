<template>
  <transition name="fade">
    <div :id="placementId" class="v-popover" :class="pClass" :style="popoverStyle" @mouseenter="mouseenterWrap" @mouseleave="mouseleaveWrap">
      <div class="v-popover__arrow" v-if="visibleArrow"></div>
      <v-slot :message="message"></v-slot>
    </div>
  </transition>
</template>

<script>
import VSlot from '../Slot'
import { scroll, debounce } from "utils";
import {
  on,
  off,
  removeBody,
  getParentNodes,
  enableEventListener,
  removeEventListener,
  getDomClientRect,
  getChildNodes
} from "utils/dom";
import Mixin from "./mixin";

export default {
  name: "VPopover",
  mixins: [Mixin],
  components: {VSlot},
  props: {
    referenceId: String,
    // 需要监听的事件
    trigger: { type: String, default: "hover" },
    effect: { type: String, default: "dark" },
    borderColor: String,
    // popover消息提示
    message: [ String, Object, Array ],
    disabled: [ Boolean, Number ],
    placement: { type: String, default: "top" },
    placementId: String,
    betraye: Object, // 叛逆者对象
    placementObj: Object, // popover 各个方向成员
    visibleArrow: { type: Boolean, default: true },
    showAlways: Boolean,
    positions: { type: Array, default: () => [] },
    enterable: Boolean,
    popoverClass: String,
    hideDelay: { type: Number, default: 200 },
    path: String
  },
  data() {
    return {
      reference: null,
      show: false,
      addedBody: false,
      timeoutPending: null,
      momentPlacement: this.placement,
      parentNodes: []
    };
  },
  inject: ['form'],
  watch: {
    showAlways(val) {
      val && setTimeout(this.calculateCoordinate, 0);
    },
    show(val) {
      if (val) {
        this.form.$emit("show", this.path)
        this.popoverAddedBody();
        this.calculateCoordinate();
      } else {
        this.form.$emit("hide", this.path)
      }
    },
    // 叛逆者管理
    momentPlacement(val) {
      val === this.placement
        ? this.$emit("removeBetrayer", {
            id: this.placementId,
            placement: this.placement
          })
        : this.$emit("addBetrayer", {
            id: this.placementId,
            placement: this.placement
          });
    }
  },
  computed: {
    // 对应方向是否有多个图层
    isMorePlacement() {
      let isMorePlacement = false;
      if (['top', 'bottom'].find(d => d === this.placement)) {
        this.placementObj['top'].length + this.placementObj['bottom'].length >= 2 && (isMorePlacement = true)
      }
      if (['left', 'right'].find(d => d === this.placement)) {
        return this.placementObj['left'].length + this.placementObj['right'].length >= 2 && (isMorePlacement = true)
      }
      return isMorePlacement
    },
    isVisible() {
      return (this.showAlways || this.show) && !this.disabled;
    },
    pClass() {
      return `${this.effect ? `is-${this.effect}` : "is-light"}  v-popover__${
        this.momentPlacement
      } ${this.popoverClass || ""} ${
        this.isVisible ? "v-popover--visible" : "v-popover--hidden"
      }`;
    },
    popoverStyle() {
      let style = {
        "--borderColor": "#ccc",
        "--bgColor": "#fff"
      };
      if (typeof this.effect === "string") {
        switch (this.effect) {
          case "light":
            style["--borderColor"] = "#ccc";
            style["--bgColor"] = "#fff";
            break;
          case "dark":
            style["--borderColor"] = "#303133";
            style["--bgColor"] = "#303133";
            style["--color"] = "#fff";
            break;
          case "warn":
            style["--borderColor"] = "#e6a23c";
            style["--bgColor"] = "#e6a23c";
            style["--color"] = "#fff";
            break;
          case "error":
            style["--borderColor"] = "#f56c6c";
            style["--bgColor"] = "#f56c6c";
            style["--color"] = "#fff";
            break;
          default:
            style["--borderColor"] = this.borderColor || this.effect;
            style["--bgColor"] = this.effect;
            style["--color"] = "#fff";
            break;
        }
      }
      return style;
    }
  },
  methods: {
    popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$el);
        this.addedBody = true;
      }
    },
    triggerClick(e) {
      const popover = this.$el;
      const trigger = this.reference;
      if (!popover || !trigger || !e.target) return;
      if (trigger.contains(e.target)) {
        !this.disabled && (this.show = !this.show);
      } else if (popover.contains(e.target)) {
        return;
      } else {
        this.show = false;
      }
    },
    doShow() {
      if (!this.disabled && this.trigger !== "click") {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending);
          this.show = true;
        } else {
          this.show = true;
        }
      }
    },
    doHide() {
      if (!this.disabled && this.trigger !== "click") {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, this.hideDelay);
      }
    },
    mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending);
    },
    mouseleaveWrap() {
      if (this.enterable && this.trigger !== "click") {
        this.timeoutPending = setTimeout(() => {
          this.show = false;
        }, 200);
      }
    },
    scrollChange() {
      if (this.isVisible) {
        this.calculateCoordinate() // 可见的popover实时计算位置
      } else {
        this.isMorePlacement && debounce(this.calculateCoordinate)() // 不可见的popover,如果是多图层，位置计算开启节流
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const referenceId = document.getElementById(this.referenceId);
      if (!referenceId) return;

      const childNodes = getChildNodes(referenceId);
      if (childNodes.length >= 1) {
        this.reference = childNodes[0];
      } else {
        this.reference = referenceId;
      }

      this.parentNodes = getParentNodes(this.reference);
      enableEventListener(this.parentNodes, this.scrollChange);
      this.calculateCoordinate();

      if (this.trigger === "hover") {
        on(this.reference, "mouseenter", this.doShow);
        on(this.reference, "mouseleave", this.doHide);
      } else if (this.trigger === "focus") {
        on(this.reference, "focus", this.doShow);
        on(this.reference, "blur", this.doHide);
      } else {
        on(window, "click", this.triggerClick);
      }
    });
  },
  beforeDestroy() {
    if (!this.reference || !this.reference.nodeName) return;
    removeEventListener(this.parentNodes, this.scrollChange);

    if (this.trigger === "hover") {
      off(this.reference, "mouseenter", this.doShow);
      off(this.reference, "mouseleave", this.doHide);
    } else if (this.trigger === "focus") {
      off(this.reference, "focus", this.doShow);
      off(this.reference, "blur", this.doHide);
    } else {
      off(window, "click", this.triggerClick);
    }
    this.addedBody && document.body.removeChild(this.$el);
  }
};
</script>

<style scoped>
.v-popover {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: fixed;
  z-index: 3000;
  padding: 10px;
  line-height: 1.2;
  font-size: 14px;
  min-width: 10px;
  border-radius: 4px;
  border: 1px solid;
  background-color: var(--bgColor);
  border-color: var(--borderColor);
  color: var(--color);
}

.v-popover--visible {
  visibility: visible;
  opacity: 1;
}

.v-popover--hidden {
  visibility: hidden;
  opacity: 0;
}

.v-popover__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.v-popover__arrow:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

.v-popover__top .v-popover__arrow {
  border-top-color: var(--borderColor);
  margin-left: -6px;
  left: 50%;
  top: 100%;
}

.v-popover__top .v-popover__arrow:after {
  top: -6px;
  margin-left: -5px;
  border-top: 5px solid var(--bgColor);
}

.v-popover__right .v-popover__arrow {
  border-right-color: var(--borderColor);
  margin-top: -6px;
  left: -12px;
  top: 50%;
}

.v-popover__right .v-popover__arrow:after {
  left: -3px;
  margin-top: -5px;
  border-right: 5px solid var(--bgColor);
}

.v-popover__bottom .v-popover__arrow {
  border-bottom-color: var(--borderColor);
  margin-left: -6px;
  top: -12px;
  left: 50%;
}

.v-popover__bottom .v-popover__arrow:after {
  top: -3px;
  margin-left: -5px;
  border-bottom: 5px solid var(--bgColor);
}

.v-popover__left .v-popover__arrow {
  border-left-color: var(--borderColor);
  margin-top: -6px;
  left: 100%;
  top: 50%;
}

.v-popover__left .v-popover__arrow:after {
  right: -3px;
  margin-top: -5px;
  border-left: 5px solid var(--bgColor);
}
</style>

