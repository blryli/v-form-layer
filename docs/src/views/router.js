import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routerFiles = require.context('./', false, /\.vue$/)

export const routes = routerFiles.keys().reduce((routes, file) => {
  const path = file.split('.')[1]
  const name = path.substr(1)
  return routes.concat({ path, name, component: () => import(`${file}`) })
}, [{ path: '/', redirect: '/1-layout' }])

console.log(routes)

export default new VueRouter({routes})
