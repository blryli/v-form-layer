<script>
export default {
  name: "VSlot",
  props: {
    message: [Array, Object, String]
  },
  render(h) {
    return h("div", {}, [this.message]);
  }
};
</script>
