import axios from "axios";
import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      token: "",
      isAuthenticated: false,
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      is_staff: false,
      is_superuser: false,
      is_store_team: false,
      is_design_team: false,
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
        // Check for user details in local storage
        const userDetailsString = localStorage.getItem("userDetails");
        if (userDetailsString) {
          // Parse the JSON string and set properties in state
          const userDetails = JSON.parse(userDetailsString);
          state.user.first_name = userDetails.first_name;
          state.user.last_name = userDetails.last_name;
          state.user.is_staff = userDetails.is_staff;
          state.user.is_superuser = userDetails.is_superuser;
          state.user.is_store_team = userDetails.is_store_team;
          state.user.is_design_team = userDetails.is_design_team;
        }
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

    setUserDetails(state, userDetails) {
      state.user.first_name = userDetails.first_name;
      state.user.last_name = userDetails.last_name;
      state.user.is_staff = userDetails.is_staff; // Assuming the API response has an 'is_staff' field
      state.user.is_superuser = userDetails.is_superuser; // Assuming the API response has an 'is_superuser' field
      state.user.is_store_team = userDetails.is_store_team; // Assuming the API response has an 'is_store_team' field
      state.user.is_design_team = userDetails.is_design_team; // Assuming the API response has an 'is_design_team' field
    },

    setIsLoading(state, status) {
      state.isLoading = status;
    },

    removeToken(state) {
      state.user.token = "";
      state.user.first_name = "";
      state.user.last_name = "";
      state.user.is_staff = false;
      state.user.is_superuser = false;
      state.user.is_store_team = false;
      state.user.is_design_team = false;
      // state.user.state.user.profile = {};
      state.user.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
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
