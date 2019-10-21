<script>
export default {
  name: 'VFormLineSlotContent',
  props: {
    vNode: {
      type: Object,
      default: () => {}
    }
  },
  render(h) {
    return this.vNode
  }
}
</script>

 