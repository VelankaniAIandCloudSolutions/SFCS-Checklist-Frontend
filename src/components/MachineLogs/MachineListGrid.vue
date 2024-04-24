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
        { field: "line.name", headerName: "Lines", width: 375 },
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
    handleRowClicked(row) {
      this.$emit("machineClicked", row.data.id);
    },
    handleSelectionChanged(event) {
      // Check if rows are selected
      if (event.api.getSelectedRows().length > 0) {
        // Get the ID of the selected row
        const selectedRowId = event.api.getSelectedRows()[0].id;
        // Emit the machineClicked event with the ID of the selected row
        this.$emit("machineClicked", selectedRowId);
      }
    },
  },
};
</script>

<style scoped></style>
