<template>
    <div id="home">
      <SanitarioHome v-if="user.esSanitario" :user="user" to="/sanitarioHome"></SanitarioHome>
      <PacienteHome v-else :user="user" to="/pacienteHome" ></PacienteHome>

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