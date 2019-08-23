## v-form-layer

- 快速实现复杂布局
- 轻松实现逻辑校验，多种展示效果
- 支持多图层展示

### 演示

[github pages](https://blryli.github.io/v-form-layer/)

#### npm 安装

```js
npm i -S v-form-layer
```

#### 使用

```js
import VFormLayer from 'v-form-layer'
import 'v-form-layer/dist/v-form-layer.css'

Vue.use(VFormLayer)

// 或者直接使用script导入
<script src="https://unpkg.com/v-form-layer/dist/v-form-layer.min.js"></script>
<script src="https://unpkg.com/v-form-layer/dist/v-form-layer.css"></script>
```

#### 基本布局

```html
<v-form>
  <v-form-line :cols="[{ label: '名字' },{ label: '年龄' }]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>
```

#### 增加图层

```html
<v-form :layer="layer">
  <v-form-line
    :cols="[{ label: '名字', path: '/name' },{ label: '年龄', path: '/age'}]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>
```

```js
<script>
export default {
  data () {
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          data: [
            {
              path: "/name",
              message: "测试message"
            },
            {
              path: "/age",
              message: "测试message"
            }
          ]
        },
      ]
    }
  }
}
</script>
```

#### 自定义显示模板

```html
<v-form :layer="layer">
  <v-form-line
    :cols="[{ label: '名字', path: '/name' },
            { label: '年龄', path: '/age'}]"
  >
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>
```

```js
<script>
export default {
  data () {
    var templateFn = data => {
      return
        // your component
        // vue1.0支持 this.$createElement("component", { attrs: { data: data } });

        // vue2.0支持jsx
        // 可以直接写 <component data={data}></component>
        // 或者写引入的组件

        // 不支持的可以
            npm install\
            babel-plugin-syntax-jsx\
            babel-plugin-transform-vue-jsx\
            babel-helper-vue-jsx-merge-props\
            babel-preset-es2015\
          --save-dev
        // .babelrc
            {
              "presets": ["es2015"],
              "plugins": ["transform-vue-jsx"]
            }
        // 然后就可以愉快地写jsx了
    };
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          data: [
            {
              path: "/name",
              template: templateFn,
              meaasge: // your show meaasge
            },
            {
              path: "/age",
              meaasge: "我是年龄"
            }
          ]
        },
      ]
    }
  }
}
</script>
```

#### 自定义校验

```html
<v-form ref="form" :model="form" :layer="layer">
  <v-form-line
    :cols="[{path: '/name', label: '名字', validator: rules.name},
            {path: '/age', label: '年龄', validator: rules.age}]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>

<el-button @click="validate">校验</el-button>
<el-button @click="clearValidate">清除校验</el-button>
```

```js
<script>
import { validateSuccess, validateError, validateWarn } from '@/utils/validate';

export default {
  data () {
    return {
      form: {},
      layer: [],
      rules: {
        name(val) {
          if (!val) {
            return validateError('名字不能为空！')
          } else {
            return validateSuccess()
          }
        },
        age(val) {
          if (!val) {
            return validateWarn('年龄不能为空！')
          } else {
            return validateSuccess()
          }
        }
      }
    }
  },
  methods: {
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log(JSON.stringify(validators, null, 2)) // 所有校验结果数组
        console.log(val, val ? '校验通过' : '校验不通过') 
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>
```

@/utils/validate.js 定义全局校验结果样式

```js
export const validateSuccess = message => {
  return {
    message,
    effect: '#67c23a',
    disabled: true,
    referenceBorderColor: '#67c23a',
    referenceBgColor: '#e1f3d8'
  }
}

export const validateError = message => {
  return {
    message,
    effect: '#F56C6C',
    referenceBorderColor: '#F56C6C',
    referenceBgColor: '#fde2e2',
    stop: true
  }
}
export const validateWarn = message => {
  return {
    message,
    effect: '#E6A23C',
    referenceBorderColor: '#E6A23C',
    referenceBgColor: '#faecd8'
  }
}
```

### v-form Attributes

| 参数          | 说明                                     | 类型         | 可选值         | 默认值 |
| ------------- | ---------------------------------------- | ------------ | -------------- | ------ |
| layer         | 图层数组                                 | array        | -              | -      |
| model         | 数据模型，用于校验时获取字段的值               | object/array | -              | -      |
| label-width   | 表单域标签的宽度                         | string       | -              | -      |
| labelPosition | label 的位置                             | string       | left/right/top | right  |
| line-height   | form-item 内 label 及 content 行高       | string       | -              | '32px' |
| rowledge      | form-item 行距                           | string       | -              | '24px' |
| item-gutter   | form-item 之间的间隔                     | number       | -              | 0      |
| response      | 表单响应式，只在手机端生效               | boolean      | -              | true   |

### v-form Methods

| 方法名           | 说明                                                                                                                                                     | 参数                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| validate      | 对整个表单进行重算的方法，参数是一个回调函数(第一个参数是校验是否通过，第二个参数是所有校验结果集合数组)                                                                              | Function(boolean, array) |
| validateField | 对单个字段进行重算的方法，参数是路径，规则 | path: string, rule: function               |
| clearValidate   | 移除表单校验结果。参数是要移除校验结果的路径数组，如不传则移除整个表单的重算结果)| paths: array |

