<template>
  <div id="app">
    <md-app v-if="user.token" md-mode="fixed" md-waterfall>
      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
    <Login v-else></Login>
  </div>
</template>

<script>
import Login from '@/Login'
export default {
  components: {Login},
  name: "App",
  data() {
    return {
      user: this.$user,
    }
  },
};
</script>

<style>
#app {
  margin: 20%;
}
</style>
