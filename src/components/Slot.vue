<script>
export default {
  name: "VSlot",
  props: {
    message: [Array, Object, String]
  },
  render(h) {
    return h("div", {class: 'v-popover-content'}, [this.message]);
  }
};
</script>
