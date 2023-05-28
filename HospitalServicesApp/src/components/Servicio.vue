<template>
  <div id="servicio">
    <h1>Servicio de {{ $route.params.servicio.nombre }}</h1>
    <h4>{{ $route.params.servicio.descripcion }}</h4>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card>
      <md-table-toolbar>
        <md-field md-clearable class="md-toolbar-section-start">
          <md-input
            placeholder="Buscar por dni..."
            v-model="search"
            @input="buscaPaciente"
          />
        </md-field>
        <md-button class="md-icon-button" @click="buscaPaciente">
          <md-icon>search</md-icon>
        </md-button>

        <!-- DAR DE ALTA serviciosAsignados -->
        <md-dialog-alert
          :md-active.sync="servicioAsignadoRegistrado"
          md-title="Servicio asignado!"
          :md-content="
            'Se le ha asignado al paciente ' +
            this.nuevoServicioAsignado.paciente +
            ' el servicio de ' +
            $route.params.servicio.nombre
          "
          @md-closed="resetServicioAsignado"
        />
        <md-dialog :md-active.sync="registroServicioAsignado" id="dialog">
          <md-dialog-title
            >Asignar servicio de {{ $route.params.servicio.nombre }} a un
            paciente</md-dialog-title
          >
          <div class="icon-container">
            <md-icon>medical_information</md-icon>
            <md-icon>person_add</md-icon>
          </div>
          <md-dialog-content>
            <div class="form">
              <!-- DNI -->
              <md-field>
                <label>DNI del paciente</label>
                <md-input id="dni" v-model="nuevoServicioAsignado.paciente"></md-input>
              </md-field>
              <!-- /DNI -->
              <h3>Intervalo de las mediciones</h3>
              <div class="input-container">
                <md-field>
                  <label>Valor</label>
                  <md-input type="number" step="1" v-model="tiempoValor" min="1"></md-input>
                </md-field>
                <md-field>
                  <label for="movie">Unidades de tiempo</label>
                  <md-select v-model="tiempoUnidad" name="Unidades de tiempo" id="unidadTiempo">
                    <md-option value="h">Horas</md-option>
                    <md-option value="d">Días</md-option>
                    <md-option value="s">Semanas</md-option>
                  </md-select>
                </md-field>
              </div>
              <h3>Establecer valor límite para la generación de una alarma (Unidades: {{ $route.params.servicio.unidades }})</h3>
              <div class="input-container">
                <md-field>
                  <label>Valor</label>
                  <md-input type="number" v-model="nuevoServicioAsignado.valorMax"></md-input>
                </md-field>
              </div>
              <h3>Indicaciones para realizar las medidas</h3>
              <!-- OBSERVACIONES -->
              <md-field>
                <label>Observaciones</label>
                <md-textarea
                  maxlength="400"
                  v-model="nuevoServicioAsignado.observaciones"
                ></md-textarea>
              </md-field>
              <!-- /OBSERVACIONES -->

              <md-button class="md-primary" @click="registrarServicioAsignado">Asignar servicio</md-button>
              <md-button
                class="md-primary"
                @click="registroServicioAsignado = false"
                >Cancelar</md-button
              >
            </div>
          </md-dialog-content>
        </md-dialog>

        <md-button
          class="md-icon-button"
          @click="registroServicioAsignado = true"
        >
          <md-icon>person_add</md-icon>
        </md-button>

        <!-- /DAR DE ALTA serviciosAsignados -->
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No se han encontrado pacientes"
        :md-description="`No se han encontrado pacientes con el dni '${search}'. Revisa el dni o da de alta al paciente.`"
      >
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
        <md-table-cell md-label="DNI" md-sort-by="dni">{{
          item.dni
        }}</md-table-cell>
        <md-table-cell md-label="Nombre" md-sort-by="nombre">{{
          item.nombre
        }}</md-table-cell>
        <md-table-cell md-label="Primer apellido" md-sort-by="apellido1">{{
          item.apellido1
        }}</md-table-cell>
        <md-table-cell md-label="Segundo apellido" md-sort-by="apellido2">{{
          item.apellido2
        }}</md-table-cell>
        <md-table-cell md-label="Fecha de alta" md-sort-by="fechaDeAlta">{{
          item.fechaDeAlta
        }}</md-table-cell>
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
  name: "Servicio",
  props: ["user"],
  data() {
    return {
      registroServicioAsignado: false,
      tiempoValor: 1,
      tiempoUnidad: "h",
      nuevoServicioAsignado: {
        servicio: this.$route.params.servicio._id,
        fechaAlta: null,
        fechaBaja: null,
        proximaMedicion: null,
        intervalo: "",
        valorMax: 0,
        activo: true,
        observaciones: "",
        mediciones: [],
        sanitarioResponsable: this.$user.dni,
        paciente: "",
      },
      servicioAsignadoRegistrado: false,
      search: null,
      searched: ref([]),
      serviciosAsignados: [],
    };
  },
  mounted() {
    this.obtenerserviciosAsignados();
  },
  methods: {
    obtenerserviciosAsignados() {
      console.log("Hola");
      this.$model.getPacientesServicioAsignado(
        this.user.id,
        this.user.dni,
        this.$route.params.servicio._id,
        (err, serviciosAsignados) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.serviciosAsignados = serviciosAsignados;
            this.searched = this.serviciosAsignados;
          }
        }
      );
    },
    obtenerFechaActual() {
      const fecha = new Date();

      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const anio = fecha.getFullYear();

      const fechaActual = `${dia}/${mes}/${anio}`;

      return fechaActual;
    },
    registrarServicioAsignado() {
      this.nuevoServicioAsignado.fechaAlta = this.obtenerFechaActual();
      this.nuevoServicioAsignado.intervalo = this.tiempoValor.toString()+this.tiempoUnidad;
      this.nuevoServicioAsignado.proximaMedicion = new Date();

      this.$model.addServicioAsignado(
        this.user.id,
        this.nuevoServicioAsignado,
        (err, paciente) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.serviciosAsignados.push(paciente);
            this.searched = this.serviciosAsignados;

            this.servicioAsignadoRegistrado = true;
            this.registroServicioAsignado = false;
          }
        }
      );
    },
    resetServicioAsignado() {
      this.servicioAsignadoRegistrado = false;
      this.nuevoServicioAsignado = {
        nombre: "",
        apellido1: "",
        apellido2: "",
        password: "",
        dni: "",
        esSanitario: false,
        doctores: [],
      };
    },
    buscaPaciente() {
      this.searched = searchByDni(this.serviciosAsignados, this.search);
    },
  },
};
</script>