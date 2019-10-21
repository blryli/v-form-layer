import { getOneChildComponent, getAllChildComponent } from 'utils/dom'

var defaultFocusOptions = {
    prevKeys: 'shift+enter',
    nextKeys: 'enter',
    skips: [],
    loop: false
  }

export default {
  data() {
    return {
      lineSlots: Object.freeze([]),
      curFocusNode: null,
      curBlurNode: null,
    }
  },
  created () {
    if(this.focusOpen) {
      this.$on('listener-focus', (lineSlot) => {
        this.curFocusNode = lineSlot
      })
      this.$on('listener-blur', (lineSlot) => {
      })
      window.addEventListener('keyup', (e) => {
        this.curFocusNode && this.lineSlotEvent(this.curFocusNode, e)
      })
      window.addEventListener('click', (e) => {
        !this.lineSlots.find(d => d.lineSlot.$el.contains(e.target)) && (this.curFocusNode = null)
      })
      this.getLineSlots()
    }
  },
  computed: {
    focusCtrl() {
      return { ...defaultFocusOptions, ...this.focusOptions }
    },
    revLineSlots() {
      return [...this.lineSlots].reverse()
    }
  },
  methods: {
    lineSlotEvent(lineSlot, e) {
      e.preventDefault()
      const prevKeyInKeys = this.keyInKeys(this.focusCtrl.prevKeys.split('+'), e)
      const nextKeyInKeys = this.keyInKeys(this.focusCtrl.nextKeys.split('+'), e)
      // 上一个
      prevKeyInKeys && !nextKeyInKeys && this._prevFocus(lineSlot)
      // 下一个
      nextKeyInKeys && !prevKeyInKeys && this._nextFocus(lineSlot)
    },
    keyInKeys(keys, e) {
      return (keys.length === 1 && !e['shiftKey'] && !e['ctrlKey'] && !e['altKey'] && keys[0].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 2 && e[keys[0].toLowerCase()+'Key'] && keys[1].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 3 && e[keys[0].toLowerCase()+'Key'] && e[keys[1].toLowerCase()+'Key'] && keys[2].toLowerCase() === e.key.toLowerCase())
    },
    _prevFocus(lineSlot) {
      this.nextNodeFocus(lineSlot, this.revLineSlots)
    },
    _nextFocus(lineSlot) {
      this.nextNodeFocus(lineSlot, this.lineSlots)
    },
    nextNodeFocus(curSlotPath, lineSlots) {
      let index = lineSlots.findIndex(d => d.slotPath === curSlotPath)
      if(index === -1) return
      let curSlot = lineSlots[index]
      let nextSlot;
      let len = lineSlots.length
      // 如果下一个节点是最后一个
      if (index === len - 1) {
        if (this.focusCtrl.loop) {
          nextSlot = lineSlots.find(slot => this._isCanFocus(slot))
        } else return
      }
      for (let i = index + 1; i < len; i++) {
        const slot = lineSlots[i]
        console.log('下一个节点', slot)
        if(this._isCanFocus(slot)) {
          nextSlot = slot
          break
        }
      }
      // 如果剩下的节点为不可操作的节点
      !nextSlot && (nextSlot = this.focusCtrl.loop ? lineSlots.find(slot => this._isCanFocus(slot)) : nextSlot.slotPath = curSlotPath);

      const curConponent = getOneChildComponent(curSlot.lineSlot)
      const nextComponent = getOneChildComponent(nextSlot.lineSlot)

      nextSlot.slotPath !== curSlotPath && curConponent && curConponent.blur && curConponent.blur()

      const focusNode = nextSlot && (nextComponent || nextSlot.input);
      try {
        focusNode && focusNode.focus && focusNode.focus()
      } catch (error) {
        console.error(error)
      }
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus(vFormLineSlot) {
      const {slotPath, lineSlot, input} = vFormLineSlot
      const component = getOneChildComponent(lineSlot)
      console.log(component)
      return (!slotPath || slotPath && !this.focusCtrl.skips.find(p => p === slotPath)) && (component && !component.disabled || !component && input && !input.disabled)
    },
    focus(path) {
      this.getInput(path).focus && this.getInput(path).focus()
    },
    blur(path) {
      this.getInput(path).blur && this.getInput(path).blur()
    },
    select(path) {
      this.getInput(path).select && this.getInput(path).select()
    },
    getInput(path) {
      if(path && !this.lineSlots.find(d => d.lineSlot.path === path)) {
        console.error(`focus方法传入的path [${path}] 没有定义`)
      }
      let index = path ? this.lineSlots.findIndex(d => d.lineSlot.path === path) : this.lineSlots.findIndex(d => this._isCanFocus(d))
      if (index === -1) return
      return this.lineSlots[index].input
    },
    // 获取 VFormLine 内所有可聚焦节点
    getLineSlots() {
      this.lineSlots = Object.freeze([])
      this.$nextTick(() => {
        setTimeout(() => {
          const nodes = this.$children.reduce((acc, cur) => {
            const VFormLine = getOneChildComponent(cur, child => child.$options.componentName && child.$options.componentName === 'VFormLine');
            return VFormLine ? acc.concat(getAllChildComponent(VFormLine, child => child.$options.componentName && child.$options.componentName === 'VFormLineSlot')) : acc
          }, []).map((lineSlot, index) => {
            // const component = getOneChildComponent(lineSlot);
            const slotPath = lineSlot.slotPath = lineSlot.path || index + 1
            return {slotPath, lineSlot, input: lineSlot.input}
            // if(component) {
              // 监听聚焦
              // this.$on.apply(component, ['focus', () => lineSlot.onFocus(component)])
              // this.$on.apply(component, ['blur', lineSlot.onBlur])
              // lineSlot.path && lineSlot.validator && this.$on.apply(component, [lineSlot.trigger, lineSlot.inputValidateField])
            // }
            // return (component || lineSlot.input) ? acc.concat([{lineSlot, component, input: lineSlot.input}]) : acc
          })
          this.lineSlots = Object.freeze(nodes)
          console.log(this.lineSlots);
        }, 0);
      })
    }
  }
}