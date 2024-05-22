<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <!-- <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div> -->
  </div>
  <div v-else>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="prices"
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
    prices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
        {
          field: "part_number",
          headerName: "VEPL Part Number",
        },
        {
          field: "distibutor",
          headerName: "Distributor",
        },
        {
          field: "manufacturer",
          headerName: "Manufacturer",
        },
        {
          field: "manufacturer_part_number",
          headerName: "Manufacturer Part No.",
        },
        {
          field: "discription",
          headerName: "Description",
        },
        {
          field: "stock",
          headerName: "Stock",
        },
        {
          field: "currency",
          headerName: "Currency",
        },
        {
          field: "prices",
          headerName: "Prices(1)",
        },
        {
          field: "prices",
          headerName: "Prices(10)",
        },
        {
          field: "prices",
          headerName: "Prices(100)",
        },
        // {
        //   field: "rate",
        //   headerName: "Rate",
        //   cellRenderer: (params) => {
        //     if (params.data.po_json) {
        //       const currencyCode = params.data.po_json.currency_symbol;
        //       const rawRate = params.data.rate;
        //       const formattedRate = this.$parsePriceToString(rawRate);

        //       return `${currencyCode} ${formattedRate}`;
        //     } else {
        //       return params.data.rate;
        //     }
        //   },
        // },
        // {
        //   field: "quantity",
        //   headerName: "Quantity",
        // },
        // {
        //   field: "total",
        //   headerName: "Total",
        //   cellRenderer: (params) => {
        //     if (params.data.po_json) {
        //       const currencyCode = params.data.po_json.currency_symbol;
        //       const rawTotal = params.data.total;
        //       const formattedTotal = this.$parsePriceToString(rawTotal);
        //       return `${currencyCode} ${formattedTotal}`;
        //     } else {
        //       return params.data.total;
        //     }
        //   },
        // },
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

  methods: {},
};
</script>

<style scoped></style>
