<template>
  <div id="app">
    <Login v-if="!user.token"></Login>
    <router-view :user="user" v-else></router-view>
  </div>
</template>

<script>
import Login from '@/components/Login'


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
