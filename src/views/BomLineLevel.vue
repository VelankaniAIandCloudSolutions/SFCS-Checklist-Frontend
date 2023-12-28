<template>
  <div>
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
          <h2 class="mb-0">BOM Details</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/bom"
                  ><i class="fas fa-clipboard-list me-1"></i>Bill of
                  Materials</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-list-alt me-1"></i>
                Bom Details
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="card" style="margin-top: 20px">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="fw-bold">Product Name:</label>
                <div v-if="bom.product">{{ bom.product.name }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">BOM Type:</label>
                <div v-if="bom.bom_type">{{ bom.bom_type.name }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Issue Date:</label>
                <div v-if="bom.issue_date">{{ bom.issue_date }}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="fw-bold">Product Code:</label>
                <div v-if="bom.product">{{ bom.product.product_code }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">BOM Rev No:</label>
                <div v-if="bom.bom_rev_number">{{ bom.bom_rev_number }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Product Rev No:</label>
                <div v-if="bom.product">
                  {{ bom.product.product_rev_number }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add space between BOM details card and BomItemsTable component -->
      <div class="mt-4"></div>

      <!-- Include BomItemsTable component -->
      <BomItemsTable
        :bom="bom.bom_line_items"
        @rowClicked="handleRowClicked"
        @rowSelected="handleRowSelected"
      />
    </div>
  </div>
</template>

<script>
import BomItemsTable from "@/components/BomItemsTable"; // Adjust the path based on your project structure
import axios from "axios";
export default {
  components: {
    BomItemsTable,
  },
  data() {
    return {
      bom: "",
    };
  },
  methods: {
    handleRowClicked(data) {
      // Handle row click
      console.log("Row clicked:", data);
    },
    handleRowSelected(data) {
      // Handle row selection
      console.log("Row selected:", data);
    },
    async fetchData() {
      // Make an API request to get the BOM data by ID (similar to how you're fetching it in the original code)
      // For example:
      this.$store.commit("setIsLoading", true);
      await axios
        .get(`store/get-boms/${this.$route.params.id}/`)
        .then((response) => {
          console.log(response.data);
          this.bom = response.data.bom;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
  },
  mounted() {
    // Fetch data when the component is created
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
/* Add custom styles if needed */
/* Optional: Add borders and additional styling for a more refined look */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
