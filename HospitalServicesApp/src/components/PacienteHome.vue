<template>
    <div id="pacienteHome">
      <md-app>
        <md-app-toolbar class="md-primary" md-elevation="0">
          <md-button
            class="md-icon-button"
            @click="toggleMenu"
            v-if="!menuVisible"
          >
            <md-icon>menu</md-icon>
          </md-button>

          <span class="md-title">Paciente {{ user.dni }}</span>
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
        </md-list>
        <div class="horizontal-bar">
          <div class="horizontal-bar-item"></div>
        </div>

        <!-- SERVICIOS -->
        <md-list>
          <md-list-item @click="servicioAsignadoSeleccionado(servicioAsignado)" v-for="servicioAsignado in this.serviciosAsignados" :key="servicioAsignado._id">
            <md-icon>medical_information</md-icon>
            <span class="md-list-item-text">{{ servicioAsignado.servicio.nombre }}</span>
          </md-list-item>
        </md-list>
        <!-- /SERVICIOS -->
        </md-app-drawer>
  
        <md-app-content>
        <router-view :servicioAsignado="servicioAsignadoSelected"></router-view>
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
      import { ref, watchEffect } from "vue";

  export default {
    name: "PacienteHome",
    data() {
      return {
        menuVisible: ref(true),
        user: this.$user,
        serviciosAsignados: this.$servicios,
        servicioAsignadoSelected: {}
      };
    },
    mounted(){
      this.getServicios();
    },
    methods: {
      formateaFechaYhora(fechaAformatear){
        if(fechaAformatear === null){
          return null;
        }
        var proxMed = new Date(fechaAformatear);
        var dia = proxMed.getDate();
        var mes = proxMed.getMonth() + 1;
        var anio = proxMed.getFullYear();
        var horas = proxMed.getHours();
        var minutos = proxMed.getMinutes();

        var fechaFormateada = ('0' + dia).slice(-2) + '/' + ('0' + mes).slice(-2) + '/' + anio;
        var horaFormateada = ('0' + horas).slice(-2) + ':' + ('0' + minutos).slice(-2);

        return fechaFormateada + ' ' + horaFormateada;
      },
      getServicios(){
        this.$model.getServiciosAsignadosPaciente(this.$user.id, this.$user.dni, {activo: true}, (err, serviciosAsignados) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            serviciosAsignados.forEach((servicioAsignado) => {
              servicioAsignado["fechaAltaFormateada"] = this.formateaFechaYhora(servicioAsignado.fechaAlta);
              servicioAsignado.mediciones.forEach((medicion) => {
                medicion["fechaFormateada"] = this.formateaFechaYhora(medicion.fecha);
              });
              if(servicioAsignado.fechaBaja != null){
                servicioAsignado["fechaBajaFormateada"] = this.formateaFechaYhora(servicioAsignado.fechaBaja);
              }
            });
            this.$servicios = serviciosAsignados;
            this.serviciosAsignados = this.$servicios;
          }
        });
      },
      servicioAsignadoSeleccionado(servicioAsignado){
        this.servicioAsignadoSelected = servicioAsignado;
        this.$router.push({name: "MedicionesServicio", params: {idServicio: this.servicioAsignadoSelected.servicio.nombre}}).catch(err => {
            console.log(err.name);
          });
      },
      logout() {
        localStorage.removeItem('user');
        this.$user = {};
        this.$servicios = [];
        this.cambiaContenido("home");
        this.$router.go();
      },
      toggleMenu() {
        this.menuVisible = !this.menuVisible;
      },
      registrarPaciente(){
      this.nuevoPaciente.fechaDeAlta = this.obtenerFechaActual();
      this.$model.addPaciente(this.user.id, this.nuevoPaciente,
      (err, token, form) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.pacienteRegistrado = true
            this.registroPaciente = false
          }
        });
      
    },
    cambiaContenido(page) {
      switch (page) {
        case "home":
          this.$router.push("/home").catch(err => {
            console.log(err.name);
          });
          
          break;
        case "info":
        this.$router.push("/paciente").catch(err => {
            console.log(err.name);
          });
          break;
      }
    }
    },
  };
  </script>
      
  <style scoped>
    .md-app {
      height: 100vh;
    }
  </style>