### v-form Events

| 事件名称 | 说明       | 回调参数 |
| -------- | ---------- | -------- |
| validate     | 任一表单项被校验后触发 | {path,success,message,stop}     |
| show     | 显示时触发 | prop     |
| hide     | 隐藏时触发 | prop     |

### v-form layer 图层 array

| 参数 | 说明           | 类型    | 可选值 | 默认值 |
| ---- | -------------- | ------- | ------ | ------ |
| id   | 图层 id        | string  | -      | -      |
| show | 图层是否展示   | boolean | -      | true   |
| view | 图层默认配置   | object  | -      | -      |
| data | 图层 item 配置 | object  | -      | -      |

### layer view 图层默认配置 object

> 定义图层统一样式

| 参数      | 说明   |         类型    | 可选值               | 默认值  |
| -------- | ------- | --------------- | ----------- | ------- |
| type     | 图层类型        | string          | popover/text          | popover |
| effect | 图层主题或颜色，如果传入色值则主题颜色为该色值  | string   | light/dark/warn/error | dark   |
| borderColor      | 图层边框颜色 | string          | -            | "#ccc"  |
| placement         | 图层展示位置  | string          | top/right/bottom/left | top     |
| disabled           | 图层是否禁用 | boolean         | -                     | false   |
| trigger         | 图层触发方式  | string          | hover/focus/click     | hover   |
| hideDelay        | 图层隐藏延时  | number          | -                     | 200     |
| showAlways       | 图层是否总是显示   | boolean         | -                     | false   |
| enterable       | 图层为 popover 时，鼠标是否可移入  | boolean         | -                     | false   |
| visible-arrow     | 图层为 popover 时，是否显示箭头 | boolean         | -                     | true    |
| template         | 数据展示模板 (data) => {return 模板/组件 }, 回调参数 data 是数据  | function       | -        | top     |
| referenceBgColor | 参考点背景颜色 | string          | -                    | -       |
| referenceBorderColor|     参考点边框颜色   | string        | -           | -       |

### layer data 图层 item 配置 array

| 参数        | 说明   | 类型                | 可选值 | 默认值 |
| ----------- | --------------------------- | ------------------- | ------ | ------ |
| path        | 使用图层的路径字段，如不传则该配置不会作用于任何字段 | -        | -      | -      |
| message|展示数据，传入模板 template 则通过模板展示数据，object/array 类型需要传模板 | string/object/array | - | -  |
| 可以重新定义字段的图层配置，优先级大于 view|

### v-form-line Attributes

| 参数        | 说明            | 类型    | 默认值 |
| ----------- | ------- | ------- | ------ |
| cols        | item 布局配置                                                            | array   | []     |
| label-width | 表单域标签的宽度                                                         | string  | -      |
| label       | 子节点并排展示时使用，form-line 设置 label 后，子节点设置的 label 将失效 | string  | -      |
| span        | form-line 在一行分成 24 份中所占的份数                                   | number  | 24     |
| required    | 子节点并排展示时使用                                                     | boolean | false  |

#### cols item 布局配置

| 参数        | 说明                                       | 类型    | 默认值 |
| ----------- | ------------------------------------------ | ------- | ------ |
| label       | item label 名                              | string  | -      |
| path        | 字段路径，在需要校验时是必须的           | string  | -      |
| validator        | 校验函数           | function  | -      |
| trigger        | 触发校验的方式   blur/change        | string  | blur     |
| label-width | 表单域标签的宽度                           | string  | "80px" |
| span        | item 在 form-line 分成 24 份中所占的份数   | number  | 24     |
| required    | 是否必填(只提供样式，校验规则要在图层定义) | boolean | false  |

