<template>
  <div>
    <div
      v-if="show"
      class="modal fade show"
      id="customBomRevisionModal"
      tabindex="-1"
      aria-labelledby="customBomRevisionLabel"
      aria-modal="true"
      role="dialog"
      style="display: block"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="customBomRevisionLabel">
              <strong style="color: #333"> Reason for BOM Revision</strong>
            </h4>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row justify-content-center">
              <!-- Remove @submit binding and use button click -->
              <form class="needs-validation" novalidate>
                <div class="mb-4">
                  <!-- <label for="revisionReason" class="form-label">
                    Please provide reason for change:
                  </label> -->
                  <textarea
                    v-model="bom_rev_change_note"
                    class="form-control"
                    id="revisionReason"
                    required
                    placeholder="Please provide the reason for the change..."
                    style="height: 150px"
                  ></textarea>
                  <div class="invalid-feedback">Reason is required.</div>
                </div>

                <div class="button mb-2">
                  <!-- Change type to button and add click event -->
                  <button
                    class="btn btn-outline-success btn-block"
                    type="button"
                    @click="submitCustomBomRevision"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="show"
      class="modal-backdrop fade show"
      id="customBomRevisionBackdrop"
      style="display: block"
      @click="closeModal"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bom_rev_change_note: "", // Updated variable name
    };
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    closeModal() {
      document.getElementById("customBomRevisionBackdrop").style.display =
        "none";
      document.getElementById("customBomRevisionModal").style.display = "none";
      document
        .getElementById("customBomRevisionModal")
        .classList.remove("show");
    },
    // dismissModal() {
    //   // Emit an event to notify the parent component to close the modal
    //   console.log("dismiss modal emitter triggered");
    //   this.$emit("dismiss-modal");
    // },

    // Modified method to be triggered on button click
    submitCustomBomRevision() {
      // Emit the 'modal-submitted' event and pass the bom_rev_change_note data
      this.$emit("handle-modal-submitted", this.bom_rev_change_note);

      // Close the modal
      this.closeModal();
    },
  },
};
</script>

<style></style>
