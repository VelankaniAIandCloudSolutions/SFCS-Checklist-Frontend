<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Checklist
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container has-text-centered">
          <div class="d-flex">
            <button
              @click="checkAndGenerateChecklist"
              :disabled="!isButtonEnabled"
              class="btn btn-primary btn-sm"
            >
              Generate New Checklist
            </button>
            <button
              @click="checkExistingChecklist"
              :disabled="!isButtonEnabled"
              class="btn btn-warning btn-sm ms-2"
            >
              View Ongoing Checklist
            </button>
            <button
              @click="viewGeneratedChecklists"
              :disabled="!isButtonEnabled"
              class="btn btn-success btn-sm ms-2"
            >
              View Generated Checklists
            </button>
          </div>
        </div>
      </div>
    </div>
    <BomDetailsTableWithoutEdit
      style="margin-top: 20px"
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
      @rowDeselected="handleRowDeselected"
    />
  </div>
</template>

<script>
import BomDetailsTableWithoutEdit from "../components/BomDetailsTableWithoutEdit.vue";
import axios from "axios";

export default {
  components: {
    BomDetailsTableWithoutEdit,
  },
  data() {
    return {
      rowData: [],
      selectedRow: null,
      clickedRowId: null,
      isButtonEnabled: false,
      isExisting: false,
      isActive: false
    };
  },
  methods: {
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
    async checkAndGenerateChecklist() {
      this.$store.commit("setIsLoading", true);
      await axios
        .post(`store/check-existing-checklist/${this.clickedRowId}/`)
        .then((response) => {
          console.log(response.data);
          this.isActive = response.data.is_active
          this.isExisting = response.data.is_existing
          if(this.isExisting){
            this.$notify({
              title: "There is already an active ongoing checklist for this bom, please end that checklist by viewing the ongoing checklist to generate a new one.",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }
          else{
            this.generateChecklist()
          }
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
      
    },
    async generateChecklist() {
      this.$store.commit("setIsLoading", true);
      await axios
        .post(`store/generate-new-checklist/${this.clickedRowId}/`)
        .then((response) => {
          console.log(response.data);
          this.$router.push(`/begin-checklist/${this.clickedRowId}`);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
    async checkExistingChecklist() {
      this.$store.commit("setIsLoading", true);
      await axios
        .post(`store/check-existing-checklist/${this.clickedRowId}/`)
        .then((response) => {
          console.log(response.data);
          this.isActive = response.data.is_active
          this.isExisting = response.data.is_existing
          if(this.isExisting){
            if(this.isActive){
              this.$router.push(`/begin-checklist/${this.clickedRowId}`);
            }
            else{
              this.$notify({
                title: "No active checklist found for this bom, please generate a new checklist",
                type: "bg-danger-subtle text-danger",
                duration: "5000",
              });
            }
          }
          else{
            this.$notify({
            title: "No ongoing checklist found for this bom, please generate a new checklist",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          }
          // this.$router.push(`/begin-checklist/${this.clickedRowId}`);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
    viewOngoingChecklists() {
      if (this.clickedRowId) {
        this.$router.push(`/begin-checklist/${this.clickedRowId}`);
        // Optionally, you can reset the selectedRow and clickedRowId here
        // this.selectedRow = null;
        // this.clickedRowId = null;
      }
    },
    viewGeneratedChecklists() {
      if (this.clickedRowId) {
        this.$router.push(`/generated-checklists/${this.clickedRowId}`);
        // Optionally, you can reset the selectedRow and clickedRowId here
        // this.selectedRow = null;
        // this.clickedRowId = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
