<template>
  <div id="app">
    <md-card>
      <md-card-header>
        <div class="md-title">Login</div>
        <md-progress-bar
          class="md-accent"
          md-mode="query"
          v-if="loading"
        ></md-progress-bar>
      </md-card-header>
      <md-card-content>
        <div class="form">
          <!-- ID -->
          <md-field md-inline>
            <label>DNI</label>
            <md-input v-model="user.id"></md-input>
          </md-field>
          <!-- /ID -->

          <!-- PASSWORD -->
          <md-field>
            <label>Password toggle</label>
            <md-input v-model="user.password" type="password"></md-input>
          </md-field>
          <!-- /PASSWORD -->

          <!-- DOCTOR -->
          <md-switch v-model="user.doctor">Iniciar sesión como Doctor</md-switch
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
export default {
  name: "App",
  data: () => ({
    loading: false,
    user: {
      name: "",
      surname: "",
      id: "",
      doctor: false,
      password: "",
    },
  }),
  methods: {
    enter() {
      console.log(this.$user);
      console.log("Login");
      this.$model.login(
        this.user.id,
        this.user.password,
        (err, token, user) => {
          if (err) {
            alert("Error" + err.stack);
          } else {
            this.$set(this.$user, "635941a903e705b3b405d93a", token);
            for (var att in user) this.$set(this.$user, att, user[att]);
          }
        }
      );
      console.log(this.user);
    }
  },
};
</script>

<style>
#app {
  margin: 20%;
}
</style>
