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

      <div class="d-flex align-items-center mt-4">
        <h2 class="mb-0">Checklist Report</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="d-inline-block ms-3">
          <ol class="breadcrumb bg-transparent m-0 p-0">
            <li class="breadcrumb-item">
              <a href="/"><i class="fas fa-home me-1"></i>Home</a>
            </li>
            <li class="breadcrumb-item active">
              <router-link to="/reports"
                ><i class="fas fa-chart-bar me-1"></i>Reports</router-link
              >
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <i class="fas fa-file-alt me-1"></i> Reports Checklist
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <ChecklistReportTable :checklists="checklists" style="margin-top: 20px" />
  </div>
</template>

<script>
import ChecklistReportTable from "../components/ChecklistReportTable.vue";
import axios from "axios";
export default {
  components: { ChecklistReportTable },
  data() {
    return {
      checklists: [],
    };
  },
  mounted() {
    this.getChecklistReport();
  },
  methods: {
    async getChecklistReport() {
      console.log("run");
      this.$store.commit("setIsLoading", true);
      this.$store.commit("setIsLoading", false);
      await axios
        .get("store/get-checklist-report/")
        .then((response) => {
          console.log(response.data);
          this.checklists = response.data.checklists;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style></style>
