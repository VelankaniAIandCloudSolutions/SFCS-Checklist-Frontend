<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="checklists"
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
// import axios from "axios";
export default {
  components: {
    AgGridVue,
  },
  props: {
    checklists: {
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
        },
        { headerName: "Product Name", field: "bom.product.name" },
        { headerName: "Product Code", field: "bom.product.product_code" },
        { headerName: "Updated At", field: "updated_at" },
        {
          headerName: "Updated By",
          field: "updated_by.first_name",
          valueGetter: function (params) {
            const firstName = params.data.updated_by.first_name || "";
            const lastName = params.data.updated_by.last_name || "";
            return firstName || lastName ? `${firstName} ${lastName}` : "";
          },
        },
        { headerName: "Created At", field: "created_at" },
        {
          headerName: "Created By",
          field: "created_by",
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
      selectedRows: [],
    };
  },
  mounted() {
    // Fetch data when the component is mounted
    // await this.fetchData();
  },
  methods: {
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
    onSelectionChanged() {
      if (this.$refs.agGrid && this.$refs.agGrid.api) {
        this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
      }
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
