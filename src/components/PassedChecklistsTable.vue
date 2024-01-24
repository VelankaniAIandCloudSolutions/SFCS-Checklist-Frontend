<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="passed_checklists"
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
    passed_checklists: {
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
        {
          headerName: "Unique Code",
          field: "unique_code",
          valueFormatter: function (params) {
            // Check if unique code is null, and display 'null' if true
            return params.value === null ? "null" : params.value;
          },
        },
        { headerName: "Project Name", field: "bom.product.project.name" },
        { headerName: "Product Name", field: "bom.product.name" },
        { headerName: "Product Code", field: "bom.product.product_code" },
        { headerName: "Updated At", field: "updated_at" },
        {
          headerName: "Updated By",
          valueGetter: function (params) {
            console.log(params.data.updated_by);
            if (params.data.updated_by != null) {
              const firstName = params.data.updated_by.first_name || "";
              const lastName = params.data.updated_by.last_name || "";
              return firstName || lastName ? `${firstName} ${lastName}` : "";
            } else {
              return "";
            }
          },
        },
        { headerName: "Created At", field: "created_at" },
        {
          headerName: "Created By",
          valueGetter: function (params) {
            const firstName = params.data.created_by.first_name || "";
            const lastName = params.data.created_by.last_name || "";
            return firstName || lastName ? `${firstName} ${lastName}` : "";
          },
        },
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
    // calculateTotalSum() {
    //   let sum_completed_checklists = 0;
    //   let sum_in_progress_checklists = 0;
    //   let sum_failed_checklists = 0;
    //   this.gridApi.forEachNodeAfterFilter((node) => {
    //     if (node.data.status == "Completed") {
    //       sum_completed_checklists += 1;
    //     } else if (node.data.status == "In Progress") {
    //       sum_in_progress_checklists += 1;
    //     } else {
    //       sum_failed_checklists += 1;
    //     }
    //   });
    //   this.total_completed = sum_completed_checklists;
    //   this.total_failed = sum_failed_checklists;
    //   this.total_in_progress = sum_in_progress_checklists;
    //   this.total_checklists = this.gridApi.getDisplayedRowCount();
    // },
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
