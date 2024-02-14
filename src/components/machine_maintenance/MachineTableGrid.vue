<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="machines"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      rowSelection="multiple"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
      @gridReady="onGridReady"
      @firstDataRendered="onFirstDataRendered"
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
    machines: {
      type: Array,
      required: true,
    },

    selectedMachinesArray: {
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
          field: "name",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Machine Name",
          width: 375,
        },
        { field: "line.name", headerName: "Line", width: 375 },
      ],

      defaultColDef: {
        filter: true, // Enable filtering by default for all columns
        sortable: true,
        resizable: true,
        // autoSize: true,
      },
      selectedRows: [],
    };
  },

  methods: {
    // onFirstDataRendered(params) {
    //   const gridApi = params.api;
    //   gridApi.forEachNode((node) => {
    //     const machine = node.data;
    //     const isSelected = this.selectedManufacturerParts.some(
    //       (selectedPart) => selectedPart.id === manufacturerPart.id
    //     );
    //     node.setSelected(isSelected);
    //   });
    // Iterate through rows and select if it matches selectedManufacturerParts
    //   this.manufacturerParts.forEach((row) => {
    //     const node = gridApi.getRowNode(row.id);
    //     console.log(node);
    //     if (node && this.isSelectedManufacturerPart(row)) {
    //       node.setSelected(true);
    //     }
    //   });
    // },

    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    // onSelectionChanged(params) {
    //   const selectedData = params.api.getSelectedRows();
    //   const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
    //   if (selectedRow) {
    //     this.$emit("rowSelected", selectedRow);
    //   } else {
    //     this.$emit("rowDeselected");
    //   }
    // },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      this.$emit("rowsSelected", selectedData); // Emit all selected rows
      if (selectedData.length === 0) {
        this.$emit("rowsDeselected"); // Emit event for deselection
      }
    },
    onFirstDataRendered(params) {
      console.log("hey");
      const gridApi = params.api;
      this.selectedMachinesArray.forEach((item) => {
        const node = gridApi.getRowNode(item.id); // Assuming each item in selectedMachinesArray has an 'id' property
        if (node) {
          node.setSelected(true); // Select the row
        }
      });
    },
  },

  // onSelectionChanged() {
  //   // Emit an event to notify the parent component about the selection change
  //   const selectedRows = this.$refs.agGrid.api.getSelectedRows();
  //   this.$emit("update:selectedMachines", selectedRows);
  // },

  // onEditClick(id) {
  //   this.$router.push(`/bom/edit/${id}`);
  // },
};
</script>
<style scoped></style>
