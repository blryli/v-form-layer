<template>
  <div id="app">
    <h2>v-form-layer</h2>
    <div class="nav">
      <el-button
        v-for="(d, i) in routes"
        :key="i"
        :type="$route.path === d.path ? 'primary' : ''"
        @click="$router.push(d.path)"
      >{{ d.name }}</el-button>
    </div>
    <div class="demo-box">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { routes } from './views/router'
export default {
  name: 'App',
  computed: {
    routes() {
      return routes.filter(d => d.name)
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  text-align: center;
  background-color: #f1f3f5;
  min-height: 100vh;
}
.nav{
  padding: 50pxl
}
.demo-box {
  margin: 50px;
  padding: 20px;
  background-color: #fff;
}
h2 {
  margin: 0;
  padding: 20px;
  text-align: center;
  color: #888;
}
h3{
  margin-bottom: 40px;
}
</style>
