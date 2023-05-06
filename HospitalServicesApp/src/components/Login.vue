<template>
  <div id="login">
    <md-card>
      <md-card-header>
        <div class="md-title">Login</div>
        <md-progress-bar class="md-accent" md-mode="query" v-if="loading">
        </md-progress-bar>
      </md-card-header>
      <md-card-content>
        <div class="form">
          <!-- DNI -->
          <md-field md-inline>
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
      id: {
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
        (err, token, form) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.$set(this.$user, "token", token);
            for (var att in form) this.$set(this.$user, att, form[att]);
          }
        }
      );
      console.log(this.form);
    },
  },
};
</script>
  
  <style>
#login {
  margin: 20%;
}
</style>
  