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
          <h2 class="mb-0">Bill Of Materials</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-clipboard-list me-1"></i>
                Bill Of Materials
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 d-flex justify-content-end mt-4">
        <!-- <router-link to="/create-bom" class="btn btn-primary btn-sm ms-2">
          Create BOM
        </router-link> -->
        <router-link to="/bom/upload" class="btn btn-primary btn-sm ms-2">
          Upload BOM
        </router-link>
      </div>
    </div>
    <!-- Rest of your component -->
    <BomDetailsTable
      style="margin-top: 20px"
      :boms="boms"
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
    />
  </div>
</template>

<script>
import axios from "axios";
import BomDetailsTable from "../components/BomDetailsTable.vue";
export default {
  components: { BomDetailsTable },
  data() {
    return {
      boms: [],
      // selectedRow: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        this.$store.commit("setIsLoading", true);
        const response = await axios.get("store/get-boms/");
        console.log("response.data", response.data);
        this.boms = response.data.boms;
        console.log("boms", this.boms);
        this.$store.commit("setIsLoading", false);
      } catch (error) {
        console.error("Error fetching BOM data:", error);
        this.$store.commit("setIsLoading", false);
      }
    },
    handleRowClicked(clickedRow) {
      // Handle the clicked row data in the parent component
      console.log("Clicked Row:", clickedRow);
      // Now you have access to the specific row data, and you can use it as needed.
    },
    handleRowSelected(rowData) {
      console.log("Row Selected:", rowData);
      this.selectedRow = rowData;
    },
  },
  mounted() {
    // Fetch data when the component is created
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
