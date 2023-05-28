<template>
    <div id="pacientes">
      <h1>Lista de pacientes activos</h1>
        <md-table v-model="searched" @md-selected="abrirHistoricoPaciente" md-sort="name" md-sort-order="asc" md-card>
              <md-table-toolbar>
                <md-field md-clearable class="md-toolbar-section-start">
                  <md-input placeholder="Buscar por dni..." v-model="search" @input="buscaPaciente" />
                  
                </md-field>
                <md-button class="md-icon-button" @click="buscaPaciente" >
                    <md-icon>search</md-icon>
                </md-button>
  
                <!-- DAR DE ALTA PACIENTES -->
                <md-dialog-alert
                    :md-active.sync="pacienteRegistrado"
                    md-title="Paciente registrado!"
                    :md-content="'El paciente ' + nuevoPaciente.dni + ' ha sido registrado'" 
                    @md-closed="resetPaciente"/>
                <md-dialog :md-active.sync="registroPaciente" id="dialog">
                  <md-dialog-title>Dar de alta un paciente</md-dialog-title>
                  <md-avatar class="md-avatar-icon">
                    <md-icon>person_add</md-icon>
                  </md-avatar>
                  <md-dialog-content>
                    
                    <div class="form">
                      <!-- ID -->
                      <md-field>
                        <label>DNI</label>
                        <md-input id="id" v-model="nuevoPaciente.dni" maxlength="9"></md-input>
                      </md-field>
                      <!-- /ID -->
  
                      <!-- NOMBRE -->
                      <md-field>
                        <label>Nombre</label>
                        <md-input id="id" v-model="nuevoPaciente.nombre"></md-input>
                      </md-field>
                      <!-- /NOMBRE -->
  
                      <!-- APELLIDO1 -->
                      <md-field>
                        <label>Primer apellido</label>
                        <md-input id="id" v-model="nuevoPaciente.apellido1"></md-input>
                      </md-field>
                      <!-- /APELLIDO1 -->
  
                      <!-- APELLIDO2 -->
                      <md-field>
                        <label>Segundo apellido</label>
                        <md-input id="id" v-model="nuevoPaciente.apellido2"></md-input>
                      </md-field>
                      <!-- /APELLIDO2 -->
  
                      <!-- PASSWORD -->
                      <md-field>
                        <label>Password</label>
                        <md-input v-model="nuevoPaciente.password" type="password"></md-input>
                      </md-field>
                      <!-- /PASSWORD -->
  
                      <md-button class="md-primary" @click="registrarPaciente">Registrar paciente</md-button>
                      <md-button class="md-primary" @click="registroPaciente = false">Cancelar</md-button>
                    </div>
                  </md-dialog-content>
                </md-dialog>
  
                <md-button class="md-icon-button" @click="registroPaciente = true" >
                    <md-icon>person_add</md-icon>
                </md-button>
                
                <!-- /DAR DE ALTA PACIENTES -->
  
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
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
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
import { ref } from 'vue';

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
      registroPaciente: false,
      nuevoPaciente: {
        nombre: "",
        apellido1: "",
        apellido2: "",
        password: "",
        dni: "",
        esSanitario: false,
        doctores: [],
        fechaDeAlta: ""
      },
      pacienteRegistrado: false,
      search: null,
      searched: ref([]),
      pacientes: [],
    };
  },
  mounted(){
    this.obtenerPacientes();
  },
  methods: {
    abrirHistoricoPaciente(pacienteSeleccionado){
      this.$router.push({name: "HistoricoPaciente", params: {dniPaciente: pacienteSeleccionado.dni, pacienteSel: pacienteSeleccionado}}).catch(err => {
            console.log(err.name);
          });
    },
    obtenerPacientes(){
      this.$model.getPacientes(this.user.id, this.user.dni, (err, pacientes) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.pacientes = pacientes;
            this.searched = this.pacientes;
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
    resetPaciente(){
      this.pacienteRegistrado = false;
      this.nuevoPaciente = {
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
    this.searched = searchByDni(this.pacientes, this.search);
  },
  }
};
</script>