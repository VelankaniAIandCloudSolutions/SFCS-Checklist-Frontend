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
            <li class="nav-item text-left">
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
                    <i class="far fa-circle nav-icon"></i>
                    <p>Users</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Store -->
            <li class="nav-item text-left">
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
                    <i class="far fa-circle nav-icon"></i>
                    <p>Dashboard</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/bom" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Bill Of Materials</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/checklist" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Checklist</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/reports" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Reports</p>
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
    <div class="content-wrapper">
      <!-- Your Vue component content goes here -->
      <div v-if="$store.state.isLoading">
        <div class="text-center mt-6">
          <div
            class="spinner-border"
            style="width: 5rem; height: 5rem"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else>
        <router-view></router-view>
      </div>
    </div>
    <!-- /.content-wrapper -->
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // Your logout logic goes here
      // Your logout logic goes here
      this.$store.commit("removeToken"); // Assuming you have a mutation named 'setAuthentication' in your store
      // Reload the entire application to navigate to the login page as a fresh page
      window.location.href = "/login";
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
