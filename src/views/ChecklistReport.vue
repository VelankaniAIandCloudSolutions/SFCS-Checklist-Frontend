<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist Report</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active">
                <router-link to="/reports">Reports</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Checklist Report
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
    <div class="card mt-2">
      <div class="card-header">Featured</div>
      <div class="card-body">This is some text within a card body.</div>
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
