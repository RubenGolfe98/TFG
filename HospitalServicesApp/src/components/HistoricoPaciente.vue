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
                <md-field md-clearable class="md-toolbar-section-start">
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
                  <md-table-cell md-label="Fecha de alta" md-sort-by="fechaAlta">{{ item.fechaAlta }}</md-table-cell>
                  <md-table-cell md-label="Fecha de baja" md-sort-by="fechaBaja">{{ item.fechaBaja }}</md-table-cell>
                  
                </md-table-row>
      </md-table>
    </div>
  </template>
  
  <style>
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
        search: null,
        searched: ref([{servicio:{nombre: "Cardiología"}, sanitarioResponsable: "12345678A", fechaAlta: "", fechaBaja: ""}]),
      };
    },
    methods: {
      buscaServicio() {

      },
      abrirHistoricoServicioAsignado(){

      }
    },
  };
  </script>
  