<script>
import VPopover from "./Popover";
import VText from "./Text";
export default {
  name: 'VLayerItem',
  props: {
    layerItem: {
      type: Object,
      default: () => { }
    },
    placementObj: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    VPopover,
    VText
  },
  inject: ['layer'],
  data() {
    return {

    }
  },
  render(h) {
    let layer = {}
    let referenceId = this.layer.path; // 参考点id
    const { template, placement, type, effect, show } = this.layerItem
    let { message, disabled } = this.layerItem
    message = typeof template === "function" ? template(message, referenceId) : message; // 展示内容
    if (!type || type === "popover") {
      disabled = disabled === true || show === false ? 1 : 0; // 是否禁用
      let placementId = `${this.path}/${placement}/${this.placementObj[
        placement
      ].length + 1}`;
      this.placementObj[placement].push({
        id: placementId,
        disabled: disabled
      });
      console.log(JSON.stringify(this.placementObj, null, 2))

      // 图层懒加载
      if (this.layerItem.showAlways || this.layer.loadLayer) {
        const { trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay } = this.layerItem
        layer = h("v-popover", {
          attrs: {
            referenceId, message, placement, disabled, effect,
            trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay
          }
        })
      }

    } else if (type === "text") {
      layer = h("v-text", {
        attrs: { referenceId, message, placement, disabled, effect }
      })
    } else {
    }
    if (!layer.tag) layer = ''
    return layer
  }
}
</script>
