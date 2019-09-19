export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateField(path, rule, data = this.data) {
      if (!data) console.error('使用校验时，必须传入源数据 data')
      const value = this.getPathValue(data, path)
      const validator = { path, ...rule(value, path) }
      const { message, stop } = validator
      const index = this.validators.findIndex(d => d.path === path)
      index === -1 ? this.validators.push(validator) : this.validators.splice(index, 1, validator)
      this.$emit('validate', { path, success: !message, message, stop })
    },
    validate(cb) {
      if (typeof cb !== 'function') {
        console.error('validate参数必须是函数')
        return
      }
      this.$emit('form.line.validate')
      const validators = this.validators.map(d => {
        const {path, message, stop} = d
        return {path, success: !message, message, stop}
      })
      cb(!validators.find(rule => rule.stop && rule.message), validators)
    },
    clearValidate(paths) {
      if (!paths) {
        this.validators = []
      } else if (Array.isArray(paths)) {
        paths.forEach(path => {
          const index = this.validators.findIndex(d => d.path === path)
          this.validators.splice(index, 1)
        })
      } else console.error('clearValidate参数必须是数组')
    },
    getPathValue(data, path) {
      return path.split('/').filter(d => d).reduce((acc, cur) => acc[cur], data)
    }
  }
}
