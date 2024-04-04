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
          Add New Defect Type
        </button>
        <button
          type="submit"
          class="btn btn-primary btn-sm ml-2"
          data-bs-toggle="modal"
          data-bs-target="#ListOfDefectsModal"
        >
          View List Of Defect Types
        </button>
      </div>
    </div>

    <!-- Board Image Centered -->
    <div class="row align-items-center mt-5">
      <div class="col-md-12 text-center" v-if="inspectionBoardData">
        <h2 class="mb-3">
          Board: <strong>{{ inspectionBoardData.name }}</strong>
        </h2>
        <VueImageZoomer
          :regular="inspectionBoardData.inspection_board_image_url"
          :zoom="inspectionBoardData.inspection_board_image_url"
          :zoom-amount="3"
          img-class="img-fluid"
          alt="Board Image"
          close-pos="top-right"
          message-pos="top"
        />
      </div>
    </div>

    <!-- Defect Details -->
    <div class="row align-items-start mt-5">
      <!-- Left Column - Carousel -->
      <div class="col-md-6 mt-4" v-if="inspectionBoardData">
        <h2 class="mb-3">Defect Details</h2>
        <div
          id="carouselExampleCaptions"
          class="carousel slide"
          v-if="inspectionBoardData && inspectionBoardData.defects"
        >
          <!-- Carousel Content -->
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
      </div>

      <!-- Right Column - Defect Dropdown and Button -->
      <div class="col-md-6 mt-4">
        <div class="row">
          <!-- Select Defect Type Dropdown -->
          <div class="col-md-12">
            <!-- <label for="defectType">Select Defect Type:</label> -->
            <h2>Select Defect Type:</h2>
            <select
              id="defectType"
              v-model="selectedDefectType"
              class="form-select mt-5"
            >
              <option
                v-for="defect in defectTypes"
                :key="defect.id"
                :value="defect.id"
              >
                {{ defect.name }}
              </option>
            </select>
          </div>
          <!-- Assign Button -->
          <div class="col-md-12 mt-3">
            <button type="button" class="btn btn-primary" @click="assignDefect">
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Defect Modal -->
    <div
      class="modal fade"
      id="addDefectModal"
      tabindex="-1"
      aria-labelledby="addDefectLabel"
      aria-hidden="true"
    >
      <!-- Modal Content -->
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1
              class="modal-title fs-5"
              id="addDefectLabel"
              style="font-weight: bold"
            >
              Add Defect
            </h1>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <textarea
              v-model="defectName"
              placeholder="Enter Defect"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="createDefect"
            >
              Create Defect
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- List of Defects Modal -->
    <div
      class="modal fade"
      id="ListOfDefectsModal"
      tabindex="-1"
      aria-labelledby="ListOfDefectsLabel"
      aria-hidden="true"
    >
      <!-- Modal Content -->
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1
              class="modal-title fs-5"
              id="ListOfDefectsLabel"
              style="font-weight: bold"
            >
              List Of Defects
            </h1>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul>
              <li v-for="defect in defectTypes" :key="defect.id">
                {{ defect.name }}
              </li>
            </ul>
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
              @click="createDefect"
            >
              Create Defect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VueImageZoomer } from "vue-image-zoomer";
