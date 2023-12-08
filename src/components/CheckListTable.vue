<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 550px"
      class="ag-theme-quartz"
      :rowData="checklistItems"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @firstDataRendered="onFirstDataRendered"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
      @rowDeselected="onRowDeselected"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  props: {
    checklistItems: {
      type: Array,
      required: true,
    },
  },
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      isGridReady: false, // Flag to track grid readiness
      colDefs: [
        {
          headerName: "VEPL Part No",
          field: "bom_line_item.part_number",
        },
        {
          headerName: "Present Quantity",
          field: "present_quantity",
        },
        {
          headerName: "Required Quantity",
          field: "required_quantity",
        },
        {
          headerName: "Is Present",
          field: "is_present",
        },
        {
          headerName: "Is Quantity Sufficient",
          field: "is_quantity_sufficient",
        },
        {
          headerName: "Updated At",
          field: "updated_at",
        },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        domLayout: "autoHeight",
      },
      selectedRows: [],
    };
  },
  mounted() {},
  methods: {
    // fetchData() {
    //   // Simulate API response
    //   const newStatus = Math.random() < 0.5; // Randomly set true or false
    //   this.rowData[0].Status = newStatus;
    //   this.rowData[0].Quantity = Math.floor(Math.random() * 20) + 1; // Random Quantity
    //   this.rowData[0].Required_Quantity = Math.floor(Math.random() * 10) + 1; // Random Required Quantity
    //   if (this.rowData[0].Quantity >= 5) {
    //     this.rowData[0].Status = true;
    //   }

    //   // Refresh the grid
    //   // this.gridApi.setRowData(this.rowData);
    // },
    statusCellRenderer(params) {
      return params.value ? "✔" : "✘"; // Replace with your logic
    },
    onRowClicked(params) {
      // Emit an event with the clicked row data
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
      this.onSelectionChanged();
    },
    onRowDeselected() {
      this.onSelectionChanged();
    },
    onSelectionChanged() {
      this.selectedRows = this.gridApi.getSelectedRows();
    },
    onFirstDataRendered(params) {
      // Access the grid API after the grid has been fully rendered
      if (params.api) {
        this.gridApi = params.api;
        this.isGridReady = true; // Set the flag to true when the grid is ready
      }
    },
    onGridReady(params) {
      // Store the grid API reference when the grid is ready
      this.gridApi = params.api;
      this.isGridReady = true; // Set the flag to true when the grid is ready
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
