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
            <strong style="color: #333">Create Maintenance Plan</strong>
          </h4>
        </div>
        <div class="modal-body">
          <!-- Description Textarea -->
          <div class="mb-3">
            <label for="description" class="form-label"
              >Description (Optional)</label
            >
            <textarea
              v-model="description"
              class="form-control"
              rows="4"
              id="description"
            ></textarea>
          </div>
          <!-- Activity Type Dropdown -->
          <div class="mb-3">
            <label for="activityType" class="form-label">Activity Type</label>
            <select
              v-model="selectedActivityType"
              class="form-select"
              id="activityType"
            >
              <option disabled value="">Select Activity Type</option>
              <option
                v-for="type in maintenanceActivityTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>
          <!-- Other information can be passed as props -->
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="createMaintenancePlan">
            Create
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
    selectedLineId: {
      type: Number,
      required: true,
    },
    maintenanceActivityTypes: {
      type: Array,
      required: true,
    },
    maintenancePlanInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      description: "",
      selectedActivityType: "",
    };
  },
  //   created() {
  //     console.log("show:", this.show);
  //     console.log("selectedEvent:", this.selectedEvent);
  //     console.log("maintenance_activity_types:", this.maintenance_activity_types);
  //     console.log("maitnneplan info:", this.maintenancePlanInfo);
  //   },

  methods: {
    createMaintenancePlan() {
      // Create a new object to hold the maintenance plan data

      // Get selected date string

      // Convert the selected date string to a datetime.date object
      const selectedLineId = this.selectedLineId;

      // Create the form data object
      const formData = {
        description: this.description,
        selectedActivityType: this.selectedActivityType,
        machineId: this.maintenancePlanInfo.selectedMachine.id,
        line_id: selectedLineId,
        selectedDate: this.maintenancePlanInfo.selectedDate,
      };

      // Log the complete form data
      console.log("Form Data:", formData);

      // Call the API to create the maintenance plan
      axios
        .post(
          "/machine-maintenance/create-maintenance-plan-by-clicking-new-for-all-machines-of-a-line/",
          formData
        )
        .then((response) => {
          // Handle success response
          console.log("Maintenance plan created:", response.data);

          // Emit an event to notify the parent component (if needed)
          this.$notify({
            title: "Maintenance Plan Created",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });

          this.$emit(
            "maintenance-plan-created-by-clicking",
            response.data.maintenance_plans
          );
          this.closeModal();
        })
        .catch((error) => {
          // Handle error response
          console.error("Error creating maintenance plan:", error);
          this.$notify({
            title: "Error creating Maintenance Plan",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });

          // Display error notification or perform other error handling
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
