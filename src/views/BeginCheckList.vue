<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist</h2>
          <span class="ms-3 fs-4 text-muted me-3">|</span>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent m-0 p-0 justify-content-end">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                <router-link to="/checklist">Checklist</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Ongoing Checklist
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="col-md-6 mt-4 d-flex justify-content-end">
        <div class="container">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#generateLabelModal"
              class="btn btn-success me-2"
            >
              Generate Label
            </button>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#endChecklistModal"
              class="btn btn-danger"
            >
              End Checklist
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="generateLabelModal"
      tabindex="-1"
      aria-labelledby="generateLabelModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="generateLabelModalLabel">
              Generate Label
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            You can only generate a label if all checks are passed
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              v-if="isChecklistPassed"
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="endChecklistModal"
      tabindex="-1"
      aria-labelledby="endChecklistModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="endChecklistModalLabel">
              End Checklist
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to end this checklist?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="endChecklist"
              data-bs-dismiss="modal"
            >
              End
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-primary mb-4 mt-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Active Bom Details</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div v-if="activeBom.product" class="col">
            <strong>Product Name:</strong> {{ activeBom.product.name }}
          </div>
          <div v-if="activeBom.product" class="col">
            <strong>Product Code:</strong> {{ activeBom.product.product_code }}
          </div>
          <div class="col">
            <strong>BOM Rev No:</strong> {{ activeBom.bom_rev_number }}
          </div>
          <div class="col">
            <strong>Issue Date:</strong> {{ activeBom.issue_date }}
          </div>
        </div>
      </div>
    </div>

    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            BOM Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isChecklistPassed == false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="checklistItems" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTwo"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseTwo"
          >
            Solder Paste Check
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
            <strong>This is the second item's accordion body.</strong> It is
            hidden by default, until the collapse plugin adds the appropriate
            classes that we use to style each element. These classes control the
            overall appearance, as well as the showing and hiding via CSS
            transitions. You can modify any of this with custom CSS or
            overriding our default variables. It's also worth noting that just
            about any HTML can go within the <code>.accordion-body</code>,
            though the transition does limit overflow.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckListTable from "../components/CheckListTable"; // Adjust the path based on your actual file structure
import axios from "axios";
export default {
  components: {
    CheckListTable,
  },
  data() {
    return {
      activeBom: "",
      checklist: "",
      checklistItems: [],
      isChecklistPassed: false,
      isChecklistEnded: false,
      pollingInterval: "",
    };
  },
  mounted() {
    this.getChecklist();
    this.pollingInterval = setInterval(() => {
      if (!this.isChecklistPassed) {
        this.getChecklist();
      } else {
        clearInterval(this.pollingInterval);
        this.$notify({
          title: "BOM Check Passed",
          type: "bg-success-subtle text-danger",
          duration: "5000",
        });
      }
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
  },
  methods: {
    async getChecklist() {
      this.$store.commit("setIsLoading", true);
      this.$store.commit("setIsLoading", false);
      await axios
        .get(`store/get-active-checklist/${this.$route.params.id}/`)
        .then((response) => {
          console.log(response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },

    async endChecklist() {
      this.$store.commit("setIsLoading", true);
      this.$store.commit("setIsLoading", false);
      await axios
        .get(`store/end-checklist/${this.checklist.id}/`)
        .then((response) => {
          console.log(response.data);
          this.$notify({
            title: "Checklist ended",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          clearInterval(this.pollingInterval);
          this.$router.push(`/generated-checklists/${this.$route.params.id}`);
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          clearInterval(this.pollingInterval);
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
