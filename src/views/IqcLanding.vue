<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">IQC for Checklist</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-list-alt me-1"></i>
                Checklist
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container has-text-centered">
          <div class="d-flex justify-content-end">
            <!-- <button
              type="button"
              :disabled="!isButtonEnabled"
              class="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Generate New Checklist
            </button> -->
            <!-- <button
              @click="checkExistingChecklist"
              :disabled="!isButtonEnabled"
              class="btn btn-warning btn-sm ms-2"
            >
              View Ongoing Checklist
            </button> -->
            <button
              @click="startIqc"
              :disabled="!isButtonEnabled"
              class="btn btn-success btn-sm ms-2"
            >
              Start IQC
            </button>
          </div>
        </div>
      </div>
    </div>
    <PassedChecklistsTable
      style="margin-top: 20px"
      :passed_checklists="passed_checklists"
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
      @rowDeselected="handleRowDeselected"
    />
    <!-- <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Fill the Required Batch Quantity
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="number"
              class="form-control"
              id="requiredBatchQuantity"
              v-model="batch_quantity"
              placeholder="Enter Batch Quantity"
              min="1"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              @click="checkAndGenerateChecklist"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Generate Checklist
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import PassedChecklistsTable from "@/components/PassedChecklistsTable.vue";

import axios from "axios";

export default {
  components: {
    PassedChecklistsTable,
  },
  data() {
    return {
      selectedRow: null,
      clickedRowId: null,
      isButtonEnabled: false,
      isExisting: false,
      isActive: false,
      // batch_quantity: 1,
      passed_checklists: [],
    };
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        this.$store.commit("setIsLoading", true);
        const response = await axios.get("store/get-passed-checklists/");
        this.passed_checklists = response.data.passed_checklists;
        console.log(response.data);
        this.$store.commit("setIsLoading", false);
      } catch (error) {
        console.error("Error fetching passed checklists:", error);
        this.$store.commit("setIsLoading", false);
      }
    },
    handleRowClicked(clickedRow) {
      // Handle the clicked row data in the parent component
      console.log("Clicked Row:", clickedRow);
      // Now you have access to the specific row data, and you can use it as needed.
    },
    handleRowSelected(rowData) {
      console.log("Row Selected:", rowData);
      if (rowData && rowData.id) {
        this.selectedRow = rowData;

        this.clickedRowId = rowData.id;
        this.isButtonEnabled = true;
      }
    },
    handleRowDeselected() {
      console.log("Row Deselected:");
      this.isButtonEnabled = false;
    },

    // async checkAndGenerateChecklist() {
    //   this.$store.commit("setIsLoading", true);
    //   await axios
    //     .post(`store/check-existing-checklist/${this.clickedRowId}/`)
    //     .then((response) => {
    //       console.log(response.data);
    //       this.isActive = response.data.is_active;
    //       this.isExisting = response.data.is_existing;
    //       if (this.isExisting) {
    //         this.$notify({
    //           title:
    //             "There is already an active ongoing checklist for this bom, please end that checklist by viewing the ongoing checklist to generate a new one.",
    //           type: "bg-danger-subtle text-danger",
    //           duration: "5000",
    //         });
    //       } else {
    //         this.generateChecklist();
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("error:", error);
    //       this.$notify({
    //         title: "An error occured, please try again later",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //     })
    //     .finally(() => {
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },
    // async generateChecklist() {
    //   this.$store.commit("setIsLoading", true);
    //   const requestData = {
    //     batch_quantity: this.batch_quantity, // Use the name you are using for batch_quantity
    //   };
    //   await axios
    //     .post(`store/generate-new-checklist/${this.clickedRowId}/`, requestData)
    //     .then((response) => {
    //       console.log(response.data);
    //       this.$router.push(`/begin-checklist/${this.clickedRowId}`);
    //     })
    //     .catch((error) => {
    //       console.log("error:", error);
    //       this.$notify({
    //         title: "An error occured, please try again later",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //     })
    //     .finally(() => {
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },
    // async checkExistingChecklist() {
    //   this.$store.commit("setIsLoading", true);
    //   await axios
    //     .post(`store/check-existing-checklist/${this.clickedRowId}/`)
    //     .then((response) => {
    //       console.log(response.data);
    //       this.isActive = response.data.is_active;
    //       this.isExisting = response.data.is_existing;
    //       if (this.isExisting) {
    //         if (this.isActive) {
    //           this.$router.push(`/begin-checklist/${this.clickedRowId}`);
    //         } else {
    //           this.$notify({
    //             title:
    //               "No active checklist found for this bom, please generate a new checklist",
    //             type: "bg-danger-subtle text-danger",
    //             duration: "5000",
    //           });
    //         }
    //       } else {
    //         this.$notify({
    //           title:
    //             "No ongoing checklist found for this bom, please generate a new checklist",
    //           type: "bg-danger-subtle text-danger",
    //           duration: "5000",
    //         });
    //       }
    //       // this.$router.push(`/begin-checklist/${this.clickedRowId}`);
    //     })
    //     .catch((error) => {
    //       console.log("error:", error);
    //       this.$notify({
    //         title: "An error occured, please try again later",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //     })
    //     .finally(() => {
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },
    // viewOngoingChecklists() {
    //   if (this.clickedRowId) {
    //     this.$router.push(`/begin-checklist/${this.clickedRowId}`);
    //     // Optionally, you can reset the selectedRow and clickedRowId here
    //     // this.selectedRow = null;
    //     // this.clickedRowId = null;
    //   }
    // },
    startIqc() {
      if (this.clickedRowId) {
        this.$router.push(`/iqc-for-checklist/${this.clickedRowId}`);
        // Optionally, you can reset the selectedRow and clickedRowId here
        // this.selectedRow = null;
        // this.clickedRowId = null;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
