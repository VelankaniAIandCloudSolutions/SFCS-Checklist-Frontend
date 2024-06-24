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
    <div v-if="lowestPriceDistributor" class="lowest-price-container">
      <div class="alert alert-primary d-flex align-items-center">
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
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        autoSizeColumns: true,
      },
      lowestPriceDistributor: null, // To store the lowest price distributor
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
          field: "Online Distributor Name",
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
    // calculateLowestPriceDistributor(data) {
    //   const distributorPrices = {};

    //   // Calculate total prices and count entries for each distributor
    //   data.forEach((item) => {
    //     const distributor = item["distributor"];
    //     if (!distributorPrices[distributor]) {
    //       distributorPrices[distributor] = { total: 0, count: 0 };
    //     }

    //     Object.keys(item).forEach((key) => {
    //       if (key.startsWith("price(")) {
    //         let price = item[key];
    //         if (typeof price === "string") {
    //           price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    //         }
    //         if (!isNaN(price)) {
    //           distributorPrices[distributor].total += price;
    //           distributorPrices[distributor].count += 1;
    //         }
    //       }
    //     });
    //   });

    //   // Calculate average prices and find the lowest
    //   let lowestAveragePrice = Infinity;
    //   let lowestPriceDistributor = null;

    //   for (const distributor in distributorPrices) {
    //     const { total, count } = distributorPrices[distributor];
    //     const averagePrice = total / count;
    //     if (averagePrice < lowestAveragePrice) {
    //       lowestAveragePrice = averagePrice;
    //       lowestPriceDistributor = { name: distributor, averagePrice };
    //     }
    //   }

    //   this.lowestPriceDistributor = lowestPriceDistributor;
    // },
    formatCurrency(value) {
      return value ? `$${value.toFixed(2)}` : "-";
    },
    onBtExport() {
      this.$refs.agGrid.api.exportDataAsCsv();
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
