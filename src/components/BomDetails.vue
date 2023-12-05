<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [
        {
          "VEPL Part Number": "VEPL33433256",
          "Priority Level": "1",
          Value: "LCMXO2-1200UHC-4FTG256C",
          Description: "IC OTHER(256P)LCMXO2-1200UHC-4FTG2(FTBGA",
          Type: "IC",
        },
        {
          "VEPL Part Number": "VEPL33434250",
          "Priority Level": "1",
          Value: "AST2500A2-GP",
          Description: "IC CTRL(456P)AST2500A2-GP(TFBGA)",
          Type: "IC",
        },
        // Add more rows as needed
      ],
      colDefs: [
        {
          field: "VEPL Part Number",
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },

        { field: "Priority Level" },
        { field: "Value" },
        { field: "Description" },
        { field: "Type" },

        //     { field: "price", valueFormatter: this.formatPriceEuro },
        //     { field: "successful" },
        //     { field: "rocket" },
      ],

      defaultColDef: {
        filter: true, // Enable filtering by default for all columns
        sortable: true,
        resizable: true,
        autoSize: true,
      },
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    // async fetchData() {
    //   const response = await fetch(
    //     "https://www.ag-grid.com/example-assets/space-mission-data.json"
    //   );
    //   this.rowData = await response.json();
    // },
    onRowClicked(params) {
      // Emit an event with the clicked row data
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
  },
};
</script>
