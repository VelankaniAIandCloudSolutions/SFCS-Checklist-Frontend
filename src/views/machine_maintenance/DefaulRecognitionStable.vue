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
          <h2 class="mb-0">Defect Recognition</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa-solid fa-list me-2"></i> Inspection
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
          data-bs-toggle="modal"
          data-bs-target="#addDefectModal"
        >
          Add New Defect
        </button>
      </div>
    </div>

    <div class="row align-items-start mt-5">
      <!-- Left Column - Golden Board -->
      <div class="col-md-6 mt-4" v-if="inspectionBoardData">
        <h2 class="mb-3">
          Board: <strong>{{ inspectionBoardData.name }}</strong>
        </h2>
        <img
          :src="inspectionBoardData.inspection_board_image_url"
          class="img-fluid board-image"
          alt="Inspection Board Image"
          style="width: 600px; height: 400px"
        />
      </div>

      <!-- Right Column - Defect Details -->
      <div class="col-md-6 mt-4">
        <h2 class="mb-3">Defect Details:</h2>

        <div
          id="carouselExampleCaptions"
          class="carousel slide"
          v-if="inspectionBoardData && inspectionBoardData.defects"
        >
          <div
            class="carousel-indicators"
            v-if="inspectionBoardData && inspectionBoardData.defects"
          >
            <button
              v-for="(defect, index) in inspectionBoardData.defects"
              :key="index"
              type="button"
              :data-bs-target="'#carouselExampleCaptions' + index"
              :data-bs-slide-to="index"
              :class="{ active: index === 0, 'bg-dark': index === 0 }"
              aria-current="true"
              aria-label="Slide {{ index + 1 }}"
            ></button>
          </div>
          <div class="carousel-inner">
            <div
              v-for="(defect, index) in inspectionBoardData.defects"
              :key="index"
              class="carousel-item"
              :class="{ active: index === activeDefectIndex }"
            >
              <img
                v-if="defect.defect_image_url"
                :src="defect.defect_image_url"
                class="img-fluid"
                :alt="'Defect Image ' + (index + 1)"
              />
              <div
                class="carousel-caption d-none d-md-block"
                style="
                  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                  background-color: rgba(0, 0, 0, 0.5);
                  color: white;
                  padding: 8px;
                "
              >
                <h5
                  class="fw-bold"
                  v-if="defect.defect_type && defect.defect_type.name"
                >
                  {{ defect.defect_type.name }}
                </h5>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
            @click="prevDefect"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
            style="color: white; font-size: 1.5rem"
            @click="nextDefect"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <div class="mt-4">
          <label for="defectType">Select Defect Type:</label>
          <select
            id="defectType"
            v-model="selectedDefectTypeId"
            class="form-select"
          >
            <option
              v-for="defect in defectTypes"
              :key="defect"
              :value="defect.id"
            >
              {{ defect.name }}
            </option>
          </select>
          <button
            type="button"
            class="btn btn-primary mt-3"
            @click="assignDefect"
          >
            Assign
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="addDefectModal"
      tabindex="-1"
      aria-labelledby="addDefectLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="addDefectLabel">Add Defect</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      inspectionBoardData: null,
      selectedDefectTypeId: null, // Assuming you have selectedDefect data
      defectTypes: [],
      activeDefectIndex: 0, // Assuming you have defectTypes data
    };
  },
  mounted() {
    this.getInspectionBoardData();
  },
  methods: {
    getInspectionBoardData() {
      axios
        .get("store/get-inspection-board-data")
        .then((response) => {
          console.log("response data =", response.data);
          this.inspectionBoardData = response.data.inspectionBoardData;
          this.defectTypes = response.data.defectTypes;
        })
        .catch((error) => {
          console.error("Error fetching inspection board data:", error);
        });
    },
    assignData() {
      // Retrieve the active defect ID using the activeDefectIndex
      this.$store.setLoading(true);
      const activeDefect =
        this.inspectionBoardData.defects[this.activeDefectIndex];
      if (activeDefect) {
        const activeDefectId = activeDefect.id;
        console.log("Active defect ID:", activeDefectId);
        console.log("Selected defect type ID:", this.selectedDefectTypeId);
        console.log("Inspection Board ID:", this.inspectionBoardData.id);

        // Make API call to post data
        axios
          .post("/api/defects", {
            defectId: activeDefectId,
            defectTypeId: this.selectedDefectTypeId,
            boardId: this.inspectionBoardData.id,
          })
          .then((response) => {
            // Handle success response
            console.log("Data posted successfully:", response.data);
            // You can perform further actions here if needed
          })
          .catch((error) => {
            // Handle error
            console.error("Error posting data:", error);
            // You can display an error message or handle the error as per your requirements
          });
      } else {
        console.error("No active defect found.");
      }
    },
    updateActiveDefectIndex(index) {
      // Update the activeDefectIndex when carousel slide changes
      this.activeDefectIndex = index;
    },
    prevDefect() {
      // Go to previous defect in carousel
      this.updateActiveDefectIndex(
        (this.activeDefectIndex - 1 + this.inspectionBoardData.defects.length) %
          this.inspectionBoardData.defects.length
      );
    },
    nextDefect() {
      // Go to next defect in carousel
      this.updateActiveDefectIndex(
        (this.activeDefectIndex + 1) % this.inspectionBoardData.defects.length
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/* Your existing CSS styles */
.board-image {
  width: 600px;
  height: 400px;
  object-fit: cover; /* Ensures the image covers the entire container */
}

/* CSS for the carousel images */
.carousel-item img {
  width: 600px;
  height: 400px;
  object-fit: cover; /* Ensures the image covers the entire container */
}
</style>
