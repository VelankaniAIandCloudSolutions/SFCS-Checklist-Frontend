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
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
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
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
/* Add your modal styling here */
</style>
