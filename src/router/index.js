import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../views/LoginForm.vue'
import UploadBom from '../views/UploadBom.vue'
import BomLanding from '../views/BomLanding.vue'
import BomLineLevel from '../views/BomLineLevel.vue'
import CheckList from '../views/CheckList.vue'
import BeginCheckList from '../views/BeginCheckList.vue'

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
  {
    path: '/CheckList',
    name: 'CheckList',
    component:CheckList
  },
  {
    path: '/begin-checklist',
    name: 'BeginCheckList',
    component:BeginCheckList
  },
  {
    path: '/bom/edit/:id',
    name: 'BomLineLevel',
    component: BomLineLevel,
    props: true, // Pass route params as props to the component
  },


];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
export default router
  