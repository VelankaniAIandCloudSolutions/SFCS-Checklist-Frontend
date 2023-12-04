import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: {
      token: '',
      isAuthenticated: false,
      username:'',
      password:''
    },
    isLoading: false,

  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('token')) {
        state.user.token = localStorage.getItem('token');
        const storedProfile = localStorage.getItem('profile');
        state.user.profile = storedProfile ? JSON.parse(storedProfile) : {};
        state.user.isAuthenticated = true;
      } else {
        state.user.token = '';
        state.user.profile = {};
        state.user.isAuthenticated = false;
      }

    },
    setToken(state, token) {
      state.user.token = token
      state.user.isAuthenticated = true
    },   setIsLoading(state, status) {
      state.isLoading = status
    },
    setProfile(state, profile) {
      state.user.profile = profile
    },
    removeToken(state) {
      state.user.token = ''
      state.user.profile = {}
      state.user.isAuthenticated = false
    },
  },
  actions: {
  },
  modules: {
  }
})

export default store;
store.dispatch('initStore');