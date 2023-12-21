<template>
  <div>
    <ag-grid-vue
      v-if="rowData.length > 0"
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
  components: {
    AgGridVue,
  },
  props: {
    rowData: {
      type: Array,
    },
  },
  data() {
    return {
      // Initialize rowData as an empty array
      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          headerName: "Checklist ID",
          field: "id",
          headerCheckboxSelection: true,
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
        { headerName: "Product Name", field: "bom.product.name" },
        { headerName: "Product Code", field: "bom.product.product_code" },
        { headerName: "Batch Quantity", field: "batch_quantity" },
        { headerName: "Updated At", field: "updated_at" },
        { headerName: "Status", field: "status" },

        {
          headerName: "Actions",
          cellRenderer: this.editButtonRenderer,
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
  // mounted() {
  //   // Fetch data when the component is mounted
  //   this.fetchData();
  // },
  methods: {
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
    onSelectionChanged() {
      if (this.$refs.agGrid && this.$refs.agGrid.api) {
        this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
      }
    },
    editButtonRenderer(params) {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-eye"></i>`; // Use an eye icon for view
      button.classList.add("btn", "btn-success");

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
