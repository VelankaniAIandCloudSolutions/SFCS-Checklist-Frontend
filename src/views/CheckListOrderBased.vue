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
          <h2 class="mb-0">Checklist</h2>
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
          <div class="d-flex">
            <button
              type="button"
              :disabled="!isButtonEnabled"
              class="btn btn-primary btn-sm"
              @click="checkAndGenerateChecklist"
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
    <!-- <BomDetailsTableWithoutEdit
      style="margin-top: 20px"
      :rowData="rowData"
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
      @rowDeselected="handleRowDeselected"
    /> -->

    <div v-if="activeChecklist" class="card card-outline card-primary mt-5">
      <div class="card-header">
        <h3 class="card-title" style="font-size: 20px">Active Checklist:</h3>
        <div class="card-tools">
          <router-link
            :to="
              '/begin-checklist/' +
              (this.activeChecklist && this.activeChecklist.bom
                ? this.activeChecklist.bom.id
                : '')
            "
          >
            <button class="btn-sm btn-primary">View Checklist</button>
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <strong>Checklist ID:</strong>
            {{ this.activeChecklist ? this.activeChecklist.id : "N/A" }}
          </div>
          <div class="col-md-3">
            <strong>Batch Quantity:</strong>
            {{
              this.activeChecklist ? this.activeChecklist.batch_quantity : "N/A"
            }}
          </div>
          <div class="col-md-3">
            <strong>Project Name:</strong>
            {{
              this.activeChecklist &&
              this.activeChecklist.bom &&
              this.activeChecklist.bom.product &&
              this.activeChecklist.bom.product.project
                ? this.activeChecklist.bom.product.project.name
                : "N/A"
            }}
          </div>
          <div class="col-md-3">
            <strong>Product Name:</strong>
            {{
              this.activeChecklist &&
              this.activeChecklist.bom &&
              this.activeChecklist.bom.product
                ? this.activeChecklist.bom.product.name
                : "N/A"
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- /.card -->
    <OrderDetailsTable
      style="margin-top: 20px"
      :orders="orders"
      :checklists="checklists"
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
      @rowDeselected="handleRowDeselected"
    />

    <div
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
    </div>
  </div>
</template>

<script>
import OrderDetailsTable from "../components/OrderDetailsTable.vue";

import axios from "axios";

export default {
  components: {
    // BomDetailsTableWithoutEdit,
    OrderDetailsTable,
  },
  data() {
    return {
      rowData: [],
      selectedRow: null,
      clickedRowId: null,
      orderId: null,
      isButtonEnabled: false,
      isExisting: false,
      isActive: false,
      batch_quantity: 1,
      generateChecklists: [],
      checklists: [],
      activeChecklist: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        // Fetch BOM data from your API endpoint
        this.$store.commit("setIsLoading", true);
        const response = await axios.get("store/get-orders/");
        console.log(response.data);
        this.orders = response.data.orders;
        this.activeChecklist = response.data.active_checklist;
        console.log("this is active checklsit", this.activeChecklist);

        this.$store.commit("setIsLoading", false);
      } catch (error) {
        console.error("Error fetching BOM data:", error);
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

        this.clickedRowId = rowData.bom.id;
        this.orderId = rowData.id;

        console.log("clicked row id +BOM ID =", this.clickedRowId);
        console.log("Order ID =", this.orderId);
        this.isButtonEnabled = true;
      }
    },
    handleRowDeselected() {
      console.log("Row Deselected:");
      this.isButtonEnabled = false;
    },

    async checkAndGenerateChecklist() {
      console.log("generate checklist clicked");
      this.$store.commit("setIsLoading", true);

      try {
        const response = await axios.post(
          `store/check-existing-checklist/${this.clickedRowId}/`
        );
        console.log(response.data);
        this.isActive = response.data.is_active;
        this.isExisting = response.data.is_existing;

        if (this.isExisting) {
          this.$notify({
            title:
              "There is already an active ongoing checklist for this order, please end that checklist by viewing the ongoing checklist to generate a new one.",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        } else {
          await this.generateChecklist();
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: error.response.data,
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },

    async generateChecklist() {
      try {
        // const requestData = { batch_quantity: this.batch_quantity };
        const response = await axios.post(
          `store/generate-new-checklist/${this.orderId}/`
        );
        console.log(response.data);
        this.$router.push(`/begin-checklist/${this.clickedRowId}`);
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: error.response.data.error,
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
      } finally {
        // Ensure loading state is set to false in all cases
        this.$store.commit("setIsLoading", false);
      }
    },

    //not working og code
    // async checkAndGenerateChecklist() {
    //   console.log("generate checklist clicked");
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
    //             "There is already an active ongoing checklist for this order, please end that checklist by viewing the ongoing checklist to generate a new one.",
    //           type: "bg-danger-subtle text-danger",
    //           duration: "5000",
    //         });
    //         this.$store.commit("setIsLoading", false);
    //       } else {
    //         this.generateChecklist();
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("error:", error);
    //       this.$notify({
    //         title: "An error occurred, please try again later",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //       // this.$store.commit("setIsLoading", false);
    //     })
    //     .finally(() => {
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },
    // async generateChecklist() {
    //   // this.$store.commit("setIsLoading", true);
    //   // const requestData = {
    //   //   batch_quantity: this.batch_quantity, // Use the name you are using for batch_quantity
    //   // };s
    //   await axios
    //     .post(`store/generate-new-checklist/${this.orderId}/`)
    //     .then((response) => {
    //       this.$store.commit("setIsLoading", false);
    //       console.log(response.data);
    //       this.$router.push(`/begin-checklist/${this.clickedRowId}`);
    //     })
    //     .catch((error) => {
    //       console.log("error:", error);
    //       this.$notify({
    //         title: "An error occurred, please try again later",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //       // this.$store.commit("setIsLoading", false);
    //     })
    //     .finally(() => {
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },

    async checkExistingChecklist() {
      this.$store.commit("setIsLoading", true);
      await axios
        .post(`store/check-existing-checklist/${this.clickedRowId}/`)
        .then((response) => {
          console.log(response.data);
          this.isActive = response.data.is_active;
          this.isExisting = response.data.is_existing;
          if (this.isExisting) {
            if (this.isActive) {
              this.$router.push(`/begin-checklist/${this.clickedRowId}`);
            } else {
              this.$notify({
                title:
                  "No active checklist found for this bom, please generate a new checklist",
                type: "bg-danger-subtle text-danger",
                duration: "5000",
              });
            }
          } else {
            this.$notify({
              title:
                "No ongoing checklist found for this order, please generate a new checklist",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }
          // this.$router.push(`/begin-checklist/${this.clickedRowId}`);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occurred, please try again later",
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
    // viewGeneratedChecklists() {
    //   if (this.clickedRowId) {
    //     this.$router.push(`/generated-checklists/${this.clickedRowId}`);
    //     // Optionally, you can reset the selectedRow and clickedRowId here
    //     // this.selectedRow = null;
    //     // this.clickedRowId = null;
    //   }
    // },

    viewGeneratedChecklists() {
      // Make an API call to fetch generated checklists for the selected row
      console.log("inside view generated checklists", this.clickedRowId);
      this.$store.commit("setIsLoading", true);
      axios
        .get(`store/generated-checklists/${this.clickedRowId}/`)
        .then((response) => {
          // Check if there are any generated checklists available
          const generatedChecklists = response.data;
          console.log("generated checklists", generatedChecklists);

          if (generatedChecklists && generatedChecklists.length > 0) {
            // If generated checklists are available, redirect to the page to view them
            this.$store.commit("setIsLoading", false);
            this.$router.push(`/generated-checklists/${this.clickedRowId}`);
          } else {
            // If no generated checklists are available, show an error message
            this.$notify({
              title: "No checklists are generated for this order.",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
            this.$store.commit("setIsLoading", false);
          }
        })
        .catch((error) => {
          console.error("Error fetching generated checklists:", error);
          // Handle error
          this.$notify({
            title: "An error occurred while fetching generated checklists.",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
