import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/js/bootstrap.js";
import router from './router';
import store from './store';
import axios from 'axios';
import Notifications from '@kyvg/vue3-notification';
import '@fortawesome/fontawesome-free/css/all.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/jquery/jquery.min.js';
import 'admin-lte/dist/js/adminlte.min.js';
// if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:8000/api/v1/';
//   } 
//   else {
//     axios.defaults.baseURL = 'http://65.0.76.37:8000/api/v1/';
//   }
  
const app = createApp(App);

app.use(store).use(router).use(Notifications);

app.mount('#app');
