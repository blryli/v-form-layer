import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'v-form-layer',
    file: 'dist/v-form-layer.esm.js',
    format: 'es'
  }
})

export default config
