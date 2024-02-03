<template>
  <div>
    <div
      v-if="show"
      class="modal fade show"
      id="customRestrictedAccessModal"
      tabindex="-1"
      aria-labelledby="customRestrictedAccessLabel"
      aria-modal="true"
      role="dialog"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="customRestrictedAccessLabel">
              <strong style="color: #333">Restriced Access</strong>
            </h4>
          </div>
          <div class="modal-body">
            <div class="row justify-content-center">
              <h6>Please Log In to Continue</h6>
              <div class="button mb-2">
                <button
                  @click="$emit('closeLogInModal')"
                  class="btn btn-outline-success btn-block"
                  type="button"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="show"
      class="modal-backdrop fade show"
      id="customRestrictedAccessBackdrop"
      style="display: block"
      @click="closeModal"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
      document.getElementById("customRestrictedAccessBackdrop").style.display =
        "none";
      document.getElementById("customRestrictedAccessModal").style.display =
        "none";
      document
        .getElementById("customRestrictedAccessModal")
        .classList.remove("show");
    },
  },
};
</script>

<style></style>
