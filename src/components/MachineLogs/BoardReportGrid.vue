<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="boardLogs"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      :rowSelection="'single'"
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
    boardLogs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
        {
          headerName: "Board Serial No",
          field: "board_serial_number",
        },
        {
          headerName: "Machine",

          valueGetter: function (params) {
            // Access the machines array for the current row
            const machines = params.data.machines;
            // Check if machines array is not empty
            if (machines && machines.length > 0) {
              // Return the name of the first machine
              return machines[0].name;
            }
            // If no machines or empty array, return null or empty string
            return null; // or return '';
          },
        },
        {
          field: "date",
          headerName: "Date",
          cellRenderer: function (params) {
            // Get the date from the row data
            const date = params.data.date;
            // Check if the date is available
            if (date) {
              // Split the date string into year, month, and day
              const [year, month, day] = date.split("-");
              // Format the date as dd-mm-yyyy
              return `${day}-${month}-${year}`;
            } else {
              // If date is not available, render an empty cell
              return "";
            }
          },
        },
        {
          field: "log_file_url",
          headerName: "Log File",
          cellRenderer: function (params) {
            if (params.value) {
              // Create a button element with Bootstrap classes and eye icon
              var button = document.createElement("button");
              button.className = "btn btn-sm btn-outline-primary";
              button.innerHTML = '<i class="fas fa-eye"></i>';

              // Add event listener to open the link in a new tab when clicked
              button.addEventListener("click", function () {
                window.open(params.value, "_blank");
              });

              // Return the button element
              return button;
            } else {
              return "";
            }
          },
        },

        {
          field: "begin_date_time",
          headerName: "BeginTime",
          valueGetter: function (params) {
            // Get the begin_date_time from the row data
            const beginDateTime = params.data.begin_date_time;
            if (!beginDateTime) {
              return "-";
            }
            // Convert to IST
            const beginTime = new Date(beginDateTime).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "Asia/Kolkata",
              }
            );
            return beginTime;
          },
        },
        {
          field: "end_date_time",
          headerName: "EndTime",
          valueGetter: function (params) {
            // Get the end_date_time from the row data
            const endDateTime = params.data.end_date_time;
            if (!endDateTime) {
              return "-";
            }
            // Convert to IST
            const endTime = new Date(endDateTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZone: "Asia/Kolkata",
            });
            return endTime;
          },
        },

        {
          field: "result",
          headerName: "Result",
        },

        // {
        //   headerName: "Download",
        //   cellRenderer: this.editButtonRenderer,
        //   flex: 1,
        // },
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
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    // onRowSelected(params) {
    //   // Emit an event with the selected row data
    //   if (params.node.isSelected()) {
    //     this.$emit("rowSelected", params.node.data);
    //   }
    // },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        this.$emit("rowDeselected");
      }
    },
    editButtonRenderer(params) {
      console.log(params);
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-download"></i>`;
      button.classList.add("btn-sm", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () =>
        this.downloadFile(params.data.bom.bom_file_url)
      );
      return button;
    },
    downloadFile(fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Open in a new tab
      link.download = "BOM_File"; // You can set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>

<style scoped></style>
