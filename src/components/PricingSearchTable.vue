<template>
  <!-- <div v-if="$store.state.isLoading" class="container text-center"> -->
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
  <div v-else>
    <div v-if="lowestPriceDistributor" class="lowest-price-container">
      <div
        class="alert d-flex align-items-center"
        style="color: black; background-color: white"
      >
        <i class="fas fa-award fa-2x me-3"></i>
        <div>
          <h4 class="alert-heading">Best Price Offered By</h4>
          <p>
            <strong>{{ lowestPriceDistributor.name }}</strong> with a price of
            <span class="badge bg-success">
              {{ formatCurrency(lowestPriceDistributor.price) }}
            </span>
            for quantity 1
          </p>
        </div>
        <div class="ms-auto">
          <a
            v-if="lowestPriceDistributor.datasheetUrl"
            class="btn btn-primary me-2"
            :href="lowestPriceDistributor.datasheetUrl"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; border-color: whitesmoke"
          >
            View Data Sheet
          </a>
          <a
            v-if="lowestPriceDistributor.productUrl"
            class="btn btn-success"
            :href="lowestPriceDistributor.productUrl"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; border-color: whitesmoke"
          >
            View Product
          </a>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mb-3">
      <button @click="onBtExport" class="btn btn-primary">
        <i class="fas fa-download me-2"></i>Download CSV
      </button>
    </div>
    <!-- Display the lowest price distributor -->

    <ag-grid-vue
      ref="agGrid"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
    >
    </ag-grid-vue>

    <div
      class="modal fade"
      id="openRecommendationModal"
      tabindex="-1"
      aria-labelledby="openRecommendationModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="openRecommendationModalLabel">
              Recommendation Details
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="isLoading">
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
            <div v-else>
              <recommendation-details-table
                :recommendation_details="recommendation_details"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import RecommendationDetailsTable from "@/components/RecommendationDetailsTable.vue";
import axios from "axios";

