import { getOneChildComponent, on, off } from 'utils/dom'

var defaultFocusOptions = {
  prevKeys: 'shift+enter',
  nextKeys: 'enter',
  skips: [],
  loop: false,
  stop: false
}

export default {
  data() {
    return {
      lineSlots: Object.freeze([]),
      curPath: null,
      direction: null
    }
  },
  created() {
    if (this.focusOpen) {
      this.$on('line-slot-change', this.lineSlotChange)
      this.$on('on-focus', this.onFocus)
      this.$on('on-blur', this.onBlur)

      on(window, 'keyup', this.keyup)
      on(window, 'click', this.click)
    }
  },
  computed: {
    focusCtrl() {
      return { ...defaultFocusOptions, ...this.focusOptions }
    },
    prevKeys() {
      if(!this.focusCtrl.prevKeys) return ''
      return this.focusCtrl.prevKeys.toLowerCase().split('+').sort().toString()
    },
    nextKeys() {
      if(!this.focusCtrl.prevKeys) return ''
      return this.focusCtrl.nextKeys.toLowerCase().split('+').sort().toString()
    },
    revLineSlots() {
      return [...this.lineSlots].reverse()
    },
    lineSlotsPath() {
      return this.lineSlots.map(d => d.path)
    }
  },
  methods: {
    lineSlotChange(obj) {
      const lineSlots = [...this.lineSlots]
      const index = lineSlots.findIndex(d => d.path === obj.path)
      index === -1 ? lineSlots.push(obj) : lineSlots.splice(index, 1, obj)
      this.lineSlots = Object.freeze(lineSlots)
      // console.log(JSON.stringify(this.lineSlots.map(d => d.path), null, 2))
    },
    onFocus(path) {
      setTimeout(() => {
        this.curPath = path
        this.$emit('focus', path)
      }, 50)
    },
    onBlur(path) {
      this.$emit('blur', path)
    },
    _clear() {
      this.curPath = null
    },
    click(e) {
      if (!this.curPath) return
      !this.lineSlots.find(d => d.slot.$el.contains(e.target)) && this._clear()
    },
    keyup(e) {
      if (!this.curPath || this.focusCtrl.stop || !e.key) return
      const key = e.key.toLowerCase()
      const keys = new Set()
      const keyArr = [{ key: 'alt', down: e['altKey'] }, { key: 'control', down: e['ctrlKey'] }, { key: 'shift', down: e['shiftKey'] }]
      keyArr.forEach(d => {
        d.down && keys.add(d.key.toLowerCase())
      })
      keys.add(key)
      const keysStr = Array.from(keys).sort().toString()
      keysStr === this.prevKeys && this.prevFocus(this.curPath) // 上一个
      keysStr === this.nextKeys && this.nextFocus(this.curPath) // 下一个
      
      // table上下键控制focus
      if (/\/\d\//.test(this.curPath)){
        const getPath = sign =>  this.curPath.replace(/\/(\d)\//, (match, p1) => `/${+p1 + sign}/`)
        const prevPath = getPath(-1)
        const nextPath = getPath(1)
        keysStr === 'arrowup' && this.lineSlotsPath.includes(prevPath) && this.focus(prevPath)
        keysStr === 'arrowdown' && this.lineSlotsPath.includes(nextPath) && this.focus(nextPath)
      }
      this.$emit('keyup', keysStr, this.curPath, e)
    },
    prevFocus(curPath) {
      this.direction = 'prev'
      this.nextNodeFocus(curPath, this.revLineSlots)
    },
    nextFocus(curPath) {
      this.direction = 'next'
      this.nextNodeFocus(curPath, this.lineSlots)
    },
    nextNodeFocus(curPath, lineSlots) {
      const index = lineSlots.findIndex(d => d.path === curPath) || 0
      if (index === -1) return
      let nextIndex
      const len = lineSlots.length
      const curConponent = getOneChildComponent(lineSlots[index].slot)

      const handleBlur = () => { // 处理失焦
        if (curConponent) {
          curConponent.blur && curConponent.blur()
          curConponent.handleClose && curConponent.handleClose()
        } else {
          const slotInput = lineSlots[index].input
          slotInput && slotInput.blur && slotInput.blur()
        }
      }

      for (let i = index + 1; i < len; i++) {
        const slot = lineSlots[i]
        if (this._isCanFocus(slot)) {
          nextIndex = i
          break
        }
      }

      // 如果下一个节点是最后一个或是剩下的节点存在，且都为不可操作的节点
      if (index === len - 1 || nextIndex === undefined) {
        if (this.focusCtrl.loop) {
          nextIndex = lineSlots.findIndex(slot => this._isCanFocus(slot))
        } else {
          const event = this.direction === 'prev' ? 'first-focused-node-prev' : 'last-focused-node-next'
          this.$emit(event, this.curPath)
          this._clear()
          handleBlur()
          return
        }
      }

      // 上一个节点失焦
      nextIndex !== index && handleBlur()

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
      return nextSlot && (nextComponent || nextSlot.input)
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus(lineSlot) {
      const { path, slot, input } = lineSlot
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
      if (path && !this.lineSlots.find(d => d.slot.path === path)) {
        console.error(`focus方法传入的path [${path}] 没有定义`)
      }
      const index = path ? this.lineSlots.findIndex(d => d.path === path) : this.lineSlots.findIndex(d => this._isCanFocus(d))
      if (index === -1) return
      return this.getFocusNode(index)
    }
  },
  beforeDestroy() {
    if (this.focusOpen) {
      this.$off('line-slot-change', this.lineSlotChange)
      this.$off('on-focus', this.onFocus)
      this.$off('on-blur', this.onBlur)

      off(window, 'keyup', this.keyup)
      off(window, 'click', this.click)
    }
  }
}
