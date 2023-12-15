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
                <router-link to="/">Home</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Edit User
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 d-flex justify-content-end">
        <router-link to="/" class="btn btn-primary ms-2">
          Random Button 1
        </router-link>
        <router-link to="/create-user" class="btn btn-secondary ms-2">
          Create a new user
        </router-link>
      </div>
    </div>

    <h6 class="mb-6 animate__animated animate__fadeInUp text-center display-5">
      Edit User
    </h6>
    <div class="card animate__animated animate__fadeIn">
      <div class="card-header bg-primary text-white">
        <h4 class="card-title"><i class="fas fa-user"></i> User Information</h4>
      </div>
      <div class="card-body">
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-envelope"></i>
            </span>
            <input
              v-model="editedUser.email"
              type="email"
              class="form-control"
              id="email"
              required
            />
          </div>
          <small v-if="!editedUser.email" class="text-danger"
            >Email is required.</small
          >
        </div>
        <!-- First Name and Last Name -->
        <div class="mb-3 row">
          <div class="col">
            <label for="first_name" class="form-label">First Name:</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                v-model="editedUser.first_name"
                type="text"
                class="form-control"
                id="first_name"
                required
              />
            </div>
            <small v-if="!editedUser.first_name" class="text-danger"
              >First Name is required.</small
            >
          </div>
          <div class="col">
            <label for="last_name" class="form-label">Last Name:</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                v-model="editedUser.last_name"
                type="text"
                class="form-control"
                id="last_name"
              />
            </div>
          </div>
        </div>
        <!-- Phone Number -->
        <div class="mb-3">
          <label for="phone_number" class="form-label">Phone Number:</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-phone"></i>
            </span>
            <input
              v-model="editedUser.phone_number"
              type="tel"
              class="form-control"
              id="phone_number"
            />
          </div>
        </div>
        <!-- Is Admin and Is Staff -->
        <div class="mb-3 row">
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_superuser"
                @change="updateIsStaff"
                type="checkbox"
                class="form-check-input"
                id="is_superuser"
              />
              <label class="form-check-label" for="is_superuser"
                >Is Admin</label
              >
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_staff"
                :disabled="editedUser.is_superuser"
                type="checkbox"
                class="form-check-input"
                id="is_staff"
              />
              <label class="form-check-label" for="is_staff">Is Staff</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Changes and Delete User buttons in the same row -->
    <div class="row mt-4">
      <div class="col-md-6">
        <button
          type="submit"
          class="btn btn-success animate__animated animate__fadeInUp"
          @click="updateUser"
        >
          <i class="fas fa-save me-1"></i> Save Changes
        </button>
      </div>
      <div class="col-md-6">
        <button
          type="button"
          class="btn btn-danger ms-2 animate__animated animate__fadeInUp"
          @click="deleteUser"
        >
          <i class="fas fa-trash me-1"></i> Delete User
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditUser",
  data() {
    return {
      userId: null,
      editedUser: {
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        is_superuser: false,
        is_staff: false,
        // Add more fields as needed
      },
    };
  },
  mounted() {
    this.userId = this.$route.params.id;
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      // Fetch user data based on the user ID from the backend
      axios
        .get(`/accounts/users/${this.userId}/`)
        .then((response) => {
          console.log("edit user response data", response.data);
          this.editedUser = response.data;
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    },
    updateIsStaff() {
      // Automatically check Is Staff if Is Admin is checked
      if (this.editedUser.is_superuser) {
        this.editedUser.is_staff = true;
      }
    },
    updateUser() {
      // Update user data using the put request
      if (confirm("Are you sure you want to update this user?")) {
        axios
          .put(`/accounts/users/update/${this.userId}/`, this.editedUser)
          .then((response) => {
            console.log("User updated successfully:", response.data);
            // Redirect to the user list page or perform other actions as needed
            location.reload();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      }
    },
    deleteUser() {
      // Confirm deletion with the user
      if (confirm("Are you sure you want to delete this user?")) {
        // Delete user data using the delete request
        axios
          .delete(`/accounts/users/delete/${this.userId}/`)
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
/* Example animation classes from animate.css */
.animate__animated {
  animation-duration: 1s;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

/* Add more custom styling as needed */
</style>
