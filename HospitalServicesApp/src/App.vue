<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Login from '@/components/Login'
import DoctorHome from '@/components/DoctorHome'
import PacienteHome from '@/components/PacienteHome'

export default {
  components: { Login, DoctorHome, PacienteHome},
  name: "App",
  data() {
    return {
      user: this.$user,
    }
  },
};
</script>
