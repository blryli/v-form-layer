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
      focusLines: [],
      focuslineSlots: Object.freeze([]),
      curFocusNode: null,
      curBlurNode: null,
    }
  },
  created () {
    if(this.focusOpen) {
      this.$on('line-slot-change', (obj) => {
        const focuslineSlots = [...this.focuslineSlots]
        const index = focuslineSlots.findIndex(d => d.slotPath === obj.slotPath);
        index === -1 ? focuslineSlots.push(obj) : focuslineSlots.splice(index, 1, obj);
        this.focuslineSlots = Object.freeze(focuslineSlots)
      })
      this.$on('listener-focus', (lineSlot) => {
        this.curFocusNode = lineSlot
      })
      this.$on('listener-blur', (lineSlot) => {
      })
      window.addEventListener('keyup', (e) => {
        this.curFocusNode && this.lineSlotEvent(this.curFocusNode, e)
      })
      window.addEventListener('click', (e) => {
        !this.focuslineSlots.find(d => d.lineSlot.$el.contains(e.target)) && (this.curFocusNode = null)
      })
    }
  },
  computed: {
    focusCtrl() {
      return { ...defaultFocusOptions, ...this.focusOptions }
    },
    revfocusLineSlots() {
      return [...this.focuslineSlots].reverse()
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
      this.nextNodeFocus(lineSlot, this.revfocusLineSlots)
    },
    _nextFocus(lineSlot) {
      this.nextNodeFocus(lineSlot, this.focuslineSlots)
    },
    nextNodeFocus(curSlotPath, focuslineSlots) {
      let index = focuslineSlots.findIndex(d => d.slotPath === curSlotPath)
      if(index === -1) return
      let curSlot = focuslineSlots[index]
      let nextSlot;
      let len = focuslineSlots.length
      // 如果下一个节点是最后一个
      if (index === len - 1) {
        if (this.focusCtrl.loop) {
          nextSlot = focuslineSlots.find(slot => this._isCanFocus(slot))
        } else return
      }
      for (let i = index + 1; i < len; i++) {
        const slot = focuslineSlots[i]
        console.log('下一个节点', slot)
        if(this._isCanFocus(slot)) {
          nextSlot = slot
          break
        }
      }
      // 如果剩下的节点为不可操作的节点
      !nextSlot && (nextSlot = this.focusCtrl.loop ? focuslineSlots.find(slot => this._isCanFocus(slot)) : nextSlot.slotPath = curSlotPath);

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
      if(path && !this.focuslineSlots.find(d => d.lineSlot.path === path)) {
        console.error(`focus方法传入的path [${path}] 没有定义`)
      }
      let index = path ? this.focuslineSlots.findIndex(d => d.lineSlot.path === path) : this.focuslineSlots.findIndex(d => this._isCanFocus(d))
      if (index === -1) return
      return this.focuslineSlots[index].input
    }
  }
}