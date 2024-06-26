<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <!-- Add loading spinner or message here -->
  </div>
  <div v-else>
    <div class="d-flex justify-content-end mb-3">
      <button @click="onBtExport" class="btn btn-primary">
        <i class="fas fa-download me-2"></i>Download CSV
      </button>
    </div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="manufacturerpartPrices"
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
import axios from "axios";
import RecommendationDetailsTable from "@/components/RecommendationDetailsTable.vue";

export default {
  components: {
    AgGridVue,
    RecommendationDetailsTable,
  },
  props: {
    manufacturerpartPrices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        autoSizeColumns: true,
        editable: true,
      },
      isLoading: false,
      recommendation_details: [],
    };
  },
  watch: {
    manufacturerpartPrices(newVal) {
      console.log("manufacturerpartPrices updated:", newVal);
      this.initializeColumnDefinitions();
    },
  },
  created() {
    console.log("Prices prop received:", this.manufacturerpartPrices);
    this.initializeColumnDefinitions();
  },
  methods: {
    initializeColumnDefinitions() {
      console.log("Initializing column definitions...");

      const staticColumns = [
        {
          field: "VEPL Number",
          headerName: "VEPL Number",
        },
        {
          field: "Manufacturer Part Number",
          headerName: "Manufacturer Part No.",
        },
        {
          field: "Online Distributor Name",
          headerName: "Distributor",
          cellRenderer: (params) => {
            return params.value
              ? `<span> ${params.value} </span>`
              : `<span> - </span>`;
          },
        },
        {
          field: "Manufacturer",
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

      // Dynamically add price columns based on manufacturerpartPrices
      const priceColumns = this.extractPriceColumns(
        this.manufacturerpartPrices
      );

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
              this.fetchRecommendation(params.data.Description);
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

      this.colDefs = [...staticColumns, ...priceColumns, ...urlColumns];
      console.log("Column definitions initialized:", this.colDefs);
    },
    extractPriceColumns(data) {
      console.log("Extracting price columns from data:", data);

      const priceFields = new Set();

      // Extract unique price fields from data
      data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key.startsWith("Price (")) {
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
        headerName: field.replace(/Price \((\d+)\)/, "Price ($1)"),
        cellRenderer: (params) => {
          const symbol = this.manufacturerpartPrices[0].Symbol || "";
          const value = params.value ? String(params.value) : "";

          if (value && !value.includes(symbol)) {
            return `<span>${symbol}${value}</span>`;
          } else if (params.value) {
            return `<span>${params.value}</span>`;
          } else {
            return `<span> - </span>`;
          }
        },
      }));

      console.log("Price columns extracted:", priceColumnDefs);

      return priceColumnDefs;
    },
    onBtExport() {
      this.$refs.agGrid.api.exportDataAsCsv();
    },

    async fetchRecommendation(description) {
      // this.$store.commit("setIsLoading", true);
      this.isLoading = true;
      await axios
        .get("/pricing/get-recommendation-details", {
          params: { description },
        })
        .then((response) => {
          console.log(" the fetched Recommendation :", response.data);
          this.test = true;
          console.log(this.test);
          this.isLoading = false;

          this.recommendation_details = response.data.final_json;

          console.log("the db recomendations", this.recommendation_details);

          // Convert to plain array before emitting

          // console.log(
          //   "Emitting recommendationDetails event with data:",
          //   this.recommendation_details
          // );
          // this.$emit("recommendation_details", response.data.final_json);
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

<style scoped></style>
