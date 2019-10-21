import { getOneChildComponent } from 'utils/dom'

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
      curPath: null
    }
  },
  created () {
    if(this.focusOpen) {
      this.$on('line-slot-change', (obj) => {
        const lineSlots = [...this.lineSlots]
        const index = lineSlots.findIndex(d => d.path === obj.path);
        index === -1 ? lineSlots.push(obj) : lineSlots.splice(index, 1, obj);
        this.lineSlots = Object.freeze(lineSlots)
      })
      this.$on('listener-focus', (path) => {
        setTimeout(() => {
          this.curPath = path
        }, 50);
      })
      this.$on('listener-blur', (path) => {
      })
      window.addEventListener('keyup', (e) => {
        this.curPath && this.lineSlotEvent(this.curPath, e)
      })
      window.addEventListener('click', (e) => {
        !this.lineSlots.find(d => d.slot.$el.contains(e.target)) && (this.curPath = null)
      })
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
    lineSlotEvent(curPath, e) {
      e.preventDefault()
      const prevKeyInKeys = this.keyInKeys(this.focusCtrl.prevKeys.split('+'), e)
      const nextKeyInKeys = this.keyInKeys(this.focusCtrl.nextKeys.split('+'), e)
      // 上一个
      prevKeyInKeys && !nextKeyInKeys && this._prevFocus(curPath)
      // 下一个
      nextKeyInKeys && !prevKeyInKeys && this._nextFocus(curPath)
    },
    keyInKeys(keys, e) {
      return (keys.length === 1 && !e['shiftKey'] && !e['ctrlKey'] && !e['altKey'] && keys[0].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 2 && e[keys[0].toLowerCase()+'Key'] && keys[1].toLowerCase() === e.key.toLowerCase()) || 
      (keys.length === 3 && e[keys[0].toLowerCase()+'Key'] && e[keys[1].toLowerCase()+'Key'] && keys[2].toLowerCase() === e.key.toLowerCase())
    },
    _prevFocus(curPath) {
      this.nextNodeFocus(curPath, this.revLineSlots)
    },
    _nextFocus(curPath) {
      this.nextNodeFocus(curPath, this.lineSlots)
    },
    nextNodeFocus(curPath, lineSlots) {
      let index = lineSlots.findIndex(d => d.path === curPath) || 0
      if(index === -1) return
      let nextIndex;
      let len = lineSlots.length
      // 如果下一个节点是最后一个
      if (index === len - 1) {
        if (this.focusCtrl.loop) {
          nextIndex = lineSlots.findIndex(slot => this._isCanFocus(slot))
        } else return
      }
      for (let i = index + 1; i < len; i++) {
        const slot = lineSlots[i]
        if(this._isCanFocus(slot)) {
          nextIndex = i
          break
        }
      }

      // 如果剩下的节点为不可操作的节点
      !nextIndex && (nextIndex = this.focusCtrl.loop ? lineSlots.findIndex(slot => this._isCanFocus(slot)) : nextIndex = index);

      const curConponent = getOneChildComponent(lineSlots[index].slot)
      nextIndex !== index && curConponent && curConponent.blur && curConponent.blur()

      const focusNode = this.getFocusNode(nextIndex, lineSlots)

      try {
        focusNode && focusNode.focus && focusNode.focus()
      } catch (error) {
        console.error(error)
      }
    },
    getFocusNode(index, lineSlots = this.lineSlots) {
      const nextSlot = lineSlots[index]
      const nextComponent = getOneChildComponent(nextSlot.slot)
      return nextSlot && (nextComponent || nextSlot.input);
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus(lineSlot) {
      const {path, slot, input} = lineSlot
      const component = getOneChildComponent(slot)
      return (!path || path && !this.focusCtrl.skips.find(p => p === path)) && (component && !component.disabled || !component && input && !input.disabled)
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
      if(path && !this.lineSlots.find(d => d.slot.path === path)) {
        console.error(`focus方法传入的path [${path}] 没有定义`)
      }
      let index = path ? this.lineSlots.findIndex(d => d.path === path) : this.lineSlots.findIndex(d => this._isCanFocus(d))
      if (index === -1) return
      return this.getFocusNode(index)
    }
  }
}