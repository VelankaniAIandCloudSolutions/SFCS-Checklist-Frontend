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
    },

    // exportToCsv() {
    //   const params = {
    //     fileName: "maintenance_plans.csv",
    //   };
    //   this.$refs.agGrid.api.exportDataAsCsv(params);
    // },
    // exportToExcel() {
    //   const params = {
    //     fileName: "maintenance_plans.xlsx",
    //   };
    //   this.$refs.agGrid.api.exportDataAsExcel(params);
    // },

    // exportToExcel() {
    //   const params = {
    //     fileName: "maintenance_plans.xlsx",
    //   };
    //   const rowData = this.maintenance_plans;

    //   // Convert data to Excel format
    //   const worksheet = xlsxUtils.json_to_sheet(rowData);
    //   const workbook = xlsxUtils.book_new();
    //   xlsxUtils.book_append_sheet(workbook, worksheet, "Sheet1");

    //   // Save the workbook as a file
    //   xlsxUtils.writeFile(workbook, `${params.fileName}`);
    // },
  },
};
</script>

<style lang="scss" scoped></style>
