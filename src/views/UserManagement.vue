<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Users</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i> Home</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-users me-1"></i>Users
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->

      <div class="col-md-6 mt-4 text-end">
        <!-- <div class="container has-text-centered"> -->
        <router-link
          to="/users/create-user"
          class="btn btn-primary btn-sm ms-2"
        >
          <i class="fas fa-user-plus me-1"></i> Create New User
        </router-link>
      </div>
    </div>
    <div class="container mt-5">
      <!-- <h2 class="mb-4"><i class="fas fa-list-ul me-2"></i> User List</h2> -->
      <table class="table table-hover">
        <thead>
          <tr>
            <!-- <th>ID</th> -->
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in userList"
            :key="user.id"
            @click="redirectToEditPage(user.id)"
          >
            <!-- <td>{{ user.id }}</td> -->
            <td>{{ user.email }}</td>
            <td>
              <router-link
                :to="{ name: 'EditUser', params: { id: user.id } }"
                class="btn btn-primary btn-sm"
              >
                <i class="fas fa-edit me-1"></i> Edit
              </router-link>
              <button
                @click="deleteUser(user.id)"
                class="btn btn-danger btn-sm ml-3"
              >
                <i class="fas fa-trash-alt me-1"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserManagement",
  data() {
    return {
      userList: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios
        .get("/accounts/users/")
        .then((response) => {
          console.log("response.data", response.data);
          this.userList = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    redirectToEditPage(userId) {
      this.$router.push({ name: "EditUser", params: { id: userId } });
    },
    deleteUser(userId) {
      // Confirm deletion with the user
      if (confirm("Are you sure you want to delete this user?")) {
        // Delete user data using the delete request
        axios
          .delete(`/accounts/users/delete/${userId}/`)
          .then(() => {
            console.log("User deleted successfully.");
            alert("User Deleted successfully!");
            // Redirect to the user list page or perform other actions as needed
            this.$router.push("/users");
          })
          .catch((error) => {
            alert("error deleting!");
            console.error("Error deleting user:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
.table {
  cursor: pointer;
}

.table tr:hover {
  background-color: #f5f5f5;
}
</style>
