<template>
    <div id="historicoPaciente">
      <h1>Servicio de {{ servicioAsignado.servicio.nombre }} del paciente {{ $route.params.pacienteSel.dni }}</h1>
      <h2>Información del servicio asignado</h2>

      <md-dialog-confirm
        :md-active.sync="baja"
        :md-title="tituloDarBaja"
        md-content="Una vez dado de baja un paciente, <strong>NO</strong> podrá volver a reabrirse el servicio asignado."
        md-confirm-text="Dar de baja"
        md-cancel-text="Cancelar"
        @md-cancel="cancelarDarDeBaja"
        @md-confirm="darDeBaja" />

      <div class="button-container">
        <md-button class="md-raised md-accent" @click="baja = true" :disabled="!servicioAsignado.activo">Dar de baja</md-button>
      </div>

      <md-card>
      <md-card-header class="text-center">
        <div class="centered-icon">
          <md-icon class="md-size-3x">medical_information</md-icon>
        </div>
      </md-card-header>
      <md-card-content>
        <div>
            <!-- DESCRIPCION DEL SERVICIO -->
            <md-field>
              <label>Descripción del servicio</label>
              <md-textarea
                :disabled="true"
                v-model="servicioAsignado.servicio.descripcion"
              ></md-textarea>
            </md-field>
            <!-- /DESCRIPCION DEL SERVICIO -->

            <div class="input-container">
                <!-- FECHA ALTA -->
                <md-field>
                    <label>Fecha de alta</label>
                    <md-input :disabled="true" v-model="servicioAsignado.fechaAltaFormateada"></md-input>
                </md-field>
                <!-- /FECHA ALTA -->

                <!-- FECHA BAJA -->
                <md-field>
                    <label>Fecha de baja</label>
                    <md-input :disabled="true" v-model="servicioAsignado.fechaBajaFormateada"></md-input>
                </md-field>
                <!-- /FECHA BAJA -->
            </div>

            <!-- OBSERVACIONES -->
            <md-field>
                <label>Observaciones</label>
                <md-textarea
                  :disabled="true"
                  v-model="servicioAsignado.observaciones"
                ></md-textarea>
            </md-field>
            <!-- /OBSERVACIONES -->

            <div class="input-container">
                <!-- INTERVALO -->
                <md-field>
                    <label>Intervalo de mediciones</label>
                    <md-input :disabled="true" v-model="servicioAsignado.intervalo"></md-input>
                </md-field>
                <!-- /INTERVALO -->

                <!-- VALOR MAX GENERACION ALARMA -->
                <md-field>
                    <label>Valor máximo para la generación de una alarma</label>
                    <md-input :disabled="true" v-model="servicioAsignado.valorMax"></md-input>
                </md-field>
                <!-- /VALOR MAX GENERACION ALARMA -->
            </div>

        </div>
      </md-card-content>
    </md-card>

    <h2>Mediciones del paciente</h2>
    <h3>Unidades: {{ servicioAsignado.servicio.unidades }}</h3>
    <md-table v-model="searched" md-sort="fechaRegistro" md-sort-order="desc" md-card>
              <md-table-empty-state
                md-label="No se han encontrado mediciones">
              </md-table-empty-state>
                <md-table-row>
                  <md-table-head>Valor</md-table-head>
                  <md-table-head>Fecha de registro</md-table-head>
                  <md-table-head>¿Generó alarma?</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                  <md-table-cell md-label="Valor" md-sort-by="valor">{{ item.valor }}</md-table-cell>
                  <md-table-cell md-label="Fecha de registro" md-sort-by="fechaRegistro">{{ item.fechaFormateada }}</md-table-cell>
                  <md-table-cell md-label="¿Generó alarma?" md-sort-by="alarma">{{ item.alarma }}</md-table-cell>
                </md-table-row>
      </md-table>
    </div>
  </template>
  
  <style>
  .button-container {
    display: flex;
    justify-content: flex-end;
  }
  .centered-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .input-container {
    display: flex;
    gap: 10px; /* Espacio entre los campos */
  }
  .input-container md-field {
    flex: 1; /* Ocupa el espacio disponible */
  }
  </style>

  <script>

import { ref } from 'vue';

  export default {
    components: {},
    name: "HistoricoPaciente",
    data() {
      return {
        servicioAsignado : this.$route.params.servicioAsignado,
        tituloDarBaja: "Dar de baja al paciente " + this.$route.params.pacienteSel.dni + " del servicio de " + this.$route.params.servicioAsignado.servicio.nombre,
        baja: false,
        search: null,
        searched: ref(this.$route.params.servicioAsignado.mediciones),
        deshabilitaBaja: false,
      };
    },
    mounted(){
      if(this.servicioAsignado.fechaBaja !== null){
        this.deshabilitaBaja = true;
      }
    },
    methods: {
      darDeBaja(){
        this.$model.deleteServicioAsignado(this.$user.id, this.servicioAsignado._id, (err, res) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.servicioAsignado.fechaBaja = new Date();
            this.servicioAsignado.activo = res;
          }
        });
      },
      cancelarDarDeBaja(){
        this.baja = false;
      },
      buscaMedicion() {
      }
    },
  };
  </script>
  