export default {
  name: "PricingSearchTable",
  emits: ["recommendationDetails"],
  components: {
    AgGridVue,
    RecommendationDetailsTable,
  },
  props: {
    veplNumber_prices: {
      type: Array,
      default: () => [],
    },
    pricingdetails: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rowData: [],
      colDefs: [],
      recommendation_details: [],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        autoSizeColumns: true,
      },
      lowestPriceDistributor: null,
      test: false,
      isLoading: false,
      // To store the lowest price distributor
    };
  },
  watch: {
    veplNumber_prices(newVal) {
      if (newVal && newVal.length) {
        this.initializeColumnDefinitions(newVal);
        this.rowData = newVal;
        this.calculateLowestPriceDistributor(newVal); // Calculate the lowest price distributor
      }
    },
    pricingdetails(newVal) {
      if (newVal && newVal.length) {
        this.initializeColumnDefinitions(newVal);
        this.rowData = newVal;
        this.calculateLowestPriceDistributor(newVal); // Calculate the lowest price distributor
      }
    },
  },
  mounted() {
    console.log(
      " mounted recommendation details ",
      this.recommendation_details
    );
  },
  created() {
    if (this.veplNumber_prices && this.veplNumber_prices.length) {
      this.initializeColumnDefinitions(this.veplNumber_prices);
      this.rowData = this.veplNumber_prices;
      this.calculateLowestPriceDistributor(this.veplNumber_prices); // Calculate the lowest price distributor
    } else if (this.pricingdetails && this.pricingdetails.length) {
      this.initializeColumnDefinitions(this.pricingdetails);
      this.rowData = this.pricingdetails;
      this.calculateLowestPriceDistributor(this.pricingdetails); // Calculate the lowest price distributor
    }
  },
  methods: {
    initializeColumnDefinitions(data) {
      const hasVeplNumber = data.some((item) => item.vepl_number);

      const staticColumns = [
        {
          field: "Manufacturer Part Number",
          headerName: "Manufacturer Part No.",
        },
        {
          field: "distributor",
          headerName: "Distributor",
          cellRenderer: (params) => {
            return params.value
              ? `<span> ${params.value} </span>`
              : `<span> - </span>`;
          },
        },
        {
          field: "Manufacturer Name",
          headerName: "Manufacturer",
          cellRenderer: (params) => {
            return params.value
              ? `<span> ${params.value} </span>`
              : `<span> - </span>`;
          },
        },
        {
          field: "Description",
          headerName: "Description",
          cellRenderer: (params) => {
            return params.value
              ? `<span>${params.value}</span>`
              : `<span> - </span>`;
          },
        },
        {
          field: "Stock",
          headerName: "Stock",
          cellRenderer: (params) => {
            return params.value
              ? `<span>${params.value}</span>`
              : `<span> - </span>`;
          },
        },
        {
          field: "Currency",
          headerName: "Currency",
          cellRenderer: (params) => {
            return params.value
              ? `<span>${params.value}</span>`
              : `<span> - </span>`;
          },
        },
      ];

      if (hasVeplNumber) {
        staticColumns.unshift({
          field: "vepl_number",
          headerName: "VEPL Number",
        });
      }

      const dynamicColumns = this.extractPriceColumns(data);

      const urlColumns = [
        {
          field: "Datasheet Url",
          headerName: "View DataSheet",
          cellRenderer: (params) => {
            const openUrl = () => {
              window.open(params.value, "_blank");
            };

            const eyeIcon = document.createElement("i");
            eyeIcon.className = "fas fa-eye";
            eyeIcon.style.color = "blue";
            eyeIcon.style.cursor = "pointer";
            eyeIcon.addEventListener("click", openUrl);

            return eyeIcon;
          },
        },
        {
          field: "Product Url",
          headerName: "View Product",
          cellRenderer: (params) => {
            const openUrl = () => {
              window.open(params.value, "_blank");
            };

            const externalLinkIcon = document.createElement("i");
            externalLinkIcon.className = "fas fa-external-link-alt"; // Use external link icon
            externalLinkIcon.style.color = "green"; // Set icon color
            externalLinkIcon.style.cursor = "pointer"; // Set cursor to pointer
            externalLinkIcon.addEventListener("click", openUrl);

            return externalLinkIcon;
          },
        },
        {
          field: "",
          headerName: "View Recommendation",
          cellRenderer: (params) => {
            const viewRecommendation = () => {
              // Call the API with the row's description
              this.fetchRecommendation(params.data);
            };

            const recommendationIcon = document.createElement("i");
            recommendationIcon.className = "fas fa-share"; // Use share icon
            recommendationIcon.style.color = "blue"; // Set icon color
            recommendationIcon.style.cursor = "pointer"; // Set cursor to pointer
            recommendationIcon.setAttribute("data-bs-toggle", "modal"); // Bootstrap modal toggle attribute
            recommendationIcon.setAttribute(
              "data-bs-target",
              "#openRecommendationModal"
            ); // Bootstrap modal target attribute
            recommendationIcon.addEventListener("click", viewRecommendation);

            return recommendationIcon;
          },
        },
      ];

      this.colDefs = [...staticColumns, ...dynamicColumns, ...urlColumns];
    },
    extractPriceColumns(data) {
      const priceFields = new Set();

      // Extract unique price fields from data
      data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key.startsWith("price(")) {
            priceFields.add(key);
          }
        });
      });

      // Sort price fields
      const sortedPriceFields = Array.from(priceFields).sort((a, b) => {
        const getNumericValue = (field) => parseFloat(field.match(/\d+/)[0]);
        return getNumericValue(a) - getNumericValue(b);
      });

      // Create column definitions for sorted price fields
      const priceColumnDefs = sortedPriceFields.map((field) => ({
        field: field,
        headerName: field.replace(/price\((\d+)\)/, "Price ($1)"),
        type: "numericColumn",
        cellRenderer: (params) => {
          const currencySymbol = params.data["Currency Symbol"] || "";
          const value = params.value ? String(params.value) : "";

          if (value && !value.includes(currencySymbol)) {
            return `<span>${currencySymbol}${value}</span>`;
          } else if (params.value) {
            return `<span>${params.value}</span>`;
          } else {
            return `<span> - </span>`;
          }
        },
        valueFormatter: (params) => {
          const value = parseFloat(params.value);
          return isNaN(value) ? null : value.toFixed(2);
        },
      }));

      return priceColumnDefs;
    },

    calculateLowestPriceDistributor(data) {
      // const distributorPrices = {};

      // Initialize lowest price variables
      let lowestPrice = Infinity;
      let lowestPriceDistributor = null;

      // Iterate through data to find lowest price for quantity 1
      data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key.startsWith("price(1)")) {
            const price = parseFloat(item[key]);
            if (!isNaN(price) && price < lowestPrice) {
              lowestPrice = price;
              lowestPriceDistributor = {
                name: item.distributor,
                price: price,
                datasheetUrl: item["Datasheet Url"],
                productUrl: item["Product Url"],
              };
            }
          }
        });
      });

      this.lowestPriceDistributor = lowestPriceDistributor;
    },

    formatCurrency(value) {
      return value ? `$${value.toFixed(2)}` : "-";
    },
    onBtExport() {
      this.$refs.agGrid.api.exportDataAsCsv();
    },

    async fetchRecommendation(rowData) {
      // this.$store.commit("setIsLoading", true);
      this.isLoading = true;
      await axios
        .get("/pricing/get-recommendation-details", {
          params: rowData,
        })
        .then((response) => {
          console.log(" the fetched Recommendation :", response.data);
          this.test = true;
          console.log(this.test);
          this.isLoading = false;

          this.recommendation_details = response.data.final_json;

          console.log("the recomendationsssssss", this.recommendation_details);

          // Convert to plain array before emitting

          console.log(
            "Emitting recommendationDetails event with data:",
            this.recommendation_details
          );
          this.$emit("recommendation_details", response.data.final_json);
        })
        .catch((error) => {
          this.isLoading = false;

          console.log(error);
        });

      // this.$store.commit("setIsLoading", false);
    },
  },
};
</script>

<style scoped>
.lowest-price-container {
  margin-bottom: 20px;
}

.lowest-price-container .alert {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  border: 1px solid #bee5eb;
  border-radius: 5px;
  /* background-color: #d1ecf1; */
  color: #e4ecee;
}

.lowest-price-container .alert .fa-award {
  color: #28a745;
}

.lowest-price-container .alert-heading {
  margin: 0;
  font-size: 1.5rem;
}

.lowest-price-container p {
  margin: 0;
  font-size: 1.2rem;
}

.lowest-price-container .badge {
  font-size: 1rem;
}
</style>
