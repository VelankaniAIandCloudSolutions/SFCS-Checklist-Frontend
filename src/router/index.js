import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../views/LoginForm.vue'
import UploadBom from '../views/UploadBom.vue'

const routes = [
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/bom',
    name: 'UploadBom',
    component:UploadBom
  },

];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
export default router
  