<!-- manufacturer-parts-grid.vue -->
<template>
  <div class="ag-theme-quartz" style="height: 400px">
    <ag-grid-vue
      ref="agGrid"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="manufacturerParts"
      @firstDataRendered="onFirstDataRendered"
      @selectionChanged="onSelectionChanged"
    ></ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  props: {
    manufacturerParts: {
      type: Array,
      default: () => [],
    },
    selectedManufacturerParts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gridOptions: {
        domLayout: "autoHeight",
        rowSelection: "multiple",
      },
      columnDefs: [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Part Number",
          field: "part_number",
        },
        { headerName: "Manufacturer Name", field: "manufacturer.name" },
      ],
    };
  },
  methods: {
    onFirstDataRendered(params) {
      const gridApi = params.api;
      console.log("rububub");
      gridApi.forEachNode((node) => {
        const manufacturerPart = node.data;
        const isSelected = this.selectedManufacturerParts.some(
          (selectedPart) => selectedPart.id === manufacturerPart.id
        );
        node.setSelected(isSelected);
      });
      // Iterate through rows and select if it matches selectedManufacturerParts
      //   this.manufacturerParts.forEach((row) => {
      //     const node = gridApi.getRowNode(row.id);
      //     console.log(node);
      //     if (node && this.isSelectedManufacturerPart(row)) {
      //       node.setSelected(true);
      //     }
      //   });
    },
    isSelectedManufacturerPart(row) {
      console.log(row);
      // Check if the row is in selectedManufacturerParts
      return this.selectedManufacturerParts.some(
        (selectedPart) => selectedPart.id === row.id
      );
    },
    onSelectionChanged() {
      // Update selectedManufacturerParts whenever selection changes
      //   this.selectedManufacturerParts = this.$refs.agGrid.api.getSelectedRows();
      //   console.log("Selected Rows:", this.selectedManufacturerParts);
    },
  },
};
</script>

<style scoped>
.ag-theme-quartz {
  display: block;
}
</style>
