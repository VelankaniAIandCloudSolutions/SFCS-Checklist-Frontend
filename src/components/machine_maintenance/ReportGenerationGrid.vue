<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="maintenance_plans"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      rowSelection="multiple"
    >
    </ag-grid-vue>
    <button @click="exportToCsv">Export to CSV</button>
    <button @click="exportToExcel">Export to Excel</button>
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
    maintenance_plans: {
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
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },

        {
          headerName: "Maintenance Planned Date:",
          field: "maintenance_date",
        },

        {
          headerName: "Machine & Line Name:",
          field: "id",
          cellRenderer: this.customMachineLineNameRenderer, // Custom renderer
        },
        {
          headerName: "Planned Maintenance Type:",
          field: "maintenance_activity_type.name",
          // Custom renderer
        },
        {
          headerName: "Maintenance Activity Performed:",
          field: "maintenance_date",
          cellRenderer: this.customActivityRenderer,
        },

        {
          headerName: "Maintenance Activity Performed By:",
          field: "maintenance_activities",
          cellRenderer: this.customActivityPerformedByRenderer,
        },
        {
          headerName: "Date & Time Of Activity Performed:",
          field: "maintenance_activities",
          cellRenderer: this.customDateTimePerformedRenderer,
        },

        {
          headerName: "Maintenance Activity Note:",
          field: "maintenance_activities",
          cellRenderer: this.customActivityNoteRenderer,
        },
      ],
    };
  },
  methods: {
    customMachineLineNameRenderer(params) {
      const machineName = params.data.machine.name; // Assuming machine name is directly accessible
      const lineName = params.data.machine.line.name; // Assuming line name is nested under 'line' property
      return `${machineName} - ${lineName}`;
    },
    customActivityRenderer(params) {
      const maintenancePlan = params.data;
      if (maintenancePlan.maintenance_activities.length > 0) {
        return '<span style="color: green">&#10004;</span>'; // Green tick
      } else {
        return '<span style="color: red">&#10008;</span>'; // Red cross
      }
    },
    customActivityPerformedByRenderer(params) {
      const maintenanceActivities = params.value; // Access 'maintenance_activities' from the params
      if (maintenanceActivities && maintenanceActivities.length > 0) {
        const lastActivity =
          maintenanceActivities[maintenanceActivities.length - 1]; // Assuming last activity is the latest
        return lastActivity.created_by.first_name; // Assuming 'created_by' contains the user details
      } else {
        return "NA";
      }
    },
    customDateTimePerformedRenderer(params) {
      const maintenanceActivities = params.value; // Access 'maintenance_activities' from the params
      if (maintenanceActivities && maintenanceActivities.length > 0) {
        const lastActivity =
          maintenanceActivities[maintenanceActivities.length - 1]; // Assuming last activity is the latest
        return lastActivity.created_at; // Assuming 'created_at' contains the date and time of the activity
      } else {
        return "NA";
      }
    },
    customActivityNoteRenderer(params) {
      const maintenanceActivities = params.value; // Access 'maintenance_activities' from the params
      if (maintenanceActivities && maintenanceActivities.length > 0) {
        const lastActivity =
          maintenanceActivities[maintenanceActivities.length - 1]; // Assuming last activity is the latest
        return lastActivity.note ? lastActivity.note : "NA"; // Return note if it exists, otherwise return "NA"
      } else {
        return "NA";
      }
    },
    exportToCsv() {
      const params = {
        fileName: "maintenance_plans.csv",
      };
      this.$refs.agGrid.api.exportDataAsCsv(params);
    },
    exportToExcel() {
      const params = {
        fileName: "maintenance_plans.xlsx",
      };
      this.$refs.agGrid.api.exportDataAsCsv(params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
