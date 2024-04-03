<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="inspectionBoards"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
// import axios from "axios";
export default {
  components: {
    AgGridVue,
  },
  props: {
    inspectionBoards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
        {
          headerName: "Checklist ID",
          field: "id",
          checkboxSelection: true,
        },

        { headerName: "Project Name", field: "bom.product.project.name" },
        { headerName: "Product Name", field: "bom.product.name" },
        { headerName: "Product Code", field: "bom.product.product_code" },
        { headerName: "Updated At", field: "updated_at" },

        { headerName: "Created At", field: "created_at" },

        { headerName: "Status", field: "status" },
        {
          headerName: "View",
          cellRenderer: this.viewButtonRenderer,
        },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
      },
      gridApi: null,
      // total_completed: 0,
      // total_in_progress: 0,
      // total_failed: 0,
      // total_checklists: 0,
    };
  },
  mounted() {},
  methods: {
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        this.$emit("rowDeselected");
      }
    },
    // onFirstDataRendered() {
    //   this.calculateTotalSum();
    //   this.gridApi.addEventListener("filterChanged", this.calculateTotalSum);
    // },
    onGridReady(params) {
      this.gridApi = params.api;
    },

    viewButtonRenderer(params) {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-eye"></i>`; // Use an eye icon for view
      button.classList.add("btn", "btn-outline-secondary");
      button.addEventListener("click", () => this.onViewClick(params.data));
      return button;
    },
    onViewClick(data) {
      if (data.status === "In Progress") {
        this.$router.push(`/begin-checklist/${data.bom.id}`);
      } else {
        this.$router.push(`/checklist-details/${data.id}`);
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
