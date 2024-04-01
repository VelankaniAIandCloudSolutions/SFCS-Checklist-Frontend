<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
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
              <li class="breadcrumb-item">
                <router-link to="/users"
                  ><i class="fas fa-users me-1"></i> Users</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-edit me-1"></i>
                Edit User
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- buttons to the right -->
      <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          @click="updateUser"
        >
          <i class="fas fa-save me-1"></i> Update User
        </button>
        <button
          type="button"
          class="btn btn-danger ms-2 btn-sm"
          @click="deleteUser"
        >
          <i class="fas fa-trash me-1"></i> Delete User
        </button>
      </div>
    </div>

    <div class="card animate__animated animate__fadeIn mt-5">
      <div class="card-header bg-primary text-white">
        <h4 class="card-title">
          <i class="fas fa-user me-1"></i> User Information
        </h4>
        <div class="card-tools">
          <!-- Buttons, labels, and many other things can be placed here! -->
          <!-- Here is a label for example -->
          <button
            type="button"
            class="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#changePasswordModal"
          >
            <i class="fas fa-key me-1"></i> Edit Password
          </button>
        </div>
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
                @change="updateOthers"
                type="checkbox"
                class="form-check-input"
                id="is_superuser"
              />
              <label class="form-check-label" for="is_superuser"
                ><i class="fas fa-user-shield me-1"></i> Is Admin</label
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
              <label class="form-check-label" for="is_staff"
                ><i class="fas fa-user-cog me-1"></i> Is Staff</label
              >
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_store_team"
                :disabled="editedUser.is_superuser"
                type="checkbox"
                class="form-check-input"
                id="is_store_team"
              />
              <label class="form-check-label" for="is_store_team"
                ><i class="fas fa-user-shield me-1"></i> Is Store Team</label
              >
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_design_team"
                :disabled="editedUser.is_superuser"
                type="checkbox"
                class="form-check-input"
                id="is_design_team"
              />
              <label class="form-check-label" for="is_design_team"
                ><i class="fas fa-user-cog me-1"></i> Is Design Team</label
              >
            </div>
          </div>
        </div>

        <div class="mb-3 row">
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_machine_maintenance_supervisor_team"
                :disabled="editedUser.is_superuser"
                type="checkbox"
                class="form-check-input"
                id="is_machine_maintenance_supervisor_team"
              />
              <label class="form-check-label" for="is_store_team"
                ><i class="fas fa-user-shield me-1"></i> Is Machine Maintenance
                Supervisor</label
              >
            </div>
          </div>
          <div class="col">
            <div class="form-check">
              <input
                v-model="editedUser.is_machine_maintenance_staff_team"
                :disabled="editedUser.is_superuser"
                type="checkbox"
                class="form-check-input"
                id="is_machine_maintenance_staff_team"
              />
              <label class="form-check-label" for="is_design_team"
                ><i class="fas fa-user-cog me-1"></i> Is Machine Maintenance
                Staff Team
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  Password Change Modal -->
    <div
      class="modal fade"
      id="changePasswordModal"
      tabindex="-1"
      aria-labelledby="changePasswordModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="changePasswordModal">
              Change Password
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <section class="modal-body">
              <form id="changePasswordForm">
                <!-- Old Password -->
                <div class="mb-3">
                  <label for="oldPassword" class="form-label"
                    >Old Password</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      v-model="oldPassword"
                      :type="showOldPassword ? 'text' : 'password'"
                      class="form-control"
                      id="oldPassword"
                      name="oldPassword"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="toggleOldPassword"
                    >
                      <i
                        :class="
                          showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <small v-if="passwordError" class="text-danger">{{
                    passwordError
                  }}</small>
                </div>

                <!-- New Password -->
                <div class="mb-3">
                  <label for="newPassword" class="form-label"
                    >New Password</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      v-model="newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="form-control"
                      id="newPassword"
                      name="newPassword"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="toggleNewPassword"
                    >
                      <i
                        :class="
                          showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <small v-if="newPasswordError" class="text-danger">{{
                    newPasswordError
                  }}</small>
                </div>
              </form>
            </section>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="changePassword"
            >
              Save changes
            </button>
          </div>
        </div>
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
        is_store_team: false,
        is_design_team: false,
        is_machine_maintenance_supervisor_team: false,
        is_machine_maintenance_staff_team: false,
        oldPassword: "",
        newPassword: "",
        passwordError: "",
        newPasswordError: "",
      },
      showOldPassword: false,
      showNewPassword: false,
    };
  },
  mounted() {
    this.userId = this.$route.params.id;
    this.fetchUserData();
  },
  methods: {
    toggleNewPassword() {
      console.log("hiii");
      this.showNewPassword = !this.showNewPassword;
      console.log("value after", this.showNewPassword);
    },
    toggleOldPassword() {
      console.log("olds");
      this.showOldPassword = !this.showOldPassword;
      console.log("value after toggling", this.showOldPassword);
    },
    fetchUserData() {
      // Fetch user data based on the user ID from the backend
      this.$store.commit("setIsLoading", true);
      axios
        .get(`/accounts/users/${this.userId}/`)
        .then((response) => {
          console.log("edit user response data", response.data);
          this.editedUser = response.data;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          this.$store.commit("setIsLoading", false);
          console.error("Error fetching user data:", error);
        });
    },
    updateOthers() {
      // Automatically check Is Staff if Is Admin is checked
      if (this.editedUser.is_superuser) {
        this.editedUser.is_staff = true;
        this.editedUser.is_store_team = true;
        this.editedUser.is_design_team = true;
        this.editedUser.is_machine_maintenance_supervisor_team = true;
        this.editedUser.is_machine_maintenance_staff_team = true;
      }
    },
    updateUser() {
      // Update user data using the put request
      if (confirm("Are you sure you want to update this user?")) {
        this.$store.commit("setIsLoading", true);
        axios
          .put(`/accounts/users/update/${this.userId}/`, this.editedUser)
          .then((response) => {
            console.log("User updated successfully:", response.data);
            // Redirect to the user list page or perform other actions as needed
            this.$store.commit("setIsLoading", false);
            alert("User Updated successfully!");
            // location.reload();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            this.$store.commit("setIsLoading", false);
          });
      }
    },
    deleteUser() {
      // Confirm deletion with the user
      if (confirm("Are you sure you want to delete this user?")) {
        this.$store.commit("setIsLoading", true);
        // Delete user data using the delete request
        axios
          .delete(`/accounts/users/delete/${this.userId}/`)
          .then(() => {
            console.log("User deleted successfully.");

            this.$store.commit("setIsLoading", false);
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
    changePassword() {
      // Check if old password and new password are provided
      if (!this.oldPassword || !this.newPassword) {
        this.passwordError = "Please enter old and new passwords.";
        return;
      }

      // Proceed with password change only if old password matches
      this.$store.commit("setIsLoading", true);
      axios
        .post(`/accounts/users/verify-password/${this.userId}/`, {
          old_password: this.oldPassword,
        })
        .then((response) => {
          if (response.data.success) {
            // Old password matches, proceed with updating the password
            axios
              .post(`/accounts/users/change-password/${this.userId}/`, {
                new_password: this.newPassword,
              })
              .then((response) => {
                console.log("Password changed successfully:", response.data);
                this.$store.commit("setIsLoading", false);
                this.$notify({
                  title: "Password Updated Successfully",

                  type: "bg-success-subtle text-success",
                  duration: 5000,
                });
                // Reset fields
                this.oldPassword = "";
                this.newPassword = "";
                this.passwordError = "";
                this.newPasswordError = "";
              })
              .catch((error) => {
                console.error("Error changing password:", error);
                this.$store.commit("setIsLoading", false);
                this.passwordError =
                  "Error changing password. Please try again.";
              });
          } else {
            // Old password does not match, display error notification
            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "Incorrect Old Password",
              type: "bg-danger-subtle text-danger",
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          console.error("Error verifying password:", error);
          this.$store.commit("setIsLoading", false);
          this.passwordError = "Error verifying password. Please try again.";
          this.$notify({
            title: "Incorrect Old Password",
            type: "bg-danger-subtle text-danger",
            duration: 5000,
          });
        });
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
