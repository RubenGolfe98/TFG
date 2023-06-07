<template>
    <div id="historicoPaciente">
      <h1>Servicio de {{ servicioAsignado.servicio.nombre }}</h1>
        <h2>Información del servicio asignado</h2>
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
                    <md-input :disabled="true" v-model="fechaAltaFormateada"></md-input>
                </md-field>
                <!-- /FECHA ALTA -->

                <!-- FECHA BAJA -->
                <md-field>
                    <label>Fecha de baja</label>
                    <md-input :disabled="true" v-model="servicioAsignado.fechaBaja"></md-input>
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
                <!-- PROXIMA MEDICION -->
                <md-field>
                    <label>Próxima medición</label>
                    <md-input :disabled="true" v-model="proximaMedicionFormateada"></md-input>
                </md-field>
                <!-- /PROXIMA MEDICION -->

                <!-- INTERVALO -->
                <md-field>
                    <label>Intervalo de mediciones</label>
                    <md-input :disabled="true" v-model="servicioAsignado.intervalo"></md-input>
                </md-field>
                <!-- /INTERVALO -->
            </div>

        </div>
      </md-card-content>
    </md-card>

    <h2>Mediciones del paciente</h2>
    <h3>Unidades: {{ servicioAsignado.servicio.unidades }}</h3>
    <md-table v-model="searched" md-sort="fechaRegistro" md-sort-order="desc" md-card>
        <md-table-toolbar>
            <md-button class="md-raised md-accent" @click="registroMedicion = true">Registrar nueva medición</md-button>
            <!-- REGISTRAR MEDICION -->
            <md-dialog-alert
                    :md-active.sync="medicionRegistrada"
                    md-title="Medición registrada!"
                    :md-content="'Se ha registrado una nueva medición en el servicio de '+servicioAsignado.servicio.nombre" 
                    @md-closed="resetMedicion"/>
                <md-dialog :md-active.sync="registroMedicion" id="dialog">
                  <md-dialog-title>Registro de una medición para el servicio de {{ servicioAsignado.servicio.nombre }}</md-dialog-title>
                  <md-avatar class="md-avatar-icon">
                    <md-icon>person_add</md-icon>
                  </md-avatar>
                  <md-dialog-content>
                    
                    <div class="form">
                        <div class="input-container">
                            <!-- VALOR -->
                            <md-field>
                                <label>Valor</label>
                                <md-input type="number" v-model="medicionNueva.valor"></md-input>
                            </md-field>
                            <!-- /VALOR -->

                            <!-- UNIDADES -->
                            <md-field>
                                <label>Unidades</label>
                                <md-input :disabled="true" v-model="servicioAsignado.servicio.unidades"></md-input>
                            </md-field>
                            <!-- /UNIDADES -->
                        </div>
  
                      <md-button class="md-primary" @click="registrarMedicion">Registrar medición</md-button>
                      <md-button class="md-primary" @click="registroMedicion = false">Cancelar</md-button>
                    </div>
                  </md-dialog-content>
                </md-dialog>
                
                <!-- /REGISTRAR MEDICION -->
        </md-table-toolbar>
              <md-table-empty-state
                md-label="No se han encontrado mediciones">
              </md-table-empty-state>
                <md-table-row>
                  <md-table-head>Valor</md-table-head>
                  <md-table-head>Fecha de registro</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                  <md-table-cell md-label="Valor" md-sort-by="valor">{{ item.valor }}</md-table-cell>
                  <md-table-cell md-label="Fecha de registro" md-sort-by="fechaRegistro">{{ item.fecha }}</md-table-cell>
                </md-table-row>
      </md-table>
    </div>
  </template>
  
  <style>
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
    props: ['servicioAsignado'],
    data() {
      return {
        registroMedicion: false,
        medicionNueva: {
            valor: 0
        },
        medicionRegistrada: false,
        search: null,
        searched: this.servicioAsignado.mediciones,
        fechaBajaFormateada: this.formateaFechaYhora(this.servicioAsignado.fechaBaja),
        fechaAltaFormateada: this.formateaFechaYhora(this.servicioAsignado.fechaAlta),
        proximaMedicionFormateada: this.formateaFechaYhora(this.servicioAsignado.proximaMedicion)
      };
    },
    watch: {
      servicioAsignado(){
        this.searched = this.servicioAsignado.mediciones;
        this.fechaBajaFormateada = this.formateaFechaYhora(this.servicioAsignado.fechaBaja)
        this.fechaAltaFormateada = this.formateaFechaYhora(this.servicioAsignado.fechaAlta)
        this.proximaMedicionFormateada = this.formateaFechaYhora(this.servicioAsignado.proximaMedicion)
      }
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
      obtenerProximaMedicion(){
        let prxMed = new Date(this.servicioAsignado.proximaMedicion)
        let indice = 0;
        for (var i = 0; i < this.servicioAsignado.intervalo.length; i++) {
          if (isNaN(parseInt(this.servicioAsignado.intervalo[i]))) {
            indice = i;
            break;
          }
        }
        var valor = parseInt(this.servicioAsignado.intervalo.substring(0, indice));
        var intervalo = this.servicioAsignado.intervalo.substring(indice);
        
        switch(intervalo){
          case 'h':
          prxMed.setHours(prxMed.getHours() + valor);
            break;
          case 'd':
          prxMed.setDate(prxMed.getDate() + valor);
            break;
          case 's':
          prxMed.setDate(prxMed.getDate() + 7);
            break;   
        }

        return prxMed;
      },
        registrarMedicion(){
            this.medicionNueva["fecha"] = new Date();
            let posibleProxMed = this.obtenerProximaMedicion();
            this.$model.addMedicion(this.$user.id, this.$user.dni, this.servicioAsignado._id, this.medicionNueva, posibleProxMed, (err, medicion) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.proximaMedicionFormateada = this.formateaFechaYhora(posibleProxMed);
            this.searched.push(medicion);
            this.medicionRegistrada = true;
            this.registroMedicion = false;
          }
        });
        },
        buscaMedicion() {
        },
        resetMedicion(){
            this.medicionRegistrada = false;
            this.medicionNueva = {
                valor: 0,
                fecha: null
            }
        }
    },
  };
  </script>
  