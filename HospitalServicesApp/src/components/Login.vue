<template>
  <div id="login">
    <div class="table-container">
      <table>
        <tr>
          <td>
            <md-icon class="md-size-5x">local_hospital</md-icon>
          </td>
          <td>
            <md-icon class="md-size-5x">notifications</md-icon>
          </td>
        </tr>
        <tr>
          <td>
            <md-icon class="md-size-5x">supervisor_account</md-icon>
          </td>
          <td>
            <md-icon class="md-size-5x">medical_information</md-icon>
          </td>
        </tr>
      </table>
    </div>
    <md-card>
      <md-card-header>
        <div class="md-title">Login</div>
        <md-progress-bar class="md-accent" md-mode="query" v-if="loading">
        </md-progress-bar>
      </md-card-header>
      <md-card-content>
        <div class="form">
          <!-- DNI -->
          <md-field md-inline >
            <label>DNI</label>
            <md-input id="dni" v-model="form.dni"></md-input>
          </md-field>
          <!-- /DNI -->

          <!-- PASSWORD -->
          <md-field>
            <label>Password</label>
            <md-input v-model="form.password" type="password"></md-input>
          </md-field>
          <!-- /PASSWORD -->

          <!-- DOCTOR -->
          <md-switch v-model="form.esSanitario">Iniciar sesión como Sanitario</md-switch
          ><br />
          <!-- /DOCTOR -->

          <!-- ENTRAR -->
          <md-button class="md-raised md-accent" @click="enter"
            >Iniciar sesión</md-button
          >
          <!-- /ENTRAR -->
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
  
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators";

export default {
  name: "Login",
  mixins: [validationMixin],
  data: () => ({
    loading: false,
    emptyForm: false,
    form: {
      dni: "",
      esSanitario: false,
      password: "",
    },
  }),
  validations: {
    form: {
      dni: {
        required,
      }
    },
  },
  methods: {
    enter() {
      console.log(this.$user);
      console.log("Login");
      this.$model.login(
        this.form.dni,
        this.form.password,
        this.form.esSanitario,
        (err, token, usuario) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.$set(this.$user, "token", token);
            for (var att in usuario) this.$set(this.$user, att, usuario[att]);
            localStorage.setItem('user', JSON.stringify(this.$user));
            console.log("Usuario logeado");
          }
        }
      );
      
    },
  },
};
</script>
  
  <style>
  .table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh; /* Ajusta la altura según tus necesidades */
}
#login {
  margin: 20%;
}
.max-width {
  max-width: 300px; /* El valor del ancho máximo que desees */
}
</style>