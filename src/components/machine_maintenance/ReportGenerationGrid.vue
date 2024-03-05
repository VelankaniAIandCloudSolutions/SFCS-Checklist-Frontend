<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="maintenance_activities"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      rowSelection="multiple"
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
    maintenance_activities: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      colDefs: [
        {
          headerName: "Id",
          field: "id",
          // Added "id" field
        },
        {
          headerName: "Machine & Line Name",
          field: "",
          // Added "id" field
        },

        {
          headerName: "Date & Time Of Creation",
          field: "created_at",
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },

        {
          field: "name",

          //   headerCheckboxSelectionFilteredOnly: true,
          headerName: "Machine Name",
          width: 375,
        },
        { field: "line.name", headerName: "Lines", width: 375 },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
