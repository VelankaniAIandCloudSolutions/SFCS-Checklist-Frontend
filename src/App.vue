<template>
  <div id="app">
    <div v-if="activeRoute.startsWith('/login')">
      <LoginForm />
      <!-- <router-view style="margin-top: 70px;" /> -->
    </div>
    <div v-else>
      <AdminLte />
    </div>
  </div>
  <!-- <notifications position="bottom right" classes="alert" /> -->
</template>

<script>
import AdminLte from "./views/AdminLte.vue";
import LoginForm from "./views/LoginForm.vue";
export default {
  name: "App",
  components: {
    LoginForm,
    AdminLte,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  computed: {
    activeRoute() {
      return this.$route.path;
    },
  },
  methods: {},
};
</script>
import

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
