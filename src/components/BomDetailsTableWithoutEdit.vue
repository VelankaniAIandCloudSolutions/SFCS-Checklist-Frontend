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
      @selectionChanged="onSelectionChanged"
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
  name: "App",
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [], // Add more rows as needed

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
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("store/get-boms/");
        this.rowData = response.data.boms;
        console.log(response.data.boms);
      } catch (error) {
        console.error("Error fetching BOM data:", error);
      }
    },
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

    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>
<style scoped></style>
