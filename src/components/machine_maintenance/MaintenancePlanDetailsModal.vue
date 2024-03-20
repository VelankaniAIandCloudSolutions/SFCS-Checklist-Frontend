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
        <!-- Modal header -->
        <div class="modal-header bg-primary text-light">
          <h4 class="modal-title" id="myModalLabel">Maintenance Details</h4>
          <button
            type="button"
            class="close text-light"
            aria-label="Close"
            @click="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <p class="mb-2"><strong>Maintenance Date:</strong></p>
              <p>{{ formattedDate }}</p>
              <p class="mb-2"><strong>Performed By:</strong></p>
              <p>{{ selectedEvent.extendedProps.created_by_name }}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-2"><strong>Maintenance Time:</strong></p>
              <p>{{ formattedTime }}</p>
              <p class="mb-2"><strong>Note:</strong></p>
              <p>{{ selectedEvent.extendedProps.note }}</p>
            </div>
          </div>
          <!-- Maintenance Activity Status Row -->
          <div class="row justify-content-center">
            <div class="col-md-6 text-center">
              <p class="mb-2"><strong>Maintenance Activity Status:</strong></p>
              <span
                v-if="
                  selectedEvent.extendedProps.maintenance_activity_completed
                "
                class="status-icon text-success"
              >
                <i class="fas fa-check fa-2x"></i>
              </span>
              <span v-else class="status-icon text-danger">
                <i class="fas fa-times fa-2x"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button class="btn btn-danger" @click="confirmDeleteMaintenancePlan">
            Delete Maintenance Plan
          </button>
          <button
            class="btn btn-warning"
            @click="confirmDeleteMaintenanceActivity"
          >
            Delete Maintenance Activity
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
  },
  computed: {
    formattedDate() {
      return this.extractDate(this.selectedEvent.extendedProps.created_at);
    },
    formattedTime() {
      return this.extractTime(this.selectedEvent.extendedProps.created_at);
    },
  },
  methods: {
    extractDate(dateTimeString) {
      const [datePart, timePart] = dateTimeString.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedDate = new Date(`${year}-${month}-${day}T${timePart}`);
      return formattedDate.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
    },
    extractTime(dateTimeString) {
      const [datePart, timePart] = dateTimeString.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedTime = new Date(`${year}-${month}-${day}T${timePart}`);
      return formattedTime.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    confirmDeleteMaintenancePlan() {
      if (
        window.confirm("Are you sure you want to delete this maintenance plan?")
      ) {
        this.deleteMaintenancePlan();
      }
    },
    async deleteMaintenancePlan() {
      axios
        .delete(
          `/machine-maintenance/delete-maintenance-plan/${this.selectedEvent.extendedProps.id}`
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
          `/machine-maintenance/update-or-delete-maintenance-activity-new/${this.selectedEvent.extendedProps.id}`
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
  },
};
</script>

<style scoped>
/* Add your modal styling here */
</style>
