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
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">
            <strong style="color: #333">Delete Maintenance Plan</strong>
          </h4>
        </div>
        <!-- Modal body -->
        <div class="modal-body-lg">
          <p class="text-center">
            <strong
              >Do you want to delete this maintenance plan for all machines of
              this line on this date?</strong
            >
          </p>
        </div>
        <!-- Modal footer -->
        <div class="modal-footer">
          <button class="btn btn-danger" @click="deleteMaintenancePlanLineWise">
            Yes
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
  },
  methods: {
    deleteMaintenancePlanLineWise() {
      const formData = {
        line_id: this.selectedLineId,
        selectedDate: this.selectedEvent.extendedProps.maintenance_plan_date,
        selectedActivityTypeCode: this.selectedEvent.title,
      };
      axios
        .post(
          "/machine-maintenance/delete-maintenance-plan-line-wise/",
          formData
        )
        .then((response) => {
          if (response.status === 200 || response.status === 204) {
            this.$notify({
              title: "Maintenance Plans Deleted Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            this.$emit(
              "maintenance-plans-deleted-line-wise",
              response.data.maintenance_plans
            );

            this.closeModal();
          }
        })
        .catch((error) => {
          console.error("Error deleting maintenance plan:", error);
          this.$notify({
            title: "Error deleting Maintenance Plans",
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
