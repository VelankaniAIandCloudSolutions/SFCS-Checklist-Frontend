import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/js/bootstrap.js";
import router from './router';
import store from './store';
import axios from 'axios';
import Notifications from '@kyvg/vue3-notification';

// if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:8000/api/v1/';
//   } 
//   else {
//     axios.defaults.baseURL = 'http://65.0.76.37:8000/api/v1/';
//   }
  
const app = createApp(App);

app.use(store).use(router).use(Notifications);

app.mount('#app');
