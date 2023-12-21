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
      <div class="col-md-12 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0 me-3">Generated Checklists</h2>
          <span class="fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/checklist">
                  <i class="fas fa-list-alt me-1"></i>
                  Checklist</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa-solid fa-list-check me-1"></i>
                Generated Checklists
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
    <CheckListsTable style="margin-top: 20px" :rowData="rowData" />
  </div>
</template>

<script>
import axios from "axios";
import CheckListsTable from "../components/CheckListsTable.vue";
export default {
  components: { CheckListsTable },
  data() {
    return {
      rowData: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        this.$store.commit("setIsLoading", true);
        const response = await axios.get(
          `store/generated-checklists/${this.$route.params.id}`
        );
        this.rowData = response.data;
        console.log("checklists", response.data);
        this.$store.commit("setIsLoading", false);
      } catch (error) {
        console.error("Error fetching CheckLists data:", error);
        this.$store.commit("setIsLoading", false);
      }
    },
  },
};
</script>

<style></style>
