import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../views/LoginForm.vue";
import UploadBom from "../views/UploadBom.vue";
import BomLanding from "../views/BomLanding.vue";
import BomLineLevel from "../views/BomLineLevel.vue";
import CheckList from "../views/CheckList.vue";
import BeginCheckList from "../views/BeginCheckList.vue";
import BeginCheckListNew from "../views/BeginCheckListNew.vue";
import GeneratedCheckList from "../views/GeneratedCheckList.vue";
import ChecklistDetails from "../views/ChecklistDetails.vue";
import ReportsList from "../views/ReportsList.vue";
import CheckListsDashboard from "../views/CheckListsDashboard.vue";
import ChecklistReport from "../views/ChecklistReport.vue";
import UserManagement from "../views/UserManagement.vue";
import BomLineItemEdit from "../views/BomLineItemEdit.vue";
import EditUser from "../components/EditUser.vue";
import CreateUser from "../components/CreateUser.vue";
import OrdersLanding from "../views/OrdersLanding.vue";
import OrderCreation from "../views/OrderCreation.vue";
import ProjectsLanding from "../views/ProjectsLanding.vue";
import ProjectEdit from "../views/ProjectEdit.vue";
import CreateProject from "../components/CreateProject.vue";
import ProductEdit from "../views/ProductEdit.vue";
import CheckListOrderBased from "../views/CheckListOrderBased.vue";
import IqcLanding from "../views/IqcLanding.vue";
import IqcForChecklist from "../views/IqcForChecklist.vue";
import ProjectPricing from "../views/ProjectPricing.vue";
import CalendarMonthlyView from "../views/machine_maintenance/CalendarMonthlyView.vue";
import CreateMaintenanceCalendar from "../views/machine_maintenance/CreateMaintenanceCalendar.vue";
import MarkMaintenancePlan from "../views/machine_maintenance/MarkMaintenancePlan.vue";
import CalendarYearlyView from "../views/machine_maintenance/CalendarYearlyView.vue";
import ReportGeneration from "../views/machine_maintenance/ReportGeneration.vue";
import PlanCreation from "@/views/machine_maintenance/PlanCreation.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: CheckListsDashboard,
  },
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
    name: "CheckListOrderBased",
    component: CheckListOrderBased,
    props: true,
  },
  {
    path: "/reports",
    name: "ReportsList",
    component: ReportsList,
  },
  {
    path: "/dashboard",
    name: "CheckListsDashboard",
    component: CheckListsDashboard,
  },
  {
    path: "/checklist-report",
    name: "ChecklistReport",
    component: ChecklistReport,
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
    path: "/begin-checklist-new/:id",
    name: "begin-checklist-new",
    component: BeginCheckListNew,
    props: true, // This allows the route params to be passed as props to the component
  },

  {
    path: "/generated-checklists/:id",
    name: "generated-checklist",
    component: GeneratedCheckList,
    props: true, // This allows the route params to be passed as props to the component
  },
  {
    path: "/checklist-details/:id",
    name: "checklist-details",
    component: ChecklistDetails,
    props: true, // This allows the route params to be passed as props to the component
  },

  {
    path: "/users",
    name: "users",
    component: UserManagement,
  },
  {
    path: "/users/edit-user/:id",
    name: "EditUser",
    component: EditUser,
  },
  {
    path: "/users/create-user",
    name: "CreateUser",
    component: CreateUser,
  },
  {
    path: "/bom-line-item/edit/:id",
    name: "BomLineItemEdit",
    component: BomLineItemEdit,
    props: (route) => ({ bom_id: route.params.id }), // Rename 'id' to 'bom_id'
  },
  {
    path: "/orders",
    name: "OrdersLanding",
    component: OrdersLanding,
  },
  {
    path: "/orders/create",
    name: "OrderCreation",
    component: OrderCreation,
  },
  {
    path: "/projects",
    name: "ProjectsLanding",
    component: ProjectsLanding,
  },
  {
    path: "/projects/create-project",
    name: "CreateProject",
    component: CreateProject,
  },
  {
    path: "/project-edit/:id",
    name: "ProjectEdit",
    component: ProjectEdit,
    props: true,
  },
  {
    path: "/product/edit/:id",
    name: "ProductEdit",
    component: ProductEdit,
    props: true,
  },
  {
    path: "/new",
    name: "CheckList",
    component: CheckList,
    props: true,
  },
  {
    path: "/iqc",
    name: "IqcLanding",
    component: IqcLanding,
    props: true,
  },
  {
    path: "/iqc-for-checklist/:id",
    name: "IqcForChecklist",
    component: IqcForChecklist,
    props: true,
  },
  {
    path: "/project-pricing",
    name: "ProjectPricing",
    component: ProjectPricing,
  },

  {
    path: "/machine/create-maintenance-calendar",
    name: "CreateMaintenanceCalendar",
    component: CreateMaintenanceCalendar,
  },
  {
    path: "/machine/mark-maintenance-plan",
    name: "MarkMaintenancePlan",
    component: MarkMaintenancePlan,
  },

  {
    path: "/machine/calendar-yearly-view",
    name: "CalendarYearlyView",
    component: CalendarYearlyView,
  },
  {
    path: "/machine/report-generation",
    name: "ReportGeneration",
    component: ReportGeneration,
  },
  {
    path: "/calendar-monthly-view",
    name: "CalendarMonthlyView",
    component: CalendarMonthlyView,
    props: (route) => ({
      lineId: route.query.lineId,
      machineId: route.query.machineId,
    }),
  },

  {
    path: "/machine/plan-creation",
    name: "PlanCreation",
    component: PlanCreation,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
