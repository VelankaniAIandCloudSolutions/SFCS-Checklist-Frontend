<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="bomByProducts"
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

export default {
  name: "OrderBomDetails",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    bomByProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Add more rows as needed

      colDefs: [
        {
          field: "id",
          headerCheckboxSelection: true,
          checkboxSelection: true,

          headerName: "BOM ID",
        },
        {
          field: "product.name",

          headerName: "Product Name",
        },
        {
          field: "product.product_code",
          headerName: "Product Code",
        },
        {
          field: "bom_type.name",
          headerName: "BOM Type",
        },
        { field: "bom_rev_number", headerName: "BOM Rev No" },
        { field: "issue_date", headerName: "Issue Date" },
        {
          field: "product.product_rev_number",
          headerName: "Product Rev No",
        },
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

    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>
<style scoped></style>
