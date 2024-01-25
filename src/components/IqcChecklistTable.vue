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
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Upload IQC File
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <!-- Separate file input for the modal -->
              <input
                type="file"
                class="form-control"
                id="modalFileInput"
                @change="handleModalFileUpload"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="uploadFileModal"
              data-bs-dismiss="modal"
            >
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      isGridReady: false,
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
      selectedFile: null,
      activeChecklistItemUidId: "", // Variable to store active checklist item UID
    };
  },

  methods: {
    fileCellRenderer(params) {
      const file = params.data && params.data.iqc_file_url;
      if (file) {
        const fileName = file.split("/").pop();
        const link = document.createElement("a");
        link.href = params.data.iqc_file_url;
        link.textContent = fileName;
        link.style.color = "blue";
        link.download = true;
        return link;
      } else {
        const uploadButton = document.createElement("button");
        uploadButton.innerHTML = `<i class="fas fa-upload me-1"></i> Upload IQC File`;
        uploadButton.classList.add("btn-sm", "btn-primary");

        // Save the UID ID for later use
        const uidId = params.data.id;
        uploadButton.addEventListener("click", () => this.triggerModal(uidId));

        uploadButton.setAttribute("data-bs-toggle", "modal");
        uploadButton.setAttribute("data-bs-target", "#exampleModal");
        return uploadButton;
      }
    },

    triggerModal(uidId) {
      this.activeChecklistItemUidId = uidId;
      // Do not trigger the file input here
    },

    uploadFileModal() {
      console.log("Upload file functionality");
      console.log("this is the file=", this.selectedFile);
      this.$store.commit("setIsLoading", true);

      if (this.activeChecklistItemUidId && this.selectedFile) {
        // Create a FormData object
        const formData = new FormData();

        // Append the file to the FormData object with a key (e.g., 'iqc_file')
        formData.append("iqc_file", this.selectedFile);
        formData.append("checklist_item_uid_id", this.activeChecklistItemUidId);

        // Make a POST request using Axios
        axios
          .post("store/upload-iqc-file/", formData)
          .then((response) => {
            // Handle the response
            this.$store.commit("setIsLoading", false);
            console.log("File uploaded successfully", response.data);

            this.$notify({
              title: "File Uploaded Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            const allRowsHaveFile = this.checklist_uids.every(
              (row) => row.iqc_file_url
            );

            if (allRowsHaveFile) {
              // Emit the event indicating that IQC check passed
              this.$emit("iqcCheckPassed");
            }
            // window.location.reload();
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Adjust the timeout as needed

            this.$store.commit("setIsLoading", false);

            // Optionally, you can emit an event or perform other actions based on the response
          })
          .catch((error) => {
            // Handle errors
            console.error("Error uploading file", error);
            this.$notify({
              title: "File Upload Unsuccessful",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
            this.$store.commit("setIsLoading", false);
          });

        // Reset the active checklist item UID after upload
        this.activeChecklistItemUidId = "";
      } else {
        console.warn("No file selected or active checklist item UID.");
        this.$notify({
          title: "Please Select A File to Upload",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        this.$store.commit("setIsLoading", false);
      }
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

    // Separate handler for the file input in the modal
    handleModalFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
