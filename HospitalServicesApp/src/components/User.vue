<template>
  <div id="user">
    <h1>Información del usuario</h1>
    <md-dialog-alert
      :md-active.sync="passwordRegistrada"
      md-title="Contraseña cambiada!"
      :md-content="'Se ha establecido una nueva contraseña'"
      @md-closed="resetPassword"
    />
    <md-card>
      <md-card-header class="text-center">
        <div class="centered-icon">
          <md-icon class="md-size-3x">person</md-icon>
        </div>
      </md-card-header>
      <md-card-content>
        <div class="container">
          <!-- DNI -->
          <md-field class="max-width">
            <label>DNI</label>
            <md-input :disabled="true" id="dni" v-model="user.dni"></md-input>
          </md-field>
          <!-- /DNI -->

          <!-- NOMBRE -->
          <md-field class="max-width">
            <label>Nombre</label>
            <md-input :disabled="true" id="id" v-model="user.nombre"></md-input>
          </md-field>
          <!-- /NOMBRE -->

          <!-- APELLIDO1 -->
          <md-field class="max-width">
            <label>Primer apellido</label>
            <md-input
              :disabled="true"
              id="id"
              v-model="user.apellido1"
            ></md-input>
          </md-field>
          <!-- /APELLIDO1 -->

          <!-- APELLIDO2 -->
          <md-field class="max-width">
            <label>Segundo apellido</label>
            <md-input
              :disabled="true"
              id="id"
              v-model="user.apellido2"
            ></md-input>
          </md-field>
          <!-- /APELLIDO2 -->

          <!-- PASSWORD -->
          <md-field class="max-width">
            <label>Password</label>
            <md-input v-model="newPassword" type="password"></md-input>
          </md-field>
          <div class="button-container">
            <md-button class="md-raised md-accent" @click="cambiarPassword">Cambiar contraseña</md-button>
          </div>
          <!-- /PASSWORD -->
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
  
<style>
.centered-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
  
  <script>
export default {
  components: {},
  name: "User",
  data() {
    return {
      user: this.$user,
      newPassword: "",
      passwordRegistrada: false
    };
  },
  methods: {
    cambiarPassword() {
      this.$model.updatePassword(
        this.$user.id,
        this.newPassword,
        (err, newPassword) => {
          if (err) {
            alert("Error" + err.stack);
          }else{
            this.passwordRegistrada = true;
          }
        }
      );
      
    },
    resetPassword(){
        this.newPassword = "";
        this.passwordRegistrada = false;
    }
  },
};
</script>
<style>
.max-width {
  max-width: 400px; /* El valor del ancho máximo que desees */
}
.container {
  position: relative;
}

</style>