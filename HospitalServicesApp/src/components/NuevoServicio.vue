<template>
  <div id="nuevoServicio">
    <h1>Dar de alta un servicio</h1>

    <md-dialog-alert
                    :md-active.sync="servicioRegistrado"
                    md-title="Servicio registrado!"
                    :md-content="'El servicio ' + servicio.nombre + ' ha sido registrado'" 
                    @md-closed="resetServicio"/>
    <div class="form">
      <md-card>
        <md-card-content>
          <div class="form">
            <!-- NOMBRE DEL SERVICIO -->
            <md-field>
              <label>Nombre del servicio</label>
              <md-input id="nombreServicio" v-model="servicio.nombre"></md-input>
            </md-field>
            <!-- /NOMBRE DEL SERVICIO -->

            <!-- DESCRIPCION DEL SERVICIO -->
            <md-field>
              <label>Descripción del servicio</label>
              <md-textarea
                maxlength="400"
                v-model="servicio.descripcion"
              ></md-textarea>
            </md-field>
            <!-- /DESCRIPCION DEL SERVICIO -->

            <!-- UNIDADES DEL SERVICIO -->
            <md-field>
              <label>Unidades del servicio. Ej: Pulsaciones por minuto (ppm)</label>
              <md-input
                id="unidadesServicio"
                v-model="servicio.unidades"
              ></md-input>
            </md-field>
            <!-- /UNIDADES DEL SERVICIO -->

            <!-- ENTRAR -->
            <div class="button-container">
                <md-button class="md-raised md-accent align-right" @click="registrarServicio">Registrar</md-button>
            </div>
            <!-- /ENTRAR -->
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
  
<style>
.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>

  <script>
export default {
  components: {},
  name: "NuevoServicio",
  data: () => ({
    servicioRegistrado: false,
    servicio: {
      nombre: "",
      descripcion: "",
      unidades: "",
    },
  }),
  methods: {
    registrarServicio(){
        this.$model.addServicio(this.$user.id, this.servicio, this.$user.dni, 
        (err, res) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.servicioRegistrado = true
            this.servicio["_id"] = res;
            this.$emit('addServicioEvent', this.servicio);
          }
        });

    },
    resetServicio(){
      this.servicioRegistrado = false;
      this.servicio = {
        nombre: "",
        descripcion: "",
        unidades: "",
        }
    }
  }
};
</script>
  