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

      <div class="d-flex align-items-center mt-4">
        <h2 class="mb-0">Board Report</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="d-inline-block ms-3">
          <ol class="breadcrumb bg-transparent m-0 p-0">
            <li class="breadcrumb-item active" aria-current="page">
              <i class="fas fa-microchip me-2"></i> Board Reports
            </li>
          </ol>
        </nav>
        <div class="input-group ms-auto" style="width: 250px">
          <input
            type="text"
            class="form-control"
            v-model="boardNumber"
            placeholder="Enter board number"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="searchBoard"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <BoardReportGrid class="mt-5" :boardLogs="boardLogs" />
  </div>
</template>

<script>
import axios from "axios";
import BoardReportGrid from "../../components/MachineLogs/BoardReportGrid.vue";
export default {
  components: {
    BoardReportGrid,
  },
  mounted() {
    //this.ws = new WebSocket(`wss://sfcsdev.xtractautomation.com/ws/checklist/`);
  },

  data() {
    return {
      boardNumber: "",
      boardLogs: "",
    };
  },
  methods: {
    searchBoard() {
      if (this.boardNumber.trim() === "") {
        // Handle empty input case if needed
        return;
      }
      this.$store.commit("setIsLoading", true);

      axios
        .get(`machine-logs/get-machines-logs`, {
          params: {
            board_number: this.boardNumber.trim(),
          },
        })
        .then((response) => {
          // Assuming response.data contains the list of boards
          console.log(response.data);
          this.boardLogs = response.data.boardLogs;

          this.$store.commit("setIsLoading", false);
          if (this.boardLogs.length === 0) {
            this.$notify({
              title: "No Board Logs found for this serial number !",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }
          //   this.$notify({
          //     title: "Report Fetched Successfully!!",
          //     type: "bg-success-subtle text-success",
          //     duration: "5000",
          //   });
        })
        .catch((error) => {
          // Handle error if needed
          console.error(error);
          this.$store.commit("setIsLoading", false);
          //   this.$notify({
          //     title: "Error Fetching Report",
          //     type: "bg-danger-subtle text-danger",
          //     duration: "5000",
          //   });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
