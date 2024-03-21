<template>
  <div class="d-flex flex-column" style="height: 600px">
    <!-- Dropdown for export options -->
    <div class="dropdown align-self-end" style="margin-bottom: 10px">
      <button
        class="btn-sm btn-primary dropdown-toggle"
        type="button"
        id="exportDropdown"
        @click="toggleDropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Export
      </button>
      <div
        class="dropdown-menu"
        :class="{ show: isDropdownOpen }"
        aria-labelledby="exportDropdown"
        style="z-index: 1000"
      >
        <button @click="exportToCsv" class="dropdown-item" type="button">
          Export to CSV
        </button>
        <button @click="exportToExcel" class="dropdown-item" type="button">
          Export to Excel
        </button>
      </div>
    </div>

    <!-- Ag-Grid -->
    <ag-grid-vue
      ref="agGrid"
      style="flex-grow: 1"
      class="ag-theme-quartz"
      :rowData="maintenance_plans"
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
import * as XLSX from "xlsx";

// import utils from "xlsx";
// import * as XLSX from "xlsx";

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
      isDropdownOpen: false,

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
          headerName: "Maintenance Activity Compelted:",
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
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    customMachineLineNameRenderer(params) {
      const machineName = params.data.machine.name; // Assuming machine name is directly accessible
      const lineName = params.data.machine.line.name; // Assuming line name is nested under 'line' property
      return `${machineName} - ${lineName}`;
    },
    customActivityRenderer(params) {
      const maintenancePlan = params.data;
      if (
        maintenancePlan.maintenance_activities.length > 0 &&
        maintenancePlan.maintenance_activities[0].is_completed === true
      ) {
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
      // Retrieve the column definitions from Ag-Grid
      const columnDefs = this.$refs.agGrid.api.getColumnDefs();

      // Extract column names
      const columnNames = columnDefs.map((colDef) => colDef.headerName);

      // Retrieve the raw row data from the Ag-Grid instance
      const rowData = this.$refs.agGrid.api
        .getModel()
        .rowsToDisplay.map((row) => row.data);

      // Transform the data to match the rendering logic of your custom cell renderers
      const transformedData = rowData.map((row) => ({
        id: row.id,
        maintenance_date: row.maintenance_date,
        machine_line_name: this.customMachineLineNameRenderer({ data: row }),
        maintenance_activity_type: row.maintenance_activity_type.name,
        maintenance_activity_performed: this.customActivityRenderer({
          data: row,
        }),
        maintenance_activity_performed_by:
          this.customActivityPerformedByRenderer({
            value: row.maintenance_activities,
          }),
        date_time_performed: this.customDateTimePerformedRenderer({
          value: row.maintenance_activities,
        }),
        activity_note: this.customActivityNoteRenderer({
          value: row.maintenance_activities,
        }),
      }));

      // Replace HTML content with text values for "Done" and "Not Done"
      transformedData.forEach((row) => {
        if (
          row.maintenance_activity_performed ===
          '<span style="color: green">&#10004;</span>'
        ) {
          row.maintenance_activity_performed = "Done";
        } else if (
          +row.maintenance_activity_performed ===
          '<span style="color: red">&#10008;</span>'
        ) {
          row.maintenance_activity_performed = "Not Done";
        }
      });

      // Include column names as the first row
      const csvContent = [
        columnNames.join(","),
        ...transformedData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      // Create a Blob containing the CSV data
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a link element and trigger a click event to download the CSV file
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "maintenance_plans.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.toggleDropdown();
    },
    exportToExcel() {
      // Retrieve the column definitions from Ag-Grid
      const columnDefs = this.$refs.agGrid.api.getColumnDefs();

      // Extract column names
      const columnNames = columnDefs.map((colDef) => colDef.headerName);

      // Retrieve the raw row data from the Ag-Grid instance
      const rowData = this.$refs.agGrid.api
        .getModel()
        .rowsToDisplay.map((row) => row.data);

      // Transform the data to match the rendering logic of your custom cell renderers
      const transformedData = rowData.map((row) => ({
        id: row.id,
        maintenance_date: row.maintenance_date,
        machine_line_name: this.customMachineLineNameRenderer({ data: row }),
        maintenance_activity_type: row.maintenance_activity_type.name,
        maintenance_activity_performed: this.customActivityRenderer({
          data: row,
        }),
        maintenance_activity_performed_by:
          this.customActivityPerformedByRenderer({
            value: row.maintenance_activities,
          }),
        date_time_performed: this.customDateTimePerformedRenderer({
          value: row.maintenance_activities,
        }),
        activity_note: this.customActivityNoteRenderer({
          value: row.maintenance_activities,
        }),
      }));

      // Replace HTML content with text values for "Done" and "Not Done"
      transformedData.forEach((row) => {
        if (
          row.maintenance_activity_performed ===
          '<span style="color: green">&#10004;</span>'
        ) {
          row.maintenance_activity_performed = "Done";
        } else if (
          row.maintenance_activity_performed ===
          '<span style="color: red">&#10008;</span>'
        ) {
          row.maintenance_activity_performed = "Not Done";
        }
      });

      // Include column names as the first row
      const excelData = [
        columnNames,
        ...transformedData.map((row) => Object.values(row)),
      ];

      // Convert data to Excel format
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance Plans");

      // Save the workbook as a file
      XLSX.writeFile(workbook, "maintenance_plans.xlsx");

      // Close the dropdown after exporting
      this.toggleDropdown();
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item:hover {
  background-color: rgba(
    0,
    0,
    0,
    0.1
  ); /* Adjust the background color as needed */
}
</style>
