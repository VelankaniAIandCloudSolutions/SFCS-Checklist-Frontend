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
          headerName: "Checklist ID",
          field: "id",
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { headerName: "Product Name", field: "bom.product.name" },
        { headerName: "Product Code", field: "bom.product.product_code" },
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
  async mounted() {
    // Fetch data when the component is mounted
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        const response = await axios.get(
          `store/generated-checklists/${this.$route.params.id}`
        );
        this.rowData = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching CheckLists data:", error);
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
      button.innerHTML = `<i class="fas fa-eye"></i>`; // Use an eye icon for view
      button.classList.add("btn", "btn-success");

      button.addEventListener("click", () =>
        this.onViewClick(params.data)
      );
      return button;
    },
    onViewClick(data) {
      if (data.status === "In Progress") {
        this.$router.push(`/begin-checklist/${data.bom.id}`);
      }
       else {
        this.$router.push(`/checklist-details/${data.id}`);
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
