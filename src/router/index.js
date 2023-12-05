import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../views/LoginForm.vue'
import UploadBom from '../views/UploadBom.vue'
import BomLanding from '../views/BomLanding.vue'

const routes = [
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/bom',
    name: 'BomLanding',
    component:BomLanding
  },
  {
    path: '/bom/upload',
    name: 'UploadBom',
    component:UploadBom
  },

];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
export default router
  