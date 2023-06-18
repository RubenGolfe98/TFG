<template>
    <div id="historicoPaciente">
      <h1>Histórico del paciente {{ $route.params.pacienteSel.dni }}</h1>
        <h2>Información</h2>
      <md-card>
      <md-card-header class="text-center">
        <div class="centered-icon">
          <md-icon class="md-size-3x">person</md-icon>
        </div>
      </md-card-header>
      <md-card-content>
        <div>
          <div class="input-container">
          <!-- NOMBRE -->
          <md-field>
            <label>Nombre</label>
            <md-input :disabled="true" id="id" v-model="$route.params.pacienteSel.nombre"></md-input>
          </md-field>
          <!-- /NOMBRE -->

          <!-- APELLIDO1 -->
          <md-field>
            <label>Primer apellido</label>
            <md-input
              :disabled="true"
              id="id"
              v-model="$route.params.pacienteSel.apellido1"
            ></md-input>
          </md-field>
          <!-- /APELLIDO1 -->

          <!-- APELLIDO2 -->
          <md-field>
            <label>Segundo apellido</label>
            <md-input
              :disabled="true"
              id="id"
              v-model="$route.params.pacienteSel.apellido2"
            ></md-input>
          </md-field>
          <!-- /APELLIDO2 -->
        </div>
          <!-- FECHA ALTA -->
          <md-field>
            <label>Fecha de alta</label>
            <md-input
              :disabled="true"
              id="id"
              v-model="$route.params.pacienteSel.fechaDeAlta"
            ></md-input>
          </md-field>
          <!-- /FECHA ALTA -->
        </div>
      </md-card-content>
    </md-card>

    <h2>Servicios asignados</h2>

    <md-table v-model="searched" @md-selected="abrirHistoricoServicioAsignado" md-sort="fechaAlta" md-sort-order="desc" md-card>
              <md-table-toolbar>
                <md-field md-clearable class="md-toolbar-section-start max-width">
                  <md-input placeholder="Buscar por nombre de Servicio..." v-model="search" @input="buscaServicio" />
                  
                </md-field>
                <md-button class="md-icon-button" @click="buscaServicio" >
                    <md-icon>search</md-icon>
                </md-button>
  
              </md-table-toolbar>
              
              <md-table-empty-state
                md-label="No se han encontrado servicios"
                :md-description="`No se han encontrado servicios con el nombre '${search}'. `">
              </md-table-empty-state>
                <md-table-row>
                  <md-table-head>Nombre</md-table-head>
                  <md-table-head>Sanitario responsable</md-table-head>
                  <md-table-head>Fecha de alta</md-table-head>
                  <md-table-head>Fecha de baja</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
                  <md-table-cell md-label="Nombre" md-sort-by="nombre">{{ item.servicio.nombre }}</md-table-cell>
                  <md-table-cell md-label="Sanitario responsable" md-sort-by="sanitario">{{ item.sanitarioResponsable }}</md-table-cell>
                  <md-table-cell md-label="Fecha de alta" md-sort-by="fechaAlta">{{ item.fechaAltaFormateada }}</md-table-cell>
                  <md-table-cell md-label="Fecha de baja" md-sort-by="fechaBaja">{{ item.fechaBajaFormateada }}</md-table-cell>
                  
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
  const toLower = (text) => {
  return text.toString().toLowerCase();
};

const searchByServicio = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.servicio.nombre).includes(toLower(term)));
  }

  return items;
};

import { ref } from 'vue';

  export default {
    components: {},
    name: "HistoricoPaciente",
    data() {
      return {
        search: null,
        serviciosAsignados: [],
        searched: ref([]),
      };
    },
    mounted(){
      this.getServiciosAsignadosPaciente();
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
      getServiciosAsignadosPaciente(){
        this.$model.getServiciosAsignadosPaciente(this.$route.params.pacienteSel._id, this.$route.params.pacienteSel.dni, {}, (err, serviciosAsignados) => {
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
            this.serviciosAsignados = serviciosAsignados;
            this.searched = this.serviciosAsignados;
          }
        });
      },
      buscaServicio() {
        this.searched = searchByServicio(this.serviciosAsignados,this.search);
      },
      abrirHistoricoServicioAsignado(servicioAsignado){
        this.$router.push({name: "ServicioAsignadoInfo", params: {
          dniPaciente: this.$route.params.pacienteSel.dni, 
          idServicioAsignado: servicioAsignado.servicio.nombre, 
          pacienteSel: this.$route.params.pacienteSel,
          servicioAsignado: servicioAsignado
        }}).catch(err => {
            console.log(err.name);
          });
      }
    },
  };
  </script>
  
  <style>
.max-width {
  max-width: 300px; /* El valor del ancho máximo que desees */
}
</style>