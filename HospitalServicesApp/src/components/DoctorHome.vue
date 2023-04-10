<template>
  <div id="doctorHome">
    <md-app>
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button
          class="md-icon-button"
          @click="toggleMenu"
          v-if="!menuVisible"
        >
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Doctor</span>
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
          <md-list-item @click="cambiaContenido('pacientes')">
            <md-icon>local_hospital</md-icon>
            <span class="md-list-item-text">Pacientes</span>
          </md-list-item>

          <md-list-item @click="cambiaContenido('ajustes')">
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">Configuración</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content> 
        <h1 class="md-title">{{ titulo }}</h1>

        <div v-if="content === 'pacientes'">
          <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card>
            <md-table-toolbar>
              <md-field md-clearable class="md-toolbar-section-end">
                <md-input placeholder="Buscar por dni..." v-model="search" @input="buscaPaciente" />
              </md-field>
            </md-table-toolbar>

            <md-table-empty-state
              md-label="No se han encontrado pacientes"
              :md-description="`No se han encontrado pacientes con el dni '${search}'. Revisa el dni o da de alta al paciente.`">
              <md-button class="md-primary md-raised">Dar de alta paciente</md-button>
            </md-table-empty-state>
              <md-table-row>
                <md-table-head>Nombre</md-table-head>
                <md-table-head>Servicio</md-table-head>
                <md-table-head>Fecha de alta</md-table-head>
                <md-table-head>Fecha de baja</md-table-head>
              </md-table-row>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="DNI" md-sort-by="dni">{{ item.dni }}</md-table-cell>
                <md-table-cell md-label="Nombre" md-sort-by="nombre">{{ item.nombre }}</md-table-cell>
                <md-table-cell md-label="Servicio" md-sort-by="servicio">{{ item.servicio }}</md-table-cell>
                <md-table-cell md-label="Fecha de alta" md-sort-by="fechaDeAlta">{{ item.fechaDeAlta }}</md-table-cell>
                <md-table-cell md-label="Fecha de baja" md-sort-by="fechaDeBaja">{{ item.fechaDeBaja }}</md-table-cell>
              </md-table-row>
          </md-table>
        </div>
        <div v-if="content === 'ajustes'">
          
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>
  
  <script>
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
  name: "DoctorHome",
  data() {
    return {
      menuVisible: false,
      user: this.$user,
      titulo: "Lista de pacientes",
      content: "pacientes",
      search: null,
      searched: [],
      pacientes: [
        {
          id: 1,
          dni: "12345678A",
          nombre: "Nombre Paciente1",
          servicio: "servicio1",
          fechaDeAlta: "04/04/2023",
          fechaDeBaja: ""
        },
        {
          id: 2,
          dni: "87654321A",
          nombre: "Nombre Paciente2",
          servicio: "servicio2",
          fechaDeAlta: "05/04/2023",
          fechaDeBaja: "08/04/2023"
        },
        {
          id: 3,
          dni: "85746321C",
          nombre: "Nombre Paciente3",
          servicio: "servicio3",
          fechaDeAlta: "06/04/2023",
          fechaDeBaja: ""
        }
    ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    cambiaContenido(page){
      switch(page) {
        case 'pacientes':
          this.titulo = 'Lista de pacientes activos';
          this.content = 'pacientes';
          break;
        case 'ajustes':
          this.titulo = 'Configuración';
          this.content = 'ajustes';
          break;
      }
    },
    buscaPaciente() {
    this.searched = searchByDni(this.pacientes, this.search);
  },
  },
  created() {
    this.searched = this.pacientes;
  },
};
</script>

<style scoped>
  .md-app {
    height: 100vh;
  }
</style>
