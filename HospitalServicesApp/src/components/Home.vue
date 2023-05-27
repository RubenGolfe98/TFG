<template>
  <div id="home">
    <h1>Bienvenido a la aplicación web de seguimiento de pacientes</h1>

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
  </div>
</template>
  
<style>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh; /* Ajusta la altura según tus necesidades */
}
</style>

<script>

export default {
  components: {},
  props: ["user"],
  name: "Home",
  data() {
    return {};
  },
};
</script>
