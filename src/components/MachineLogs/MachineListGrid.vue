<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="machinesList"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      :rowSelection="'single'"
      @rowClicked="handleRowClicked"
      @selectionChanged="handleSelectionChanged"
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
    machinesList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
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
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        autoSizeColumns: true,
      },
      selectedRows: [],
    };
  },

  methods: {
    // handleRowClicked(row) {
    //   this.$emit("machineClicked", row.data.id);
    // },
    // handleSelectionChanged(event) {
    //   // Check if rows are selected
    //   if (event.api.getSelectedRows().length > 0) {
    //     // Get the ID of the selected row
    //     const selectedRowId = event.api.getSelectedRows()[0].id;
    //     // Emit the machineClicked event with the ID of the selected row
    //     this.$emit("machineClicked", selectedRowId);
    //   }
    // },
    handleSelectionChanged(event) {
      // Check if the event is triggered by a header checkbox
      if (event.source === "headerCheckbox") {
        // Get the selected nodes
        const selectedNodes = event.api.getSelectedNodes();
        // Deselect all rows if the header checkbox is unchecked
        if (selectedNodes.length === 0) {
          event.api.deselectAll();
          // Emit null to indicate no machine is selected
          this.$emit("machineClicked", null);
        }
      } else {
        // Check if rows are selected
        const selectedRows = event.api.getSelectedRows();
        if (selectedRows.length > 0) {
          // Emit the selected row object
          this.$emit("machineClicked", selectedRows[0]);
        } else {
          // If no rows are selected, emit null
          this.$emit("machineClicked", null);
        }
      }
    },
  },
};
</script>

<style scoped></style>
