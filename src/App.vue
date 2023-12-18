<template>
  <div>
    <div id="app" v-if="!$store.state.user.isAuthenticated">
      <LoginForm />
    </div>
    <div v-else>
      <AdminLte />
    </div>
    <notifications position="bottom right" classes="alert" />
  </div>
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
