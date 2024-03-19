<!-- AdminLTE3Starter.vue -->
<template>
  <div class="wrapper">
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="fas fa-home"></i>
          </router-link>
        </li>
      </ul>
      <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a href="#" class="nav-link" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
    <!-- Sidebar -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <!-- https://content.jdmagicbox.com/comp/bangalore/73/080ppe03673/catalogue/velankani-software-pvt-ltd-electronic-city-bangalore-computer-software-developers-2rgz2h5-250.jpg -->
      <a href="/" class="brand-link">
        <img
          src="https://content.jdmagicbox.com/comp/bangalore/73/080ppe03673/catalogue/velankani-software-pvt-ltd-electronic-city-bangalore-computer-software-developers-2rgz2h5-250.jpg"
          alt="AdminLTE Logo"
          class="brand-image img-circle elevation-3"
          style="opacity: 0.8"
        />
        <span class="brand-text font-weight-light">Velankani SFCS</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
        </div>
          <div class="info">
            <a href="#" class="d-block">Alexander Pierce</a>
          </div>
        </div> -->
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <!-- Accounts -->
            <li
              class="nav-item text-left"
              v-if="$store.state.user.is_superuser"
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>
                  Accounts
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/users" class="nav-link">
                    <i class="fas fa-user-plus nav-icon"></i>
                    <p>Users</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Store -->
            <li
              class="nav-item text-left"
              v-if="
                $store.state.user.is_superuser ||
                $store.state.user.is_store_team
              "
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-store"></i>
                <p>
                  Store
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/dashboard" class="nav-link">
                    <i class="fas fa-chart-line nav-icon"></i>
                    <p>Dashboard</p>
                  </router-link>
                </li>

                <li class="nav-item">
                  <router-link to="/checklist" class="nav-link">
                    <i class="fas fa-list-ul nav-icon"></i>
                    <p>Checklist</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/reports" class="nav-link">
                    <i class="fas fa-chart-bar nav-icon"></i>
                    <p>Reports</p>
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- Orders -->

            <li
              class="nav-item text-left"
              v-if="
                $store.state.user.is_superuser ||
                $store.state.user.is_design_team
              "
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-shopping-cart"></i>
                <p>
                  Orders
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/orders" class="nav-link">
                    <i class="fas fa-receipt nav-icon"></i>
                    <p>Orders</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- material management -->

            <li
              class="nav-item text-left"
              v-if="
                $store.state.user.is_superuser ||
                $store.state.user.is_design_team
              "
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-industry"></i>
                <p>
                  Material Management
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/bom" class="nav-link">
                    <i class="fas fa-clipboard-list nav-icon"></i>
                    <p>Bill Of Materials</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/projects" class="nav-link">
                    <i class="fas fa-project-diagram nav-icon"></i>
                    <p>Projects</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <li
              class="nav-item text-left"
              v-if="
                $store.state.user.is_superuser ||
                $store.state.user.is_design_team
              "
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-clipboard-check"></i>
                <p>
                  IQC
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/iqc" class="nav-link">
                    <i class="fas fa-tasks nav-icon"></i>
                    <p>IQC Checklist</p>
                  </router-link>
                </li>
              </ul>
            </li>
            <li
              class="nav-item text-left"
              v-if="$store.state.user.is_superuser"
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-tag"></i>
                <p>
                  Pricing
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/project-pricing" class="nav-link">
                    <i class="fas fa-money-bill nav-icon"></i>
                    <p>Project Pricing Details</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <li
              class="nav-item text-left"
              v-if="
                $store.state.user.is_superuser ||
                $store.state.user.is_machine_maintenance_supervisor_team ||
                $store.state.user.is_machine_maintenance_staff_team
              "
            >
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-cogs"></i>
                <p>
                  Machine Management
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li
                  class="nav-item"
                  v-if="
                    $store.state.user.is_superuser ||
                    $store.state.user.is_machine_maintenance_supervisor_team
                  "
                >
                  <router-link to="/machine/plan-creation" class="nav-link">
                    <i class="fa fa-calendar-alt nav-icon"></i>
                    <p>Plan Creation</p>
                  </router-link>
                </li>

                <li
                  class="nav-item"
                  v-if="
                    $store.state.user.is_superuser ||
                    $store.state.user.is_machine_maintenance_supervisor_team
                  "
                >
                  <router-link
                    to="/machine/calendar-yearly-view"
                    class="nav-link"
                  >
                    <i class="fas fa-calendar-alt nav-icon"></i>
                    <p>Supervisor Plan</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link
                    to="/machine/mark-maintenance-plan"
                    class="nav-link"
                  >
                    <i class="fas fa-calendar-xmark nav-icon"></i>
                    <p>Mark Worker Maintenance</p>
                  </router-link>
                </li>
                <li
                  class="nav-item"
                  v-if="
                    $store.state.user.is_superuser ||
                    $store.state.user.is_machine_maintenance_supervisor_team
                  "
                >
                  <router-link to="/machine/report-generation" class="nav-link">
                    <i class="fas fa-file-excel nav-icon"></i>
                    <p>Report Generation</p>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper" v-if="showLogInModal">
      <RestrictedAccess
        @closeLogInModal="handleCloseLogInModal"
        :show="showLogInModal"
      />
    </div>
    <div v-else class="content-wrapper">
      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->
  </div>
</template>

<script>
import axios from "axios";
import RestrictedAccess from "@/components/RestrictedAccess.vue";
export default {
  data() {
    return {
      showLogInModal: false,
    };
  },
  mounted() {
    this.checkLogin();
  },
  components: {
    RestrictedAccess,
  },
  methods: {
    async logout() {
      await axios
        .post("token/logout/")
        .then((response) => {
          console.log("Logged out", response.data);
          this.$store.commit("removeToken");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async checkLogin() {
      await axios
        .get("accounts/check-login")
        .then((response) => {
          if (response.status === 200) {
            this.showLogInModal = false;
          } else {
            this.showLogInModal = true;
          }
        })
        .catch((error) => {
          console.error("Error in API call:", error);
          this.showLogInModal = true;
          localStorage.removeItem("token");
          this.$store.commit("removeToken");
        });
    },
    handleCloseLogInModal() {
      this.showLogInModal = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
