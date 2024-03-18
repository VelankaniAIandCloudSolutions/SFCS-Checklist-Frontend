<template>
  <div
    v-if="show"
    class="modal fade show"
    id="myModal"
    tabindex="-1"
    aria-labelledby="myModalLabel"
    aria-modal="true"
    role="dialog"
    style="display: block"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">
            <strong style="color: #333">{{ modalTitle }}</strong>
          </h4>
        </div>
        <div class="modal-body">
          <textarea v-model="note" class="form-control" rows="4"></textarea>
          <!-- <div class="form-check mt-4">
            <input
              class="form-check-input"
              type="checkbox"
              id="applyToAll"
              v-model="applyToAllMachines"
            />
            <label class="form-check-label" for="applyToAll">
              Apply to all machines of the line
            </label>
          </div> -->
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-warning"
            @click="confirmDeleteMaintenancePlanLineWise"
          >
            Delete Maintenance Plan
          </button>
          <button
            class="btn btn-danger"
            :disabled="modalTitle === 'Add Note'"
            @click="confirmDeleteMaintenanceActivity"
          >
            Delete Maintenance Activity
          </button>
          <button class="btn btn-primary" @click="saveChanges">
            Save Changes
          </button>
          <button class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="show"
    class="modal-backdrop fade show"
    id="backdrop"
    style="display: block"
  ></div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedEvent: {
      type: Object,
      required: true,
    },
    modalTitle: {
      type: String,
      required: true,
    },
    selectedLineId: {
      type: Number,
      required: true,
    },
    selectedTypeId: {
      type: Number,
      required: true,
    },
    maintenancePlanInfo: {
      type: Object,
      required: true,
    },
    clickedFormattedDate: {
      type: String, // Define the type as String
      required: true,
    },
  },
  data() {
    return {
      note: "",
      applyToAllMachines: false,
    };
  },
  watch: {
    selectedEvent: {
      handler(newVal) {
        if (newVal && newVal.extendedProps && newVal.extendedProps.note) {
          this.note = newVal.extendedProps.note;
        } else {
          this.note = "";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    confirmDeleteMaintenancePlanLineWise() {
      if (
        window.confirm(
          "Are you sure you want to delete this  maintenance Plan for all the machines of this line?"
        )
      ) {
        this.deleteMaintenancePlanLineWise();
      }
    },

    async deleteMaintenancePlanLineWise() {
      const selectedLineId = this.selectedLineId;
      // const selectedTypeId = this.selectedTypeId;

      // Create the form data object
      const formData = {
        line_id: selectedLineId,
        selectedDate: this.selectedEvent.extendedProps.maintenance_plan_date,
        selectedActivityTypeCode: this.selectedEvent.title,
      };

      console.log("thsi is the form data", formData);
      axios
        .post(
          "/machine-maintenance/delete-maintenance-plan-line-wise/",
          formData
        )
        .then((response) => {
          // Handle successful deletion response
          if (response.status === 200 || response.status === 204) {
            // Deletion was successful
            this.$emit(
              "maintenance-plan-deleted",
              response.data.maintenance_plans
            );

            this.closeModal();

            // Display success notification for deletion
            this.$notify({
              title: " Maintenance Plan Deleted Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
          }
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
          // Handle error
          // Display error notification
          this.$notify({
            title: "Error deleing Maintenance Plan",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },

    confirmDeleteMaintenanceActivity() {
      if (
        window.confirm(
          "Are you sure you want to delete this maintenance activity?"
        )
      ) {
        this.deleteMaintenanceActivity();
      }
    },
    async deleteMaintenanceActivity() {
      axios
        .delete(
          `/machine-maintenance/update-or-delete-maintenance-activity/${this.selectedEvent.extendedProps.id}`
        )
        .then((response) => {
          // Handle successful deletion response
          if (response.status === 200 || response.status === 204) {
            // Deletion was successful
            this.$emit(
              "maintenance-activity-deleted",
              response.data.maintenance_plans
            );

            this.closeModal();

            // Display success notification for deletion
            this.$notify({
              title: "Date Unmarked and Maintenance Activity Deleted",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
          }
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
          // Handle error
          // Display error notification
          this.$notify({
            title: "Error deleing Maintenance Activity",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },

    closeModal() {
      this.$emit("close-modal");
    },

    async saveChanges() {
      console.log("this is the note =", this.note);

      // if (!this.note.trim()) {
      //   // Show an error message or throw an error
      //   // For example, you can show a notification or throw an error
      //   this.$notify({
      //     title:
      //       "Error: Note Field Cannot be empty, please provide a valid note.",
      //     type: "bg-danger-subtle text-danger",
      //     duration: "5000",
      //   });
      //   return; // Exit the method if the note is empty
      // }

      // const applyToAll = this.applyToAllMachines ? true : false;
      console.log("first time maitnenace activity date markign creation api");

      console.log(
        "isnide save changes api starting..loggin selected events =",
        this.selectedEvent
      );

      if (
        this.selectedEvent.extendedProps.color === "orange" ||
        this.selectedEvent.extendedProps.color == "red"
      ) {
        // If the event is orange, it means it's a new note
        const id = this.selectedEvent.extendedProps.id;
        // const clickedMaintenancePlanDate =
        this.selectedEvent.extendedProps.maintenance_plan_date;
        const note = this.note;
        const selectedLineId = this.selectedLineId;
        // const clickedFormattedDate = this.clickedFormattedDate;

        console.log(" maintenance plan ID:", id);
        // console.log("Clicked Date:", clickedMaintenancePlanDate);
        console.log("Note:", note);
        console.log("Selected Line ID:", selectedLineId);
        // console.log("Clicked Formatted Date:", clickedFormattedDate);

        // axios
        //   .post("/machine-maintenance/create-maintenance-activity", {
        //     id: id,
        //     note: note,
        //     clickedMaintenancePlanDate:  clickedMaintenancePlanDate,
        //     clicked_maintenance_date:clicked_maintenance_date;
        //   })
        //   .then((response) => {
        //     console.log("Response:", response.data);

        //     this.$emit(
        //       "date-marked-maintenance-activity-created",
        //       response.data.maintenance_plans
        //     );
        //     this.closeModal();

        //     // Display success notification for creation
        //     this.$notify({
        //       title: "Maintenance Activity Created Successfully with the note",
        //       type: "bg-success-subtle text-success",
        //       duration: "5000",
        //     });
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //     // Handle error here
        //     // Display error notification
        //     this.$notify({
        //       title: "Error creating note",
        //       type: "bg-danger-subtle text-danger",
        //       duration: "5000",
        //     });
        //   });
        // } else if (this.selectedEvent.color === "green") {
        //   // If the event is green, it means it's an existing note
        //   console.log("put api called to update the activity note");

        //   axios
        //     .put(
        //       `/machine-maintenance/update-or-delete-maintenance-activity/${this.selectedEvent.extendedProps.id}/`,
        //       {
        //         note: this.note,
        //       }
        //     )
        //     .then((response) => {
        //       // Handle successful update response
        //       if (response.status === 200 || response.status === 204) {
        //         // Update was successful
        //         this.$emit(
        //           "maintenance-activity-note-updated",
        //           response.data.maintenance_plans
        //         );
        //         this.closeModal();
        //         // Display success notification for update
        //         this.$notify({
        //           title: "Note Updated Successfully",
        //           type: "bg-success-subtle text-success",
        //           duration: "5000",
        //         });
        //       }
        //     })
        //     .catch((error) => {
        //       console.error("Error updating note:", error);
        //       // Handle error
        //       // Display error notification
        //       this.$notify({
        //         title: "Error updating note",
        //         type: "bg-danger-subtle text-danger",
        //         duration: "5000",
        //       });
        //     });
      }
    },
  },
};
</script>

<style scoped>
/* Add your modal styling here */
</style>
