<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <!-- Add loading spinner or message here -->
  </div>
  <div v-else>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="partPrices"
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
    partPrices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currencySymbols: {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        INR: "₹", // Added Indian Rupee symbol
        // Add more currency codes and their symbols as needed
      },
      colDefs: [
        {
          field: "part_number",
          headerName: "VEPL Number",
          hide: !this.partPrices.some((item) => item.part_number),
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
        {
          field: "price(1)",
          headerName: "Price (1)",
          cellRenderer: (params) => {
            const symbol = this.currencySymbols[params.data.Currency] || "";
            const value = params.value ? String(params.value) : "";

            if (value && !value.includes(symbol)) {
              return `<span>${symbol}${value}</span>`;
            } else if (params.value) {
              return `<span>${params.value}</span>`;
            } else {
              return `<span> - </span>`;
            }
          },
        },

        {
          field: "price(10)",
          headerName: "Price (10)",
          cellRenderer: (params) => {
            const symbol = this.currencySymbols[params.data.Currency] || "";
            const value = params.value ? String(params.value) : "";

            if (value && !value.includes(symbol)) {
              return `<span>${symbol}${value}</span>`;
            } else if (params.value) {
              return `<span>${params.value}</span>`;
            } else {
              return `<span> - </span>`;
            }
          },
        },
        {
          field: "price(100)",
          headerName: "Price (100)",
          cellRenderer: (params) => {
            const symbol = this.currencySymbols[params.data.Currency] || "";
            const value = params.value ? String(params.value) : "";

            if (value && !value.includes(symbol)) {
              return `<span>${symbol}${value}</span>`;
            } else if (params.value) {
              return `<span>${params.value}</span>`;
            } else {
              return `<span> - </span>`;
            }
          },
        },
        {
          field: "price(500)",
          headerName: "Price (500)",
          cellRenderer: (params) => {
            const symbol = this.currencySymbols[params.data.Currency] || "";
            const value = params.value ? String(params.value) : "";

            if (value && !value.includes(symbol)) {
              return `<span>${symbol}${value}</span>`;
            } else if (params.value) {
              return `<span>${params.value}</span>`;
            } else {
              return `<span> - </span>`;
            }
          },
        },
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
      ],

      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        autoSizeColumns: true,
      },
    };
  },
  created() {
    // Log prices prop to console
    console.log("Prices prop:", this.partPrices);
  },
};
</script>

<style scoped></style>
