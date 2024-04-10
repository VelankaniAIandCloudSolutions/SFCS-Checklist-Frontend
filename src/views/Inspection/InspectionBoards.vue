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
          <h2 class="mb-0">Inspection Boards</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-microchip me-2"></i> Inspection Boards
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons Column -->
      <!-- <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#addDefectModal"
        >
          Add New Defect
        </button>
      </div> -->
      <div class="card card-outline card-primary mt-5">
        <div class="card-header">
          <h3 class="card-title" style="font-size: 20px">Active Board:</h3>
          <div class="card-tools">
            <router-link
              :to="
                '/defect-recognition/' +
                (this.activeInspectionBoard
                  ? this.activeInspectionBoard.id
                  : '')
              "
            >
              <button class="btn-sm btn-primary">View Board Details</button>
            </router-link>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <strong>Board Name:</strong>
              {{
                this.activeInspectionBoard
                  ? this.activeInspectionBoard.name
                  : "N/A"
              }}
            </div>
            <div class="col-md-6">
              <strong>Detected Board Id:</strong>
              {{
                this.activeInspectionBoard
                  ? this.activeInspectionBoard.detected_board_id
                  : "N/A"
              }}
            </div>
          </div>
        </div>
      </div>

      <InspectionBoardGrid class="mt-5" :inspectionBoards="inspectionBoards" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InspectionBoardGrid from "../../components/Inspection/InspectionBoardGrid.vue";

export default {
  components: {
    InspectionBoardGrid,
  },
  mounted() {
    this.getInspectionBoards();
    this.ws = new WebSocket(`wss://sfcsdev.xtractautomation.com/ws/checklist/`);
    // this.ws = new WebSocket(`ws://localhost:8000/ws/inspection-board/`);
    // Event listener for WebSocket connection opened
    this.ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    this.ws.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event.data); // Log the raw message data

      // Parse the JSON data from the event
      const eventData = JSON.parse(event.data);

      console.log("event data", eventData);

      this.activeInspectionBoard = eventData.active_inspection_board;
      this.inspectionBoards = eventData.all_inspection_boards;

      // // Check the type of event
      // if (eventData.type === "active_inspection_board") {
      //   console.log("Active inspection board event received:", eventData); // Log the parsed event data
      //   this.activeInspectionBoard = eventData.active_inspection_board;

      //   // Do something with the active inspection board data
      // } else if (eventData.type === "all_inspection_boards") {
      //   console.log("All inspection boards event received:", eventData); // Log the parsed event data
      //   // Handle all inspection boards event
      //   this.inspectionBoards = eventData.all_inspection_boards;
      //   // Do something with the list of all inspection boards data
      // } else {
      //   console.log("Unknown event type received:", eventData); // Log the parsed event data
      //   // Handle other types of events if needed
      // }
    });
  },

  data() {
    return {
      inspectionBoards: null,
      activeInspectionBoard: null,
    };
  },
  beforeUnmount() {
    // Close WebSocket connection when the component is unmounted
    this.ws.close();
  },
  methods: {
    getInspectionBoards() {
      this.$store.commit("setIsLoading", true);
      axios
        .get("/store/get-inspection-boards") // Replace 'your-endpoint' with your actual API endpoint
        .then((response) => {
          console.log("this is response data", response.data);
          this.inspectionBoards = response.data.inspectionBoards;
          this.activeInspectionBoard = response.data.activeInspectionBoard;
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching inspection boards:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
