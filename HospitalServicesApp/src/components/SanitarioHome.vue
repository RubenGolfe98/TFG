<template>
  <div id="sanitarioHome">
    <md-app>
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button
          class="md-icon-button"
          @click="toggleMenu"
          v-if="!menuVisible"
        >
          <md-icon>menu</md-icon>
        </md-button>

        <span class="md-title">Sanitario {{ user.dni }}</span>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="logout">
            <md-icon>logout</md-icon>
          </md-button>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navegación</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item @click="cambiaContenido('info')">
            <md-icon>person</md-icon>
            <span class="md-list-item-text"
              >{{ user.apellido1 }} {{ user.apellido2 }},
              {{ user.nombre }}</span
            >
          </md-list-item>

          <md-list-item @click="cambiaContenido('alarmas')">
            <md-icon>notifications</md-icon>
            <span class="md-list-item-text">Alarmas</span>
          </md-list-item>

          <md-list-item @click="cambiaContenido('pacientes')">
            <md-icon>supervisor_account</md-icon>
            <span class="md-list-item-text">Pacientes</span>
          </md-list-item>

          <md-list-item @click="cambiaContenido('crearServicio')">
            <md-icon>add</md-icon>
            <span class="md-list-item-text">Crear Servicio</span>
          </md-list-item>
        </md-list>
        
        <div class="horizontal-bar">
          <div class="horizontal-bar-item"></div>
        </div>

        <!-- SERVICIOS -->
        <md-list>
          <md-list-item @click="servicioSeleccionado(servicio)" v-for="servicio in servicios" :key="servicio._id">
            <md-icon>medical_information</md-icon>
            <span class="md-list-item-text">{{ servicio.nombre }}</span>
          </md-list-item>
        </md-list>
        <!-- /SERVICIOS -->
      </md-app-drawer>

      <md-app-content>
        <router-view @addServicioEvent="addServicio" :servicio="servicioSelected"></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>
  
  <style scoped>
.md-app {
height: 100vh;
}

.horizontal-bar {
  display: flex;
  width: 100%;
}

.horizontal-bar-item {
  flex: 1;
  padding: 3px;
  background-color: grey;
}
</style>
    
  <script>
import { ref } from "vue";

const toLower = (text) => {
  return text.toString().toLowerCase();
};

export default {
  name: "SanitarioHome",
  data() {
    return {
      user: this.$user,
      menuVisible: ref(true),
      servicios: [],
      servicioSelected: {}
    };
  },
  mounted(){
    this.getServicios();
  },
  methods: {
    servicioSeleccionado(servicio){
      this.servicioSelected = servicio;
      this.$router.push({name: "Servicio", params: {idServicioAsignado: servicio.nombre}}).catch(err => {
            console.log(err.name);
          });
    },
    getServicios(){
      console.log("USUARIO G: "+this.$user.dni);
      this.$model.getServiciosSanitario(this.$user.id, this.$user.dni, (err, servicios) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.servicios = servicios;
          }
        });
    },
    addServicio(servicio){
      this.servicios.push(servicio);
    },
    logout() {
      localStorage.removeItem('user');
      this.$user = {};
      this.cambiaContenido("home");
      this.$router.go();
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    cambiaContenido(page) {
      switch (page) {
        case "home":
          this.$router.push("/home").catch(err => {
            console.log(err.name);
          });
          
          break;
        case "info":
        this.$router.push("/sanitario").catch(err => {
            console.log(err.name);
          });
          break;
        case "alarmas":
          break;
        case "pacientes":
          this.$router.push("/sanitario/pacientes").catch(err => {
            console.log(err.name);
          });
          break;
        case "crearServicio":
        this.$router.push("/sanitario/servicios").catch(err => {
            console.log(err.name);
          });
          break;
      }
    },
  },
};
</script>

</script>