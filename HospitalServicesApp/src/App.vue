<template>
  <div id="app">
    <Login v-if="!user.token"></Login>
    <SanitarioHome v-else-if="user.token && user.esSanitario" ></SanitarioHome>
    <PacienteHome v-else-if="user.token && !user.esSanitario" ></PacienteHome>
  </div>
  
</template>

<script>
import Login from '@/components/Login'
import SanitarioHome from '@/components/SanitarioHome'
import PacienteHome from '@/components/PacienteHome'


export default {
  components: {Login, SanitarioHome, PacienteHome},
  name: "App",
  data() {
    return {
      user: this.$user
    }
  },
  mounted(){
    //if (localStorage.getItem('user') !== null) {
    //  this.$user = JSON.parse(localStorage.getItem('user'));
    //  this.user = this.$user;
    //  console.log(this.$user);
    //}
  }
};
</script>
