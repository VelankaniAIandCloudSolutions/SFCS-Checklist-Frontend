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

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    rowData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Add more rows as needed

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

  methods: {
    onRowClicked(params) {
      // Emit an event with the clicked row data
      this.$emit("rowClicked", params.data);
    },
    // onRowSelected(params) {
    //   // Emit an event with the selected row data
    //   if (params.node.isSelected()) {
    //     this.$emit("rowSelected", params.node.data);
    //   } else {
    //     this.$emit("rowDeselected");
    //   }
    // },
    onSelectionChanged(params) {
      // const selectedData = params.api.getSelectedRows();
      // // Emit deselected events in the order they were deselected
      // this.rowData
      //   .filter(
      //     (row) =>
      //       !selectedData.find((selectedRow) => row.id === selectedRow.id)
      //   )
      //   .forEach((deselectedRow) => {
      //     this.$emit("rowDeselected", deselectedRow);
      //   });
      // // Emit selected events
      // selectedData.forEach((selectedRow) => {
      //   this.$emit("rowSelected", selectedRow);
      // });
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        // Emit a generic "rowDeselected" event when no row is selected
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
