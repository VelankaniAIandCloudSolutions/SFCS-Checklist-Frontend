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
  },
  data() {
    return {
      inspectionBoards: null,
    };
  },
  methods: {
    getInspectionBoards() {
      this.$store.commit("setIsLoading", true);
      axios
        .get("/store/get-inspection-boards") // Replace 'your-endpoint' with your actual API endpoint
        .then((response) => {
          console.log(response.data);
          this.inspectionBoards = response.data.inspectionBoards;
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
