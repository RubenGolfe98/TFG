<template>
    <div id="home">
      <SanitarioHome :user="user" v-if="user.esSanitario"></SanitarioHome>
      <PacienteHome :user="user" v-else></PacienteHome>
    </div>
</template>
  
  <script>
  import SanitarioHome from '@/components/SanitarioHome'
  import PacienteHome from '@/components/PacienteHome'
  
  export default {
    components: {SanitarioHome, PacienteHome},
    props: ['user'],
    name: "Home",
    data() {
      return {
        
      }
    },
  };
  </script>