<template>
    <div id="home">
      <DoctorHome v-if="this.$user.doctor"></DoctorHome>
      <PacienteHome v-else></PacienteHome>
    </div>
  </template>
  
  <script>
  import DoctorHome from '@/components/DoctorHome'
  import PacienteHome from '@/components/PacienteHome'
  import Vue from 'vue'
  
  export default {
    components: {DoctorHome, PacienteHome},
    name: "Home",
    data() {
      return {
        user: this.$user,
      }
    },
  };
  </script>