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
      :rowData="recommendation_details"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  components: {
    AgGridVue,
  },
  props: {
    recommendation_details: {
      type: Array,
      default: () => [],
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
      },
    };
  },
  watch: {
    recommendation_details(newVal) {
      console.log("recommendation_details updated:", newVal);
      this.initializeColumnDefinitions();
    },
  },
  created() {
    console.log("Prices prop received:", this.recommendation_details);
    this.initializeColumnDefinitions();
  },
  methods: {
    initializeColumnDefinitions() {
      console.log("Initializing column definitions...");

      const staticColumns = [
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
        this.recommendation_details
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
        cellRenderer: (params) => {
          const value = params.value ? String(params.value) : "";

          if (value) {
            return `<span>${value}</span>`;
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
  },
};
</script>

<style scoped></style>
