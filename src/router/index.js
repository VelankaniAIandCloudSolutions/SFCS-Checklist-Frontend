import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../views/LoginForm.vue";
import UploadBom from "../views/UploadBom.vue";
import BomLanding from "../views/BomLanding.vue";
import BomLineLevel from "../views/BomLineLevel.vue";
import CheckList from "../views/CheckList.vue";
import BeginCheckList from "../views/BeginCheckList.vue";
import GeneratedCheckList from "../views/GeneratedCheckList.vue";

const routes = [
  {
    path: "/login",
    name: "LoginForm",
    component: LoginForm,
  },
  {
    path: "/bom",
    name: "BomLanding",
    component: BomLanding,
  },
  {
    path: "/bom/upload",
    name: "UploadBom",
    component: UploadBom,
  },
  {
    path: "/CheckList",
    name: "CheckList",
    component: CheckList,
  },

  {
    path: "/bom/edit/:id",
    name: "BomLineLevel",
    component: BomLineLevel,
    props: true,
  },
  {
    path: "/begin-checklist/:id",
    name: "begin-checklist",
    component: BeginCheckList,
    props: true, // This allows the route params to be passed as props to the component
  },

  {
    path: "/generated-checklist/:id",
    name: "generated-checklist",
    component: GeneratedCheckList,
    props: true, // This allows the route params to be passed as props to the component
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
