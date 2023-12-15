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
import axios from "axios";
export default {
  name: "YourComponentName", // Replace with your component name
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [], // Initialize rowData as an empty array
      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          field: "product.name",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Product Name",
        },
        { field: "product.product_code", headerName: "Product Code" },
        { field: "bom_type.name", headerName: "BOM Type" },
        { field: "bom_rev_number", headerName: "BOM Rev No" },
        { field: "issue_date", headerName: "Issue Date" },
        { field: "product.product_rev_number", headerName: "Product Rev No" },
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
  async mounted() {
    // Fetch data when the component is mounted
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        const response = await axios.get("store/get-boms/");
        this.rowData = response.data.boms;
        console.log(response.data.boms);
      } catch (error) {
        console.error("Error fetching BOM data:", error);
      }
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
    },
    onSelectionChanged() {
      if (this.$refs.agGrid && this.$refs.agGrid.api) {
        this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
      }
    },
    editButtonRenderer(params) {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-edit"></i>`;
      button.classList.add("btn", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () => this.onEditClick(params.data.id));
      return button;
    },
    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
