<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Report Generation</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/machine">
                  <i class="fas fa-calendar-alt me-2"></i>Calendar
                </router-link>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          @click="generateReport"
        >
          Generate Report
        </button>
      </div>
    </div>

    <div class="container mt-5">
      <section class="mb-3">
        <label for="month" class="form-label">Select Month:</label>
        <select id="Month" class="form-select" v-model="selectedMonth">
          <option value="" disabled>Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </section>

      <!-- section for select dates -->

      <!-- section for accordion -->

      <section class="mb-3">
        <label for="machine" class="form-label">Machine:</label>
        <!-- <select id="machine" class="form-select" v-model="selectedMachine">
          <option disabled value="">Please select</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine.id"
          >
            {{ machine.name }}
          </option>
        </select> -->

        <!-- Button trigger modal -->
        <br />
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#machineModal"
        >
          Select Machines
        </button>
        <br />
        <div class="tag-container">
          <div
            v-for="(tag, index) in selectedMachinesArray"
            :key="index"
            class="tag badge bg-secondary"
          >
            <span>{{ tag.name }} Of {{ tag.line.name }}</span>
            <!-- <span
              @click="removeTag(index)"
              class="remove-icon"
              style="color: #ff0000"
              >&times;</span
            > -->
          </div>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="machineModal"
          tabindex="-1"
          aria-labelledby="machineModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="machineModalLabel">
                  Select Machines
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <MachineTableGrid
                  style="margin-top: 20px"
                  :machines="machines"
                  :selectedMachinesArray="selectedMachinesArray"
                  @rowClicked="handleRowClicked"
                  @rowsDeselected="handleRowDeselected"
                  @rowsSelected="handleRowsSelected"
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
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container text-center">
        <div v-if="$store.state.isLoading">
          <div
            class="spinner-border mt-5"
            style="width: 4rem; height: 4rem"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div>
            <b>Loading...</b>
          </div>
        </div>

        <div v-else>
          <ReportGenerationGrid
            v-if="maintenanceActivitiesApiCallSuccess"
            :maintenance_plans="maintenance_plans"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Call the function to generate year options for the next 10 years

import axios from "axios";
import ReportGenerationGrid from "@/components/machine_maintenance/ReportGenerationGrid.vue";
import MachineTableGrid from "../../components/machine_maintenance/MachineTableGrid.vue";
export default {
  components: {
    MachineTableGrid,
    ReportGenerationGrid,
  },
  data() {
    return {
      selectedDates: null,
      selectedMonth: null,
      machines: [],
      lines: [],
      types: [],
      selectedMachine: null,
      maintenance_activity_types: [],
      selectedMachinesArray: [],
      date: [],
      maintenance_plans: [],
      maintenanceActivitiesApiCallSuccess: false,
    };
  },

  mounted() {
    this.getData();
  },
  computed: {
    filteredTypes() {
      if (!this.selectedMachine || this.types.length === 0) {
        return [];
      }
      return this.types.filter((type) => type.id === this.selectedMachine);
    },
  },
  // watch: {
  //   // Watch for changes in selectedMonth and recalculate dates
  //   selectedMonth() {
  //     this.calculateDates();
  //   },
  // },

  methods: {
    // calculateDates() {
    //   // Logic to calculate dates based on selected month
    //   // Example logic:
    //   const daysInMonth = new Date(
    //     new Date().getFullYear(),
    //     new Date().getMonth(),
    //     0
    //   ).getDate();
    //   for (let i = 1; i <= daysInMonth; i++) {
    //     const date = `${i} ${this.selectedMonth}`; // Combine day and month
    //     this.dates.push(date); // Push generated date to dates array
    //   }
    // },

    handleRowsSelected(selectedRows) {
      // Handle rows selected event
      this.selectedMachinesArray = selectedRows;
      console.log("selected machines array", this.selectedMachinesArray);
    },
    removeTag(index) {
      // Remove tag at the given index
      this.selectedMachinesArray.splice(index, 1);
      console.log("selected machiens array", this.selectedMachinesArray);
    },
    openModal() {
      if (this.selectedDates === "customizable") {
        const modalTriggerButton = document.querySelector(
          '[data-bs-target="#exampleModal"]'
        );
        if (modalTriggerButton) {
          modalTriggerButton.click();
        }
      }
    },

    openModalGeneral() {
      const modalTriggerButton = document.querySelector(
        '[data-bs-target="#exampleModal"]'
      );
      if (modalTriggerButton) {
        modalTriggerButton.click();
      }
    },
    closeModalGeneral() {
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    },
    getData() {
      axios
        .get("machine-maintenance/get-machine-data/")
        .then((response) => {
          console.log("this is resposne.data", response.data);
          this.machines = response.data.machines;
          this.lines = response.data.lines;
          this.maintenance_activity_types =
            response.data.maintenance_activity_types;
        })
        .catch((error) => {
          console.log("error fetching data", error);
        });
    },

    generateReport() {
      console.log("this is the selected month", this.selectedMonth);
      const selectedMachineIds = this.selectedMachinesArray.map(
        (machine) => machine.id
      );
      console.log("this is the selected machine ids", selectedMachineIds);
      this.$store.commit("setIsLoading", true);

      // Make a GET request to your API endpoint
      axios
        .get(
          "machine-maintenance/get-maintenance-plans-for-report-generation/",
          {
            params: {
              month: this.selectedMonth,
              machine_ids: selectedMachineIds,
            },
          }
        )
        .then((response) => {
          // Log the response data
          console.log("Response from API:", response.data);

          this.maintenance_plans = response.data.maintenance_plans;
          this.maintenanceActivitiesApiCallSuccess = true;
          this.$store.commit("setIsLoading", false);

          // Further processing of response data can be done here
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error:", error);
          this.$store.commit("setIsLoading", false);
        });
    },

    // createPlan() {
    //   this.$store.commit("setIsLoading", true);
    //   console.log("this is the selected mahcine", this.selectedMachinesArray);
    //   const selectedMachineIds = this.selectedMachinesArray.map(
    //     (machine) => machine.id
    //   );

    //   const formData = {
    //     selectedYears: this.selectedYears,
    //     selectedType: this.selectedType,
    //     dateChoices: this.DateChoices,
    //     selectedMachines: selectedMachineIds,
    //   };

    //   console.log("data being passed from front-end", formData);

    //   axios
    //     .post("/machine-maintenance/create-maintenance-plan/", formData)
    //     .then((response) => {
    //       // Print the response message
    //       console.log(response.data.message);
    //       this.$notify({
    //         title: "Maintenance Plan Created",
    //         type: "bg-success-subtle text-success",
    //         duration: "5000",
    //       });
    //       this.$router.push("/machine/calendar-yearly-view");
    //       this.$store.commit("setIsLoading", false);
    //     })
    //     .catch((error) => {
    //       // Handle errors here
    //       console.error("Error:", error);
    //       this.$notify({
    //         title: "Error creating  Maintenance plan",
    //         type: "bg-danger-subtle text-danger",
    //         duration: "5000",
    //       });
    //       this.$store.commit("setIsLoading", false);
    //     });
    // },
  },
};
</script>

<style lang="scss" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap; /* Ensure tags wrap to a new line if they exceed container width */
  justify-content: center; /* Center tags horizontally */
  margin-top: 10px;
}

.tag {
  margin: 5px;
  padding: 0.25rem 0.5rem; /* Reduce padding to make tags smaller */
  font-size: 0.875rem; /* Reduce font size to make tags smaller */
}

.remove-icon {
  cursor: pointer;
  margin-left: 5px;
}
</style>
