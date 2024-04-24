<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <!-- Loading Spinner (unchanged) -->
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <!-- Heading, Breadcrumb, and Date Inputs -->
      <div class="d-flex align-items-center mt-4">
        <h2 class="mb-0">Machine Report</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="d-inline-block ms-3">
          <ol class="breadcrumb bg-transparent m-0 p-0">
            <li class="breadcrumb-item active" aria-current="page">
              <i class="fas fa-microchip me-2"></i> Board Reports
            </li>
          </ol>
        </nav>
        <div class="d-flex align-items-center ms-auto">
          <div class="input-group me-3" style="width: 200px">
            <span class="input-group-text">From Date</span>
            <input type="date" class="form-control" v-model="fromDate" />
          </div>
          <div class="input-group me-3" style="width: 200px">
            <span class="input-group-text">To Date</span>
            <input type="date" class="form-control" v-model="toDate" />
          </div>
          <button
            v-if="!showMachineReportGrid"
            class="btn btn-outline-primary"
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
      machineReports: "",
      showMachineReportGrid: false,
    };
  },
  methods: {
    getMachineData() {
      axios
        .get(`machine-logs/get-machine-list/`)
        .then((response) => {
          console.log(response.data);
          this.machinesList = response.data.machines; // Assuming the response is the machine list
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleMachineClicked(machineId) {
      // Handle the emitted event to get the machine ID
      console.log("machine id being clicked =", machineId);
      this.selectedMachineId = machineId;
    },
    toggleGridView() {
      this.showMachineReportGrid = !this.showMachineReportGrid;
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
      if (!this.fromDate && !this.toDate) {
        this.$notify({
          title: "Please at least, select one date!",
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
