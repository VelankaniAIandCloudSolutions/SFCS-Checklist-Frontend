<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 550px"
      class="ag-theme-quartz"
      :rowData="checklist_uids"
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
  props: {
    checklist_uids: {
      type: Array,
      required: true,
    },
  },
  components: {
    AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      isGridReady: false, // Flag to track grid readiness
      colDefs: [
        {
          headerName: "UID",
          field: "uid",
          checkboxSelection: true,
        },
        {
          headerName: "VEPL Part No",
          field: "checklist_item.bom_line_item.part_number",
        },

        {
          headerName: "Updated At",
          field: "updated_at",
        },
        {
          headerName: "File",
          //   field: "iqc_file",
          cellRenderer: this.fileCellRenderer,
        },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
        domLayout: "autoHeight",
      },
      selectedRows: [],
    };
  },
  mounted() {},
  methods: {
    fileCellRenderer(params) {
      //   console.log("here is the params data", params.data);
      const file = params.data && params.data.iqc_file_url;
      if (file) {
        // If file exists, render a blue link for downloading
        const fileName = file.split("/").pop();
        const link = document.createElement("a");
        link.href = params.data.iqc_file_url; // Use iqc_file_url from the backend
        link.textContent = fileName; // Display the file name
        link.style.color = "blue";
        link.download = true;
        return link;
      } else {
        // If no file, render an upload button
        const uploadButton = document.createElement("button");
        uploadButton.innerHTML = `<i class="fas fa-upload"></i>`;
        uploadButton.classList.add("btn-sm", "btn-secondary");
        uploadButton.addEventListener("click", this.uploadFile);
        return uploadButton;
      }
    },
    uploadFile() {
      // Implement your upload file functionality here
      // You can emit an event or open a modal for file upload
      console.log("Upload file functionality");
    },

    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        this.$emit("rowDeselected");
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
