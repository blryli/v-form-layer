import {getDomClientRect} from 'utils/dom'
export default {
  data() {
    return {
      inputs: []
    }
  },
  created () {
    this.$on('listener-enter-event', (path) => {
      this.handleEnterEvent(path)
    })
  },
  methods: {
    handleEnterEvent(path) {
      let index = this.inputs.findIndex(d => d.path === path)
      if (index === -1) return
      let nextInput;
      let len = this.inputs.length
      // 如果下一个节点是最后一个
      if (index === this.inputs.length - 1) {

        if (this.loop) {
          nextInput = this.inputs[0].input
        } else return
      }
      for (let i = index + 1; i < len; i++) {
        const input = this.inputs[i].input
        // 如果下一个节点 input 存在，并且 disabled 不为 true
        if(getDomClientRect(input).width && !input.disabled) {
          console.log(this.inputs[i].path)
          nextInput = input
          break
        }
      }

      setTimeout(() => {
        nextInput.focus()
      }, 100);
    },
    focus(path) {
      this.getInput(path).focus()
    },
    blur(path) {
      this.getInput(path).blur()
    },
    select(path) {
      this.getInput(path).select()
    },
    getInput(path) {
      let index = path ? this.inputs.findIndex(d => d.path === path) : 0
      if (index === -1) return
      return this.inputs[index].input
    }
  }
}