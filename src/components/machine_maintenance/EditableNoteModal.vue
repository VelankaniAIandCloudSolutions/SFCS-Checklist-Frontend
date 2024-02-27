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
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">
            <strong style="color: #333">{{ modalTitle }}</strong>
          </h4>
        </div>
        <div class="modal-body">
          <textarea v-model="note" class="form-control" rows="4"></textarea>
        </div>
        <div class="modal-footer">
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
  },
  data() {
    return {
      note: "",
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

    // async saveChanges() {
    //   axios
    //     .put(
    //       `/machine-maintenance/update-or-delete-maintenance-activity-note/${this.selectedEvent.maintenancePlanId}`,
    //       {
    //         note: this.note,
    //       }
    //     )
    //     .then((response) => {
    //       // Handle successful update response
    //       if (response.status === 200 || response.status === 204) {
    //         // Update was successful
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
    // },

    closeModal() {
      this.$emit("close-modal");
    },

    // MarkDate() {
    //   // Make API call using Axios
    //   console.log("create maintenance activity called");
    //   axios
    //     .post(
    //       "/machine-maintenance/create-or-delete-maintenance-activity",
    //       this.selectedEvent
    //     )
    //     .then((response) => {
    //       console.log("Response:", response.data);
    //       // Handle success response here
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //       // Handle error here
    //     });
    // },
    async saveChanges() {
      console.log("this is the note", this.note);

      if (!this.note.trim()) {
        // Show an error message or throw an error
        // For example, you can show a notification or throw an error
        this.$notify({
          title: "Error: Note Field Cannot be empty",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        return; // Exit the method if the note is empty
      }
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
        const note = this.note;

        axios
          .post("/machine-maintenance/create-maintenance-activity", {
            id: id,
            note: note,
          })
          .then((response) => {
            console.log("Response:", response.data);
            // Emit an event to notify the parent component (calendar) about the color change
            // this.$emit("event-color-updated", {
            //   eventId: this.selectedEvent.id,
            //   newColor: "green",
            //   createdNote: note,
            // });
            // Handle success response here
            this.$emit(
              "date-marked-maintenance-activity-created",
              response.data.maintenance_plans
            );
            this.closeModal();

            // Display success notification for creation
            this.$notify({
              title: "Maintenance Activity Created Successfully with the note",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle error here
            // Display error notification
            this.$notify({
              title: "Error creating note",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          });
      } else if (this.selectedEvent.color === "green") {
        // If the event is green, it means it's an existing note
        console.log("put api called to update the activity note");

        axios
          .put(
            `/machine-maintenance/update-or-delete-maintenance-activity/${this.selectedEvent.extendedProps.id}/`,
            {
              note: this.note,
            }
          )
          .then((response) => {
            // Handle successful update response
            if (response.status === 200 || response.status === 204) {
              // Update was successful
              this.$emit(
                "maintenance-activity-note-updated",
                response.data.maintenance_plans
              );
              this.closeModal();
              // Display success notification for update
              this.$notify({
                title: "Note Updated Successfully",
                type: "bg-success-subtle text-success",
                duration: "5000",
              });
            }
          })
          .catch((error) => {
            console.error("Error updating note:", error);
            // Handle error
            // Display error notification
            this.$notify({
              title: "Error updating note",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
/* Add your modal styling here */
</style>
