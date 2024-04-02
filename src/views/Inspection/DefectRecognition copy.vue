<template>
  <div class="container">
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
              :class="{ active: index === 0 }"
            >
              <img
                v-if="defect.defect_image_url"
                :src="defect.defect_image_url"
                class="d-block w-100"
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
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <div class="mt-4">
          <label for="defectType">Select Defect Type:</label>
          <select id="defectType" v-model="selectedDefect" class="form-select">
            <option
              v-for="defect in defectTypes"
              :key="defect"
              :value="defect.id"
            >
              {{ defect.name }}
            </option>
          </select>
          <button type="button" class="btn btn-primary mt-3" @click="saveData">
            Save
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
      selectedDefect: null, // Assuming you have selectedDefect data
      defectTypes: [], // Assuming you have defectTypes data
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
    saveData() {
      // Method to save data, you can implement as needed
    },
  },
};
</script>

<style lang="scss" scoped>
/* Your existing CSS styles */
</style>
