import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'v-form-layer',
    file: 'dist/v-form-layer.umd.js',
    format: 'umd'
  }
})

export default config
