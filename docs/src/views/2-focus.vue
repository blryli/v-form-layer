<template>
  <div class="enter">
    <h2>header</h2>
    <v-header />
    <h2>body</h2>
    <v-body ref="body" />
  </div>
</template>

<script>
import { VHeader, VBody } from './components'
export default {
  components: { VHeader, VBody },
  data() {
    return {}
  },
  provide() {
    return {
      root: this
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
