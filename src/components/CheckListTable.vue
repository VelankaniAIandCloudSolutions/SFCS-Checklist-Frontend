<template>
  <div>
    <ag-grid-vue
      ref="agGrid"
      style="height: 550px"
      class="ag-theme-quartz"
      :rowData="checklistItems"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @firstDataRendered="onFirstDataRendered"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
      @rowDeselected="onRowDeselected"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>

    <!-- Button trigger modal -->

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1
              class="modal-title fs-5 font-weight-bold"
              id="exampleModalLabel"
            >
              Change The Present Quantity
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
              <label for="editedQuantity" class="form-label"
                >Present Quantity</label
              >
              <textarea
                id="editedQuantity"
                class="form-control"
                v-model="activeRow.present_quantity"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="reasonForChange" class="form-label"
                >Reason For Change</label
              >
              <textarea
                id="reasonForChange"
                class="form-control"
                v-model="activeRow.present_quantity_change_note"
              ></textarea>
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
              @click="updatePresentQuantity"
              data-bs-dismiss="modal"
              :disabled="!activeRow.present_quantity_change_note"
            >
              Save changes
            </button>
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
import axios from "axios";

export default {
  props: {
    checklistItems: {
      type: Array,
      required: true,
    },
  },
  components: {
    AgGridVue,
  },
  watch: {
    // Watch for changes in the 'checklistItems' prop
    checklistItems: function (newData, oldData) {
      console.log("watch called");
      console.log("new", newData);
      // Check if the new data is different from the old data
      if (newData !== oldData) {
        // Set the grid data to the new data
        this.gridApi.setRowData(newData);

        // Refresh the grid to reflect the changes
        this.gridApi.refreshCells({ force: true });
      }
    },
  },
  data() {
    // console.log("Reason for change initialized:", this.reasonForChange);
    return {
      reasonForChange: "",
      gridApi: null,
      isGridReady: false, // Flag to track grid readiness
      colDefs: [
        {
          headerName: "VEPL Part No",
          field: "bom_line_item.part_number",
        },
        {
          headerName: "UID",
          field: "checklist_item_uids",
          valueFormatter: function (params) {
            // Check if checklist_item_uids is empty or null
            if (!params.value || params.value.length === 0) {
              return null;
            }
            // Extract UIDs from the array of objects and join them with commas
            const uids = params.value.map((item) => item.uid);

            // Return the joined string of UIDs
            return uids.join(", ");
          },
        },

        {
          headerName: "Present Quantity",
          field: "present_quantity",
          cellRenderer: (params) => {
            const button = document.createElement("button");
            button.classList.add(
              "btn",
              "btn-sm",
              "btn-outline-primary",
              "edit-button"
            );
            button.innerHTML = '<i class="far fa-edit"></i>';
            button.dataset.bsToggle = "modal"; // Set data-bs-toggle attribute
            button.dataset.bsTarget = "#exampleModal"; // Set data-bs-target attribute
            button.addEventListener("click", () => {
              this.setActiveRow(params);
            });

            const container = document.createElement("div");
            container.classList.add(
              "present-quantity-cell",
              "d-flex",
              "align-items-center"
            );
            container.innerHTML = `
      <span class="me-5">${params.value}</span>`;
            container.appendChild(button);

            return container;
          },
        },

        {
          headerName: "Required Quantity",
          field: "required_quantity",
        },
        {
          headerName: "Delta",
          valueGetter: function (params) {
            const presentQuantity = params.data.present_quantity;
            const requiredQuantity = params.data.required_quantity;
            const delta = presentQuantity - requiredQuantity;
            return delta >= 0 ? `+${delta}` : `-${Math.abs(delta)}`;
          },
        },

        // {
        //   headerName: "Is Present",
        //   field: "is_present",
        // },
        // {
        //   headerName: "Is Quantity Sufficient",
        //   field: "is_quantity_sufficient",
        // },
        {
          headerName: "Is Present",
          field: "is_present",
          cellRenderer: (params) =>
            params.value
              ? '<i class="fas fa-check-circle text-success"></i>'
              : '<i class="fa-solid fa-circle-xmark text-danger"></i>',
        },
        {
          headerName: "Is Quantity Sufficient",
          field: "is_quantity_sufficient",
          cellRenderer: (params) =>
            params.value
              ? '<i class="fas fa-check-circle text-success"></i>'
              : '<i class="fa-solid fa-circle-xmark text-danger"></i>',
        },
        {
          headerName: "Updated At",
          field: "updated_at",
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
      activeRow: {},
      editedQuantity: "", // Textarea model for edited quantity
    };
  },
  mounted() {},
  methods: {
    // fetchData() {
    //   // Simulate API response
    //   const newStatus = Math.random() < 0.5; // Randomly set true or false
    //   this.rowData[0].Status = newStatus;
    //   this.rowData[0].Quantity = Math.floor(Math.random() * 20) + 1; // Random Quantity
    //   this.rowData[0].Required_Quantity = Math.floor(Math.random() * 10) + 1; // Random Required Quantity
    //   if (this.rowData[0].Quantity >= 5) {
    //     this.rowData[0].Status = true;
    //   }

    //   // Refresh the grid
    //   // this.gridApi.setRowData(this.rowData);
    // },
    setActiveRow(params) {
      console.log("isnide setActiveRow");
      console.log("thsi si aprams data", params.data);
      this.activeRow = params.data; // Set the active row
    },

    statusCellRenderer(params) {
      return params.value ? "✔" : "✘"; // Replace with your logic
    },
    onRowClicked(params) {
      // Emit an event with the clicked row data
      // this.editedQuantity = params.data.present_quantity;
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
      this.onSelectionChanged();
    },
    onRowDeselected() {
      this.onSelectionChanged();
    },
    onSelectionChanged() {
      this.selectedRows = this.gridApi.getSelectedRows();
    },
    onFirstDataRendered(params) {
      // Access the grid API after the grid has been fully rendered
      if (params.api) {
        this.gridApi = params.api;
        this.isGridReady = true; // Set the flag to true when the grid is ready
      }
    },
    onGridReady(params) {
      // Store the grid API reference when the grid is ready
      this.gridApi = params.api;
      this.isGridReady = true; // Set the flag to true when the grid is ready
    },
    updatePresentQuantity() {
      // Make API call to update present quantity
      console.log("id of checklist item clicked", this.activeRow.id);
      console.log("quantity", this.activeRow.present_quantity);
      console.log("reason for change", this.reasonForChange);

      axios
        .put(`store/update-checklist-item/${this.activeRow.id}/`, {
          present_quantity: this.activeRow.present_quantity,
          reason_for_change: this.activeRow.present_quantity_change_note,
        })
        .then((response) => {
          console.log("Present quantity updated successfully:", response.data);

          this.$emit("checklistItemUpdated", response.data);

          this.$notify({
            title: "Present quantity updated successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });

          // Hide the modal after successful update
          // Optionally, you can emit an event or perform any necessary actions here
        })
        .catch((error) => {
          console.error(
            "Error updating present quantity:",
            error.response.data.message
          );

          this.$notify({
            title: error.response.data.message,
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
