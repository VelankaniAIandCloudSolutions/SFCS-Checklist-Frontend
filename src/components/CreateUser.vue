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
                  ><i class="fas fa-home me-1"></i>Home</router-link
                >
              </li>
              <li class="breadcrumb-item">
                <router-link to="/users"
                  ><i class="fas fa-users me-1"></i>Users</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa fa-user-plus"></i>
                Create User
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-success btn-sm"
          @click="createUser"
        >
          <i class="fas fa-save me-1"></i> Create User
        </button>
      </div>
    </div>

    <div class="card animate__animated animate__fadeIn mt-5">
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
              v-model="newUser.email"
              type="email"
              class="form-control"
              id="email"
              required
            />
          </div>
          <small v-if="!newUser.email && formSubmitted" class="text-danger">
            Email is required.
          </small>
        </div>
        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-lock"></i>
            </span>
            <input
              v-model="newUser.password"
              type="password"
              class="form-control"
              id="password"
              required
              @focus="clearPasswordError"
            />
          </div>
          <small v-if="!newUser.password && formSubmitted" class="text-danger">
            Password is required.
          </small>
          <!-- Display error message here -->
          <div v-if="passwordAuthenticationError" class="text-danger">
            <strong
              ><i class="fas fa-exclamation-triangle"></i>
              {{ passwordAuthenticationError }}</strong
            >
          </div>
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
                v-model="newUser.first_name"
                type="text"
                class="form-control"
                id="first_name"
                required
              />
            </div>
            <small
              v-if="!newUser.first_name && formSubmitted"
              class="text-danger"
            >
              First Name is required.
            </small>
          </div>
          <div class="col">
            <label for="last_name" class="form-label">Last Name:</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                v-model="newUser.last_name"
                type="text"
                class="form-control"
                id="last_name"
                required
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
              v-model="newUser.phone_number"
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
                v-model="newUser.is_superuser"
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
                v-model="newUser.is_staff"
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateUser",
  data() {
    return {
      newUser: {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        is_superuser: false,
        is_staff: false,
        // Add more fields as needed
      },
      formSubmitted: false,
      passwordAuthenticationError: null,
    };
  },
  methods: {
    createUser() {
      // Set formSubmitted to true before creating a new user
      this.formSubmitted = true;
      // Reset passwordAuthenticationError
      this.passwordAuthenticationError = null;

      // Check if the form is valid before creating a new user
      if (
        this.newUser.email &&
        this.newUser.password &&
        this.newUser.first_name
      ) {
        // Create a new user using the post request
        axios
          .post("/accounts/users/create/", this.newUser)
          .then((response) => {
            console.log("User created successfully:", response.data);
            // Use the notify action to display a success message
            // Display a success message
            alert("User created successfully!");
            // Redirect to the user list page or perform other actions as needed
            this.$router.push("/users");
          })
          .catch((error) => {
            // Check if the error is related to password authentication
            if (error.response && error.response.data.password) {
              // Set the passwordAuthenticationError message
              this.passwordAuthenticationError =
                error.response.data.password[0];
            } else {
              console.error("Error creating user:", error);
            }
          });
      }
    },
    clearPasswordError() {
      // Clear the passwordAuthenticationError when the password field gains focus
      this.passwordAuthenticationError = null;
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
