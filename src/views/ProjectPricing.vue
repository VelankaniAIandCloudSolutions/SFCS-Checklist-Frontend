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
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Project Pricing</h2>
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
                Project Pricing
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <section class="card p-3 mb-4 mt-4">
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="projectDropdown" class="form-label">Project</label>

          <select
            class="form-select"
            id="projectDropdown"
            v-model="form.selectedProject"
            required
          >
            <option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="productCode" class="form-label">Product</label>
          <select
            class="form-select"
            id="productCode"
            v-model="form.selectedProduct"
            required
          >
            <option
              v-for="product in filteredProducts"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#pricingTableModal"
          @click="fetchProductPrices"
        >
          Fetch Prices
        </button>
      </div>
    </section>
  </div>
  <div
    class="modal fade"
    id="pricingTableModal"
    tabindex="-1"
    aria-labelledby="pricingTableModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="pricingTableModalLabel">
            Pricing Details
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <PartNumberPricingTable :prices="partPrices" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PartNumberPricingTable from "@/components/PartNumberPricingTable.vue";
import axios from "axios";
export default {
  components: { PartNumberPricingTable },
  data() {
    return {
      projects: [],
      products: [],
      form: {
        selectedProject: "",
        selectedProduct: "",
      },
      partPrices: [],
    };
  },
  mounted() {
    this.getProjectPricingPage();
  },
  computed: {
    filteredProducts() {
      if (this.products && this.projects) {
        if (this.form.selectedProject !== null) {
          const filteredProducts = this.products.filter((product) => {
            const projectId = product.project;
            return projectId === this.form.selectedProject;
          });
          return filteredProducts;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  },
  methods: {
    async getProjectPricingPage() {
      this.$store.commit("setIsLoading", true);
      await axios
        .get("/pricing/get-project-pricing-page") // Replace with your actual API endpoint
        .then((response) => {
          this.projects = response.data.projects;
          this.products = response.data.products;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
    async fetchProductPrices() {
      this.$store.commit("setIsLoading", true);
      await axios
        // .get(`/pricing/get-product-pricing/${this.form.selectedProduct}/`)
        .get(`/pricing/get-product-pricing/30/`)
        .then((response) => {
          this.partPrices = response.data.part_prices;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
