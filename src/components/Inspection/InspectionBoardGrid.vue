<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="inspectionBoards"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
    >
    </ag-grid-vue>

    <!-- Board Photo Modal -->

    <div
      class="modal fade"
      id="BoardPhotoModal"
      tabindex="-1"
      aria-labelledby="boardPhotoLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="boardPhotoModalLabel">
              Inspection Board Photo
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img
              :src="this.selectedBoardPhotoUrl"
              alt="Inspection Board Photo"
              class="img-fluid"
            />.
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
// import axios from "axios";
export default {
  components: {
    AgGridVue,
  },
  props: {
    inspectionBoards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
        { headerName: "Board Name", field: "name", width: 300 },
        { headerName: "Created At", field: "created_at", width: 300 },
        // { headerName: "Created By", field: "created_by" },

        {
          headerName: "View Board Photo",
          cellRenderer: this.viewBoardPhotoButtonRenderer,
          width: 300,
        },
        {
          headerName: "View Defect Details",
          cellRenderer: this.viewButtonRenderer,
          width: 300,
        },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
      },
      gridApi: null,
      selectedBoardPhotoUrl: "",
      // total_completed: 0,
      // total_in_progress: 0,
      // total_failed: 0,
      // total_checklists: 0,
    };
  },
  mounted() {},
  methods: {
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
    // onFirstDataRendered() {
    //   this.calculateTotalSum();
    //   this.gridApi.addEventListener("filterChanged", this.calculateTotalSum);
    // },
    onGridReady(params) {
      this.gridApi = params.api;
    },

    viewButtonRenderer(params) {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-eye"></i>`; // Use an eye icon for view
      button.classList.add("btn", "btn-outline-secondary");
      button.addEventListener("click", () => this.onViewClick(params.data));
      return button;
    },
    onViewClick(data) {
      console.log(data);
      this.$router.push(`/defect-recognition/${data.id}`);
    },
    viewBoardPhotoButtonRenderer(params) {
      // console.log(params.data);
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-microchip"></i>`; // FontAwesome icon for board photo
      button.classList.add("btn", "btn-outline-secondary");
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#BoardPhotoModal");
      button.addEventListener("click", () => {
        this.selectedBoardPhotoUrl = params.data.inspection_board_image_url;
      });
      // button.addEventListener("click", () =>
      //   this.onViewBoardPhotoClick(params.data)
      // );
      return button;
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
