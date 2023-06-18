<template>
    <div id="alarmas">
      <h1>Alarmas activas</h1>
      <md-button class="md-raised md-accent" @click="gestionarAlarma" :disabled="!hayAlarmas || !alarmaSelected">Gestionar alarma</md-button>
        <md-table v-model="alarms" @md-selected="alarmaSeleccionada" md-sort="fechaGeneracion" md-sort-order="asc" md-card>
              <md-table-empty-state
                md-label="No se han encontrado alarmas">
              </md-table-empty-state>
                <md-table-row>
                  <md-table-head>Servicio</md-table-head>
                  <md-table-head>Paciente</md-table-head>
                  <md-table-head>Fecha de generación</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single" >
                  <md-table-cell md-label="Servicio" md-sort-by="servicio">{{ item.servicioAsignado.servicio.nombre }}</md-table-cell>
                  <md-table-cell md-label="Paciente" md-sort-by="paciente">{{ item.servicioAsignado.paciente }}</md-table-cell>
                  <md-table-cell md-label="Fecha de generación" md-sort-by="fechaGeneracion">{{ item.fechaGeneradaFormateada }}</md-table-cell>
                </md-table-row>
            </md-table>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Alarmas",
  props: ['alarmas'],
  data() {
    return {
        alarms: ref(this.alarmas),
        hayAlarmas: false,
        alarmaSelected: false,
        alarmaAgestionar: { servicioAsignado: {paciente: ""}},
        alarmaGestionada: false,
    };
  },
  watch:{
    alarmas(){
        this.alarms = this.alarmas;
        this.comprobarSiHayAlarmas();
    }
  },
  methods: {
    alarmaGestionadaCerrar(){
        this.alarmaGestionada = false;
    },
    alarmaSeleccionada(alarma){
        this.alarmaAgestionar = alarma;
        this.alarmaSelected = true;
    },
    comprobarSiHayAlarmas(){
        if(Object.keys(this.alarmas).length>0){
            this.hayAlarmas = true;
        }
    },
    gestionarAlarma(){
        this.alarmaAgestionar["fechaGestionada"] = new Date();
        this.$model.gestionarAlarma(this.$user.id, this.alarmaAgestionar, (err, res) => {
            if (err) {
                alert("Error" + err.stack);
            }else{
                const index = this.alarms.findIndex(element => element["_id"] == this.alarmaAgestionar["_id"]);

                if (index !== -1) {
                    this.alarms.splice(index, 1);
                }
                this.alarmaGestionada = true;
                this.$emit('alarmasEvent');
            }
        });
    }
  }
};
</script>