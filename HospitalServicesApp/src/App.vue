<template>
  <div id="app">
    <DoctorHome v-if="user.token && user.doctor"></DoctorHome>
    <PacienteHome v-else-if="user.token && !user.doctor"></PacienteHome>
    <Login v-else></Login>
  </div>
</template>

<script>
import Login from '@/Login'
import DoctorHome from '@/DoctorHome'
import PacienteHome from '@/PacienteHome'

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