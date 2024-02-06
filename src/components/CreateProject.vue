<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Projects</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i>Home</router-link
                >
              </li>
              <li class="breadcrumb-item">
                <router-link to="/projects"
                  ><i class="fas fa-project-diagram me-1"></i
                  >Projects</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa fa-plus"></i>
                Create Project
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
          @click="createProject"
        >
          <i class="fas fa-save me-1"></i> Create Project
        </button>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-header bg-primary text-white">
        <h4 class="card-title">
          <i class="fas fa-project-diagram me-2"></i> Project Information
        </h4>
      </div>
      <div class="card-body">
        <!-- Project Name -->
        <div class="mb-3">
          <label for="projectName" class="form-label">Project Name:</label>
          <input
            v-model="newProject.name"
            type="text"
            class="form-control"
            id="projectName"
            required
          />
          <small v-if="!newProject.name" class="text-danger"
            >Project Name is required.</small
          >
        </div>
        <!-- Project Code -->
        <div class="mb-3">
          <label for="projectCode" class="form-label">Project Code:</label>
          <input
            v-model="newProject.project_code"
            type="text"
            class="form-control"
            id="projectCode"
            required
          />
          <small v-if="!newProject.project_code" class="text-danger"
            >Project Code is required.</small
          >
        </div>
        <!-- Project Rev No -->
        <!-- <div class="mb-3">
          <label for="projectRevNo" class="form-label">Project Rev No:</label>
          <input
            v-model="newProject.project_rev_number"
            type="text"
            class="form-control"
            id="projectRevNo"
          />
        </div> -->
        <!-- ... (unchanged code) ... -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateProject",
  data() {
    return {
      newProject: {
        name: "",
        project_code: "",
        project_rev_number: "",
        // Add more fields as needed
      },
    };
  },
  methods: {
    createProject() {
      // Check if the form is valid before creating a new project

      this.$store.commit("setIsLoading", true);

      if (
        this.newProject.name &&
        this.newProject.project_code
        // this.newProject.project_rev_number
      ) {
        // Create a new project using the post request
        axios
          .post("/store/create-project/", this.newProject)
          .then((response) => {
            console.log("Project created successfully:", response.data);
            this.$store.commit("setIsLoading", false);
            // Display a success message

            this.$notify({
              title: "Project Created Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            // Redirect to the project list page or perform other actions as needed
            this.$router.push("/projects");
          })
          .catch((error) => {
            console.error("Error creating project:", error);
            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "Project Creation Unsuccessful",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
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