import "vue-image-zoomer/dist/style.css";
export default {
  components: { VueImageZoomer },
  data() {
    return {
      inspectionBoardData: null,
      selectedDefectType: null,
      selectedDefectTypeId: null, // Assuming you have selectedDefect data
      defectTypes: [],
      activeDefectIndex: 0,
      defectName: "",
      // Assuming you have defectTypes data
    };
  },
  mounted() {
    this.getInspectionBoardData();
  },
  methods: {
    getInspectionBoardData() {
      this.$store.commit("setIsLoading", true);

      axios
        .get(`store/get-inspection-board-data/${this.$route.params.id}`)

        .then((response) => {
          console.log("response data =", response.data);
          this.inspectionBoardData = response.data.inspectionBoardData;
          this.defectTypes = response.data.defectTypes;
          if (
            this.inspectionBoardData &&
            this.inspectionBoardData.defects &&
            this.inspectionBoardData.defects.length > 0
          ) {
            this.selectedDefectType =
              this.inspectionBoardData.defects[
                this.activeDefectIndex
              ].defect_type.id;
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching inspection board data:", error);
          this.$store.commit("setIsLoading", false);
        });
    },

    async createDefect() {
      // Send POST request to /create-defect API endpoint
      this.$store.commit("setIsLoading", true);

      await axios
        .post("store/create-defect-type/", { defectName: this.defectName })
        .then((response) => {
          // Handle successful response, e.g., show success message

          this.$store.commit("setIsLoading", false);
          this.defectTypes = response.data.defectTypes;
          this.$notify({
            title: "Defect Type Created Successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });

          console.log("Defect created successfully:", response.data);
          // You may also want to close the modal or do other actions here
        })
        .catch((error) => {
          // Handle error, e.g., show error message
          this.$store.commit("setIsLoading", false);
          console.error("Error creating defect:", error);
          this.$notify({
            title: "Error Creating Defect Type",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          // You may also want to display an error message to the user
        });
    },
    async assignDefect() {
      // Retrieve the active defect ID using the activeDefectIndex
      this.$store.commit("setIsLoading", true);
      const activeDefect =
        this.inspectionBoardData.defects[this.activeDefectIndex];
      if (activeDefect) {
        const activeDefectId = activeDefect.id;
        console.log("Active defect ID:", activeDefectId);
        console.log("Selected defect type ID:", this.selectedDefectTypeId);
        console.log("Inspection Board ID:", this.inspectionBoardData.id);

        // Make API call to post data
        await axios
          .post("store/assign_defect_type/", {
            defect_id: activeDefectId,
            defect_type_id: this.selectedDefectType,
            board_id: this.inspectionBoardData.id,
          })
          .then((response) => {
            // Handle success response
            this.$store.commit("setIsLoading", false);
            console.log("Data posted successfully:", response.data);
            this.inspectionBoardData = response.data.inspectionBoardData;
            this.defectTypes = response.data.defectTypes;

            this.$notify({
              title: "Defect Assigned Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            // You can perform further actions here if needed
          })
          .catch((error) => {
            // Handle error
            console.error("Error posting data:", error);
            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "Error Assigning Defect ",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
            // You can display an error message or handle the error as per your requirements
          });
      } else {
        console.error("No active defect found.");
      }
    },
    updateActiveDefectIndex(index) {
      // Update the activeDefectIndex when carousel slide changes
      this.activeDefectIndex = index;
      if (
        this.inspectionBoardData &&
        this.inspectionBoardData.defects &&
        this.inspectionBoardData.defects[index] &&
        this.inspectionBoardData.defects[index].defect_type
      ) {
        this.selectedDefectType =
          this.inspectionBoardData.defects[index].defect_type.id;
      } else {
        // If defect type ID is not found or the defect itself is not available, set selectedDefectType to null
        this.selectedDefectType = null;
      }
    },

    prevDefect() {
      console.log(
        "Previous defect index before calculation:",
        this.activeDefectIndex
      );
      const newIndex =
        (this.activeDefectIndex - 1 + this.inspectionBoardData.defects.length) %
        this.inspectionBoardData.defects.length;
      console.log("New index after calculation:", newIndex);
      this.updateActiveDefectIndex(newIndex);
    },
    nextDefect() {
      console.log(
        "Next defect index before calculation:",
        this.activeDefectIndex
      );
      const newIndex =
        (this.activeDefectIndex + 1) % this.inspectionBoardData.defects.length;
      console.log("New index after calculation:", newIndex);
      this.updateActiveDefectIndex(newIndex);
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
  height: 370px;
  object-fit: cover; /* Ensures the image covers the entire container */
}
</style>
