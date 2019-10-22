

<script>
import VPopover from "./Popover";
import VText from "./Text";
import VTriangle from "./Triangle";
export default {
  name: 'VLayer',
  props: {
    path: String,
    layer: {
      type: Array,
      default: () => [],
    }
  },
  components: {
    VPopover,
    VText,
    VTriangle
  },
  provide() {
    return {
      layer: this
    }
  },
  data() {
    return {
      betraye: {
        left: [],
        right: [],
        top: [],
        bottom: []
      },
      loadLayer: false
    }
  },
  render(h) {
    let placementObj = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
    let layers = []
    let layerClassStr = 'v-layer'
    this.layer.forEach(layerItem => {
      let layer = {}
      let referenceId = this.path; // 参考点id
      const { template, type, show } = layerItem
      const effect = layerItem.effect && layerItem.effect.toLowerCase() || null
      let { placement, message, disabled, referenceBorderColor, layerClass = '' } = layerItem
      referenceBorderColor && (layerClassStr += ' is-validator')
      layerClass && (layerClassStr += ' ' + layerClass)
      message = typeof template === "function" ? template(message, referenceId) : message; // 展示内容
      if (!type || type === "popover") {
        !placement && (placement = 'top')
        disabled = disabled === true || show === false ? 1 : 0; // 是否禁用
        let placementId = `${this.path}/${placement}/${placementObj[placement].length + 1}`;
        placementObj[placement].push({
          id: placementId,
          disabled: disabled
        });

        // 图层懒加载
        if (layerItem.showAlways || this.loadLayer) {
          const { trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay } = layerItem
          layer = h("v-popover", {
            attrs: {
              referenceId, placementId, message, placement, disabled, effect,
              trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay,
              path: this.path,
              betraye: this.betraye,
              placementObj: placementObj
            },
            on: {
              addBetrayer: this.addBetrayer,
              removeBetrayer: this.removeBetrayer
            }
          })
          layers.push(layer)
        }

      } else if (type === "text") {
        layer = h("v-text", {
          attrs: { referenceId, message, placement, disabled, effect }
        })
        layers.push(layer)
      } else if (type === "triangle") {
        layer = h("v-triangle", {
          attrs: { referenceId, placement, disabled, effect, message }
        })
        layers.push(layer)
      }
    })
    return h(
      "div",
      {
        on: {
          mouseenter: this.handleLoadLayer
        },
        class: layerClassStr
      },
      [this.$slots.default[0], layers]
    )
  },
  methods: {
    // 计算叛逆列表
    addBetrayer(betrayer) {
      betrayer.id &&
        !this.betraye[betrayer.placement].find(d => d === betrayer.id) &&
        this.betraye[betrayer.placement].push(betrayer.id);
    },
    removeBetrayer(betrayer) {
      const index = this.betraye[betrayer.placement].findIndex(
        d => d === betrayer.id
      );
      index !== -1 && this.betraye[betrayer.placement].splice(index, 1);
    },
    // 加载图层
    handleLoadLayer() {
      if (!this.loadLayer) {
        this.loadLayer = true;
      }
    },
  }
}
</script>

<style scoped>
.v-layer{
  position: relative;
}
</style>
