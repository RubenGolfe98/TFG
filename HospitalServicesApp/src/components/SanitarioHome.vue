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
          <span>Navigation</span>

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
          <md-list-item @click="servicioSeleccionado(servicio)" v-for="servicio in this.servicios" :key="servicio._id">
            <md-icon>medical_information</md-icon>
            <span class="md-list-item-text">{{ servicio.nombre }}</span>
          </md-list-item>
        </md-list>
        <!-- /SERVICIOS -->
      </md-app-drawer>

      <md-app-content>
        <router-view :user="user"></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>
  
  <style scoped>
.md-dialog .md-dialog-container {
  max-width: 768px;
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
import { ref, watchEffect } from "vue";

const toLower = (text) => {
  return text.toString().toLowerCase();
};

const searchByDni = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.dni).includes(toLower(term)));
  }

  return items;
};

export default {
  name: "SanitarioHome",
  data() {
    return {
      user: this.$user,
      menuVisible: ref(true),
      servicios: this.$servicios
    };
  },
  mounted(){
    this.getServicios();
  },
  methods: {
    servicioSeleccionado(servicio){
      this.$router.push({name: "Servicio", params: {idServicioAsignado: servicio.nombre, servicio: servicio}}).catch(err => {
            console.log(err.name);
          });
    },
    getServicios(){
      this.$model.getServiciosSanitario(this.user.id, this.user.dni, (err, servicios) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.$servicios = servicios;
            this.actualizaServicios();
          }
        });
    },
    actualizaServicios(){
      this.servicios = this.$servicios;
    },
    logout() {
      this.$user = {};
      this.$router.go("/home");
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
  
  <style scoped>
.md-app {
  height: 100vh;
}
</style>
  