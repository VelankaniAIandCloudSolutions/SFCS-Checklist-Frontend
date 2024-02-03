<template>
  <div>
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
          field: "name",
          headerName: "Name",
        },
        {
          field: "description",
          headerName: "Description",
        },
        {
          field: "po.currency_code",
          headerName: "Currency",
        },
        {
          field: "rate",
          headerName: "Rate",
        },
        {
          field: "quantity",
          headerName: "Quantity",
        },
        {
          field: "total",
          headerName: "Total",
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

  methods: {},
};
</script>

<style scoped></style>
