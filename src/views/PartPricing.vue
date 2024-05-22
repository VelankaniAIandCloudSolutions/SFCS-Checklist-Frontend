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
          <h2 class="mb-0">Part Pricing</h2>
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
                Part Pricing
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="col-md-6 mt-4 text-end">
        <button
          class="btn btn-primary"
          style="margin-left;: 70%"
          @click="fetchProductPrices"
        >
          <i class="fas fa-search me-2"></i>
          Fetch Prices
        </button>
      </div>
    </div>

    <section class="card p-3 mb-4 mt-4">
      <div class="row mb-3">
        <div class="col-md-4">
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
              :value="project"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
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
              :value="product"
            >
              {{ product.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="bomDropdown" class="form-label">Select Bom</label>
          <select
            class="form-select"
            id="bomDropdown"
            v-model="form.selectedBom"
            required
          >
            <option v-for="bom in filteredBoms" :key="bom.id" :value="bom">
              {{ bom.bom_file_name }}
            </option>
          </select>
        </div>
      </div>

      <div class="col">
        <!-- <button
          class="btn btn-secondary ms-2"
          @click="refreshProductPrices"
          :disabled="isRefreshing"
        >
          <span
            v-if="isRefreshing"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isRefreshing ? "Refreshing Prices..." : "Refresh Prices" }}
        </button> -->
      </div>
      <!-- <span class="text-muted" style="margin-top: 1%">
        Last Refreshed At: {{ lastUpdatedAt }}</span
      > -->
    </section>
  </div>
  <div class="container" v-if="showPricingTable">
    <PartPricingTable :prices="partPrices" />
  </div>

  <!-- <div
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
            Pricing Details - {{ form.selectedProject.name }} ({{
              form.selectedProduct.name
            }})
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body"></div>
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
    </div> -->
  <!-- </div> -->
</template>

<script>
// import PartNumberPricingTable from "@/components/PartNumberPricingTable.vue";
import PartPricingTable from "@/components/PartPricingTable.vue";

import axios from "axios";
export default {
  components: { PartPricingTable },
  data() {
    return {
      projects: [],
      products: [],
      boms: [],
      form: {
        selectedProject: "",
        selectedProduct: "",
        selectedBom: "",
      },
      partPrices: [],
      lastUpdatedAt: "",
      isRefreshing: this.$route.query.is_refreshing === "1",
      showPricingTable: false,
    };
  },
  mounted() {
    this.getProjectPricingPage();

    const isRefreshingQueryParam = this.$route.query.is_refreshing === "1";
    this.isRefreshing = isRefreshingQueryParam;

    const refresh_prices_task_id = sessionStorage.getItem(
      "refresh_prices_task_id"
    );
    if (isRefreshingQueryParam) {
      if (refresh_prices_task_id) {
        this.checkTaskStatus(refresh_prices_task_id);
      }
    }
  },
  watch: {
    "$route.query.is_refreshing": function (newValue) {
      this.isRefreshing = newValue === "1";
    },
  },
  computed: {
    filteredProducts() {
      if (this.products && this.projects) {
        if (this.form.selectedProject !== null) {
          const filteredProducts = this.products.filter((product) => {
            const projectId = product.project;
            return projectId === this.form.selectedProject.id;
          });
          return filteredProducts;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    filteredBoms() {
      if (this.boms && this.form.selectedProduct) {
        return this.boms.filter(
          (bom) => bom.product === this.form.selectedProduct.id
        );
      }
      return [];
    },
  },
  methods: {
    async getProjectPricingPage() {
      this.$store.commit("setIsLoading", true);
      await axios
        .get("/pricing/get-project-pricing-page") // Replace with your actual API endpoint
        .then((response) => {
          console.log("all", response.data);
          this.projects = response.data.projects;
          this.products = response.data.products;
          this.boms = response.data.boms;
          this.lastUpdatedAt = response.data.last_updated_at;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
    async fetchProductPrices() {
      if (this.form.selectedProduct) {
        this.$store.commit("setIsLoading", true);
        await axios
          .get(`/pricing/get-product-pricing/${this.form.selectedProduct.id}/`)
          .then((response) => {
            console.log(response.data);
            this.partPrices = response.data.part_prices;
            this.showPricingTable = true;
            this.$store.commit("setIsLoading", false);
          })
          .catch((error) => {
            console.error("Error:", error);
            this.$store.commit("setIsLoading", false);
          });
      } else if (this.form.selectedProject) {
        this.$store.commit("setIsLoading", true);
        await axios
          .get(`/pricing/get-project-pricing/${this.form.selectedProject.id}/`)
          .then((response) => {
            console.log(response.data);
            this.partPrices = response.data.part_prices;
            this.$store.commit("setIsLoading", false);
          })
          .catch((error) => {
            console.error("Error:", error);
            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "An error occured,please try again",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          });
      } else {
        this.$notify({
          title: "Please select the project or product to fetch prices",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
      }
    },
    async refreshProductPrices() {
      await axios
        .get("/pricing/refresh-product-pricing")
        .then((response) => {
          console.log(response.data);
          this.$notify({
            title: "Pricing Refresh Started",
            type: "bg-success-subtle text-success",
            text: response.data.message,
            duration: "5000",
          });
          if (
            response.data.task_status === "IN PROGRESS" ||
            response.data.task_status === "PENDING"
          ) {
            const currentRoute = this.$route;
            const isRefreshingQueryParam = { is_refreshing: 1 };
            this.$router.replace({
              ...currentRoute,
              query: { ...currentRoute.query, ...isRefreshingQueryParam },
            });
            sessionStorage.setItem(
              "refresh_prices_task_id",
              response.data.task_id
            );
            this.checkTaskStatus(response.data.task_id);
          } else if (response.data.task_status === "SUCCESS") {
            this.$notify({
              title: "Prices Refreshed Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            this.$router.push("/project-pricing");
          } else {
            this.$notify({
              title: "Failed to Refresh Prices",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async checkTaskStatus(taskId) {
      try {
        const response = await axios.get(`store/check-task-status/${taskId}/`);

        if (
          response.data.task_status === "IN PROGRESS" ||
          response.data.task_status === "PENDING"
        ) {
          const currentRoute = this.$route;
          const isRefreshingQueryParam = { is_refreshing: 1 };
          this.$router.replace({
            ...currentRoute,
            query: { ...currentRoute.query, ...isRefreshingQueryParam },
          });
          setTimeout(() => {
            this.checkTaskStatus(taskId);
          }, 10000);
        } else if (response.data.task_status === "SUCCESS") {
          this.$notify({
            title: "Prices Refreshed Successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
          sessionStorage.removeItem("refresh_prices_task_id");
          this.getProjectPricingPage();
          this.$router.push("/project-pricing");
        } else {
          this.$notify({
            title: "Failed to Refresh Prices",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          sessionStorage.removeItem("refresh_prices_task_id");
          this.getProjectPricingPage();
          this.$router.push("/project-pricing");
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: "Failed to Refresh Prices",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        this.getProjectPricingPage();
        sessionStorage.removeItem("refresh_prices_task_id");
        this.$router.push("/project-pricing");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
