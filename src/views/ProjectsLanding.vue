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
          <h2 class="mb-0">Project</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i> Home</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-project-diagram me-1"></i>
                Project
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->

      <div class="col-md-6 mt-4 text-end">
        <!-- <div class="container has-text-centered"> -->
        <router-link
          to="/projects/create-project"
          class="btn btn-primary btn-sm ms-2"
        >
          Create New Project
        </router-link>
      </div>
    </div>
    <ProjectsLandingTable style="margin-top: 20px" :projectList="projectList" />
  </div>
</template>

<script>
import axios from "axios";
import ProjectsLandingTable from "@/components/ProjectsLandingTable.vue";
export default {
  components: { ProjectsLandingTable },
  data() {
    return {
      projectList: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$store.commit("setIsLoading", true);

      axios
        .get("/store/edit-project") // Replace with your actual API endpoint
        .then((response) => {
          console.log("response.data", response.data);
          this.projectList = response.data.projects;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
