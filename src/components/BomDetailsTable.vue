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
          id: 1,
          "Product Name": "PRYSM-Zen-2",
          "Product Code": "DAYTONA",
          "BOM Type": "Type-A",
          "BOM Rev No": "Rev-001",
          "Issue Date": "2023-12-01",
          "Product Rev No": "Rev-1",
        },
        {
          id: 2,
          "Product Name": "Some Product",
          "Product Code": "ABC123",
          "BOM Type": "Type-B",
          "BOM Rev No": "Rev-002",
          "Issue Date": "2023-12-05",
          "Product Rev No": "Rev-2",
        },
        // Add more rows as needed
      ],
      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          field: "Product Name",
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { field: "Product Code" },
        { field: "BOM Type" },
        { field: "BOM Rev No" },
        { field: "Issue Date" },
        { field: "Product Rev No" },
        {
          headerName: "Actions",
          cellRenderer: this.editButtonRenderer,
        },

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
      selectedRows: [],
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
    onSelectionChanged() {
      this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
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
<style scoped></style>
