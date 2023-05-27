<template>
    <div id="servicio">
      <h1>Servicio de {{ $route.params.servicio.nombre }}</h1>
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card>
              <md-table-toolbar>
                <md-field md-clearable class="md-toolbar-section-start">
                  <md-input placeholder="Buscar por dni..." v-model="search" @input="buscaPaciente" />
                  
                </md-field>
                <md-button class="md-icon-button" @click="buscaPaciente" >
                    <md-icon>search</md-icon>
                </md-button>
  
                <!-- DAR DE ALTA serviciosAsignados -->
                <md-dialog-alert
                    :md-active.sync="servicioAsignadoRegistrado"
                    md-title="Servicio asignado!"
                    :md-content="'Se le ha asignado al paciente ' + nuevoServicioAsignado.dni + ' el servicio de '+nuevoServicioAsignado.nombre" 
                    @md-closed="resetServicioAsignado"/>
                <md-dialog :md-active.sync="registroServicioAsignado" id="dialog">
                  <md-dialog-title>Asignar servicio de {{ $route.params.servicio.nombre }} a un paciente</md-dialog-title>
                  <md-avatar class="md-avatar-icon">
                    <md-icon>person_add</md-icon>
                  </md-avatar>
                  <md-dialog-content>
                    
                    <div class="form">

  
                      <md-button class="md-primary" @click="registrarServicioAsignado">Registrar paciente</md-button>
                      <md-button class="md-primary" @click="registroServicioAsignado = false">Cancelar</md-button>
                    </div>
                  </md-dialog-content>
                </md-dialog>
  
                <md-button class="md-icon-button" @click="registroServicioAsignado = true" >
                    <md-icon>person_add</md-icon>
                </md-button>
                
                <!-- /DAR DE ALTA serviciosAsignados -->
  
              </md-table-toolbar>
              
              <md-table-empty-state
                md-label="No se han encontrado pacientes"
                :md-description="`No se han encontrado pacientes con el dni '${search}'. Revisa el dni o da de alta al paciente.`">
                <md-button class="md-primary md-raised">Dar de alta paciente</md-button>
              </md-table-empty-state>
                <md-table-row>
                  <md-table-head>DNI</md-table-head>
                  <md-table-head>Nombre</md-table-head>
                  <md-table-head>Primer apellido</md-table-head>
                  <md-table-head>Segundo apellido</md-table-head>
                  <md-table-head>Fecha de alta</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="DNI" md-sort-by="dni">{{ item.dni }}</md-table-cell>
                  <md-table-cell md-label="Nombre" md-sort-by="nombre">{{ item.nombre }}</md-table-cell>
                  <md-table-cell md-label="Primer apellido" md-sort-by="apellido1">{{ item.apellido1 }}</md-table-cell>
                  <md-table-cell md-label="Segundo apellido" md-sort-by="apellido2">{{ item.apellido2 }}</md-table-cell>
                  <md-table-cell md-label="Fecha de alta" md-sort-by="fechaDeAlta">{{ item.fechaDeAlta }}</md-table-cell>
                </md-table-row>
            </md-table>
    </div>
</template>

<script>
import { ref,  watchEffect } from 'vue';

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
  name: "Servicio",
  props: ['user'],
  data() {
    return {
      registroServicioAsignado: false,
      nuevoServicioAsignado: {
        fechaAlta: "",
        fechaBaja: null,
        intervalo: "",
        valorMax: 0,
        activo: true,
        observaciones: "",
        mediciones: [],
        sanitarioResponsable: this.user.dni,
        paciente: ""
      },
      servicioAsignadoRegistrado: false,
      search: null,
      searched: ref([]),
      serviciosAsignados: [],
    };
  },
  mounted(){
    this.obtenerserviciosAsignados();
  },
  methods: {
    obtenerserviciosAsignados(){
        console.log("Hola");
      this.$model.getPacientesServicioAsignado(this.user.id, this.user.dni, this.$route.params.servicio._id, (err, serviciosAsignados) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.serviciosAsignados = serviciosAsignados;
            this.searched = this.serviciosAsignados;
          }
        });
    },
    obtenerFechaActual() {
      const fecha = new Date();

      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();

      const fechaActual = `${dia}/${mes}/${anio}`;

      return fechaActual;
    },
    registrarServicioAsignado(){
      this.nuevoServicioAsignado.fechaAlta = this.obtenerFechaActual();
      this.$model.addServicioAsignado(this.user.id, this.nuevoServicioAsignado,
      (err, token, form) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.servicioAsignadoRegistrado = true
            this.registroServicioAsignado = false
          }
        });
      
    },
    resetServicioAsignado(){
      this.servicioAsignadoRegistrado = false;
      this.nuevoServicioAsignado = {
              nombre: "",
              apellido1: "",
              apellido2: "",
              password: "",
              dni: "",
              esSanitario: false,
              doctores: []
      }
    },
    buscaPaciente() {
    this.searched = searchByDni(this.serviciosAsignados, this.search);
  },
  }
};
</script>