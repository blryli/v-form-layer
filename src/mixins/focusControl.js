import { getDomClientRect } from 'utils/dom'

var defaultFocusOptions = {
    prevKeys: 'shift+enter',
    nextKeys: 'enter',
    skips: ['/node2'],
    loop: false
  }

export default {
  data() {
    return {
      inputs: []
    }
  },
  created () {
    this.$on('listener-input-event', (path, e) => {
      console.log(e)
      this.handleInputEvent(path, e)
    })
  },
  computed: {
    focusCtrl() {
      return { ...defaultFocusOptions, ...this.focusOptions }
    },
    revInputs() {
      return [...this.inputs].reverse()
    }
  },
  methods: {
    handleInputEvent(path, e) {
      e.preventDefault()
      const prevKeyInKeys = this.keyInKeys(this.focusCtrl.prevKeys.split('+'), e)
      const nextKeyInKeys = this.keyInKeys(this.focusCtrl.nextKeys.split('+'), e)
      // 上一个
      prevKeyInKeys && !nextKeyInKeys && this._prevFocus(path)
      // 下一个
      nextKeyInKeys && !prevKeyInKeys && this._nextFocus(path)
    },
    keyInKeys(keys, e) {
      return (keys.length === 1 && !e['shiftKey'] && !e['ctrlKey'] && !e['altKey'] && keys[0].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 2 && e[keys[0].toLowerCase()+'Key'] && keys[1].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 3 && e[keys[0].toLowerCase()+'Key'] && e[keys[1].toLowerCase()+'Key'] && keys[2].toLowerCase() === e.key.toLowerCase())
    },
    _prevFocus(path) {
      this.nextPathFocus(path, this.revInputs)
    },
    _nextFocus(path) {
      this.nextPathFocus(path, this.inputs)
    },
    nextPathFocus(curPath, inputs) {
      let index = inputs.findIndex(d => d.path === curPath)
      if (index === -1) return
      let nextInput;
      let len = inputs.length
      // 如果下一个节点是最后一个
      if (index === inputs.length - 1) {
        if (this.focusCtrl.loop) {
          nextInput = inputs[0].input
        } else return
      }
      for (let i = index + 1; i < len; i++) {
        const {input, path} = inputs[i]
        // 如果下一个节点 input 存在，并且 disabled 不为 true
        if(getDomClientRect(input).width && getDomClientRect(input).height && !input.disabled && !this.focusCtrl.skips.find(p => p === path)) {
          nextInput = input
          break
        }
      }

      setTimeout(() => {
        nextInput.focus()
      }, 0);
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