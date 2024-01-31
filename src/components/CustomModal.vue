<template>
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
            <strong style="color: #333">Custom Bom Revision</strong>
          </h4>
        </div>
        <div class="modal-body">
          <div class="row justify-content-center">
            <div class="col-md-10 text-center signin mt-4" style="">
              <form
                class="needs-validation"
                @submit="submitCustomBomRevision"
                novalidate
              >
                <div class="mb-4">
                  <label for="revisionReason" class="form-label"
                    >Please provide reason for change:</label
                  >
                  <textarea
                    v-model="bom_rev_change_note"
                    class="form-control"
                    id="revisionReason"
                    rows="4"
                    required
                  ></textarea>
                  <div class="invalid-feedback">Reason is required.</div>
                </div>

                <div class="button mb-2">
                  <button
                    class="btn btn-outline-success btn-block"
                    type="submit"
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
  </div>

  <div
    v-if="show"
    class="modal-backdrop fade show"
    id="customBomRevisionBackdrop"
    style="display: block"
  ></div>
</template>

<script>
// import axios from "axios";
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
    async submitCustomBomRevision(event) {
      event.preventDefault();
      const form = event.target;

      if (form.checkValidity()) {
        try {
          // Use this.bom_rev_change_note for further processing

          this.$notify({
            title: "Custom BOM Revision Submitted Successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
        } catch (error) {
          console.error(error);
          // Handle error if needed
        }
      } else {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    },
  },
};
</script>

<style></style>
