import axios from "axios";
import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      token: "",
      isAuthenticated: false,
      username: "",
      password: "",
    },
    isLoading: false,
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem("token")) {
        state.user.token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] =
          "Token " + state.user.token;
        state.user.isAuthenticated = true;
      } else {
        state.user.token = "";

        state.user.isAuthenticated = false;
      }
      state.isLoading = false;
    },
    setToken(state, token) {
      state.user.token = token;
      axios.defaults.headers.common["Authorization"] =
        "Token " + state.user.token;
      state.user.isAuthenticated = true;
    },
    setIsLoading(state, status) {
      state.isLoading = status;
    },

    removeToken(state) {
      state.user.token = "";
      state.user.profile = {};
      state.user.isAuthenticated = false;
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
    },
    setAuthentication(state, isAuthenticated) {
      state.user.isAuthenticated = isAuthenticated;
    },
  },
  actions: {},
  modules: {},
});
store.commit("initializeStore");
export default store;
