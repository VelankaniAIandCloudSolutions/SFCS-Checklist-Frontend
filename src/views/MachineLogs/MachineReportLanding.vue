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
      <!-- Heading, Breadcrumb, and Date Inputs -->
      <div class="d-flex align-items-center mt-4">
        <h2 class="mb-0">Machine Report</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="d-inline-block ms-3">
          <ol class="breadcrumb bg-transparent m-0 p-0">
            <li class="breadcrumb-item">
              <a href="/machine-logs/dashboard"
                ><i class="fas fa-home me-1"></i>Home</a
              >
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <i class="fas fa-microchip me-2"></i>Machine Reports
            </li>
          </ol>
        </nav>
        <div class="d-flex align-items-center ms-auto">
          <div class="input-group me-3" style="width: 250px">
            <span class="input-group-text">From Date</span>
            <input type="date" class="form-control" v-model="fromDate" />
          </div>
          <div class="input-group me-3" style="width: 220px">
            <span class="input-group-text">To Date</span>
            <input type="date" class="form-control" v-model="toDate" />
          </div>
          <button
            class="btn btn-outline-primary me-2"
            type="button"
            @click="searchByDateRange"
          >
            <i class="fas fa-search"></i>
          </button>
          <button
            class="btn btn-outline-primary"
            v-if="showMachineReportGrid"
            @click="toggleGridView"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="card card-outline card-primary mt-5">
      <div class="card-header">
        <h3 class="card-title" style="font-size: 20px">Selected Machine:</h3>
        <!-- <div class="card-tools">
          <router-link
            :to="
              '/defect-recognition/' +
              (this.activeInspectionBoard ? this.activeInspectionBoard.id : '')
            "
          >
            <button class="btn-sm btn-primary">View Board Details</button>
          </router-link>
        </div> -->
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <strong>Selected Machine:</strong>
            {{
              this.selectedMachineObject
                ? this.selectedMachineObject.name
                : "N/A"
            }}
          </div>
          <div class="col-md-6">
            <strong>Machine Belongs To:</strong>
            {{
              this.selectedMachineObject && this.selectedMachineObject.line
                ? this.selectedMachineObject.line.name
                : "N/A"
            }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMachineReportGrid">
      <MachineReportGrid
        style="margin-top: 40px"
        :machineReports="machineReports"
      />
    </div>
    <div v-else>
      <MachineListGrid
        style="margin-top: 40px"
        :machinesList="machinesList"
        @machineClicked="handleMachineClicked"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

import MachineListGrid from "../../components/MachineLogs/MachineListGrid.vue";
import MachineReportGrid from "@/components/MachineLogs/MachineReportGrid.vue";
export default {
  components: {
    MachineListGrid,
    MachineReportGrid,
  },
  mounted() {
    //this.ws = new WebSocket(`wss://sfcsdev.xtractautomation.com/ws/checklist/`);
    this.getMachineData();
  },

  data() {
    return {
      fromDate: "", // Store the selected "From Date"
      toDate: "",
      machinesList: "",
      selectedMachineId: null,
      selectedMachineObject: "",
      machineReports: "",
      showMachineReportGrid: false,
    };
  },
  methods: {
    getMachineData() {
      this.$store.commit("setIsLoading", true);
      axios
        .get(`machine-logs/get-machine-list/`)
        .then((response) => {
          console.log(response.data);
          this.machinesList = response.data.machines;
          this.$store.commit("setIsLoading", false); // Assuming the response is the machine list
        })
        .catch((error) => {
          console.error(error);
          this.$store.commit("setIsLoading", false);
        });
    },

    handleMachineClicked(machineData) {
      // Handle the emitted event to get both the machine ID and the row object

      if (machineData) {
        // Store the machine ID and the entire row object
        console.log("Machine ID being clicked:", machineData.id);
        console.log("Selected Row Object:", machineData);
        this.selectedMachineId = machineData.id;
        this.selectedMachineObject = machineData;
      } else {
        this.selectedMachineId = null;
        this.selectedMachineObject = null;
      }
    },
    toggleGridView() {
      this.showMachineReportGrid = !this.showMachineReportGrid;
      this.selectedMachineObject = null;
    },
    searchByDateRange() {
      if (!this.selectedMachineId) {
        this.$notify({
          title: "Please Select a Machine!",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        return;
      }

      // Construct the URL with query parameters
      let url = `machine-logs/get-machine-reports-by-date-range?machineId=${this.selectedMachineId}`;

      if (this.fromDate) {
        url += `&fromDate=${this.fromDate}`;
      }

      if (this.toDate) {
        url += `&toDate=${this.toDate}`;
      }
      this.$store.commit("setIsLoading", true);

      axios
        .get(url)
        .then((response) => {
          // Handle the response
          console.log(response.data);
          this.machineReports = response.data.machine_reports;
          this.showMachineReportGrid = true;
          this.$store.commit("setIsLoading", false);
          this.$notify({
            title: "Report Fetched Successfully!!",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
        })
        .catch((error) => {
          console.error(error);
          this.$store.commit("setIsLoading", false);
          this.$notify({
            title: "Error Fetching Report",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
