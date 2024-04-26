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
          <h2 class="mb-0">Dashboard</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa fa-tachometer me-1" aria-hidden="true"></i>
                Dashboard
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container d-flex justify-content-end">
          <!-- New Dropdown for Select Line -->
          <div class="dropdown me-2">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="lineDropdownButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedLine ? selectedLine.name : "Select Line" }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="lineDropdownButton">
              <li v-for="line in lines" :key="line.id">
                <a class="dropdown-item" href="#" @click="selectLine(line)">
                  {{ line.name }}
                </a>
              </li>
            </ul>
          </div>
          <!-- Existing Dropdown for Time Selection -->
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{
                selectedOption === "Previous_Week"
                  ? "Previous Week"
                  : selectedOption === "Previous_Month"
                  ? "Previous Month"
                  : selectedOption
              }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li
                @click="selectOption('Today')"
                :class="{ active: selectedOption === 'Today' }"
              >
                <a class="dropdown-item" href="#">Today</a>
              </li>
              <li
                @click="selectOption('Previous_Week')"
                :class="{ active: selectedOption === 'Previous_Week' }"
              >
                <a class="dropdown-item" href="#">Previous Week</a>
              </li>
              <li
                @click="selectOption('Previous_Month')"
                :class="{ active: selectedOption === 'Previous_Month' }"
              >
                <a class="dropdown-item" href="#">Previous Month</a>
              </li>
              <li>
                <button
                  type="button"
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Custom Date
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- Rest of the template content... -->

    <div class="card card-outline card-primary mt-5">
      <div class="card-header">
        <h3 class="card-title" style="font-size: 24px">SMT Line</h3>

        <div class="card-tools">
          <!-- Buttons, labels, and many other things can be placed here! -->
          <!-- Here is a label for example -->
        </div>
        <!-- /.card-tools -->
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div
          class="row mt-4"
          style="display: flex; gap: 30px; justify-content: space-between"
        >
          <div class="small-box bg-gradient-success" style="flex: 1">
            <div class="inner">
              <h3>{{ this.aoi_count }}</h3>
              <p>Number of AOI reports</p>
            </div>
            <!-- <div class="icon">
              <i class="fa-solid fa-check"></i>
            </div> -->
          </div>

          <div class="small-box bg-gradient-primary" style="flex: 1">
            <div class="inner">
              <h3>{{ this.pp_count }}</h3>
              <p>Number of P&P reports</p>
            </div>
            <!-- <div class="icon">
              <i class="fa-solid fa-spinner"></i>
            </div> -->
          </div>

          <div class="small-box bg-gradient-danger" style="flex: 1">
            <div class="inner">
              <h3>{{ this.spi_count }}</h3>
              <p>Number of SPI reports</p>
            </div>
            <!-- <div class="icon">
              <i class="fa-solid fa-xmark"></i>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
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
              <strong>Custom Date Range</strong>
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Date picker inputs go here -->
            <div class="mb-3">
              <label for="startDate" class="form-label">Start Date:</label>
              <input
                id="startDate"
                type="date"
                v-model="selectedStartDate"
                class="form-control"
                placeholder="Select start date"
                @input="validateDates"
              />
            </div>
            <div class="mb-3">
              <label for="endDate" class="form-label">End Date:</label>
              <input
                id="endDate"
                type="date"
                v-model="selectedEndDate"
                class="form-control"
                placeholder="Select end date"
                @input="validateDates"
              />
            </div>
            <div v-if="errorMessage" class="alert alert-danger mt-3 p-2">
              <i class="fas fa-exclamation-triangle"></i>
              {{ errorMessage }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- Change text and add @click event to set selected option to 'Custom' -->
            <button
              type="button"
              class="btn btn-success"
              @click="setSelectedOptionAndFetchData"
              :disabled="isFetchButtonDisabled"
              data-bs-dismiss="modal"
            >
              Fetch Machine Logs
            </button>
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
      selectedOption: "Today",
      result: {},
      selectedCustomDate: null,
      selectedStartDate: "",
      selectedEndDate: "",
      errorMessage: "",
      lines: "",
      selectedLine: "",
      selectedLineId: null,
      pp_count: "",
      spi_count: "",
      aoi_count: "",
    };
  },
  computed: {
    isFetchButtonDisabled() {
      if (
        !this.selectedStartDate ||
        !this.selectedEndDate ||
        new Date(this.selectedStartDate) > new Date(this.selectedEndDate) ||
        new Date(this.selectedStartDate) > new Date() ||
        new Date(this.selectedEndDate) > new Date()
      ) {
        // Return true to disable the button if any validation condition fails
        return true;
      }

      // Return false to enable the button if all validation conditions pass
      return false;
    },
  },
  methods: {
    selectLine(line) {
      this.selectedLine = line;
      this.selectedLineId = line.id;
      this.fetchData();
    },
    validateDates() {
      // Case 1: Start date is not selected
      if (!this.selectedStartDate) {
        this.errorMessage = "Please select a start date.";
        return;
      }

      const startDate = new Date(this.selectedStartDate);
      const today = new Date();

      // Case 2: Start date is in the future
      if (startDate > today) {
        this.errorMessage = "Start date cannot be in the future.";
        return;
      }

      // Case 3: End date is not selected
      if (!this.selectedEndDate) {
        // Clear the error message if no errors
        this.errorMessage = "";
        return;
      }

      const endDate = new Date(this.selectedEndDate);

      // Case 4: Start date is greater than end date
      if (startDate > endDate) {
        this.errorMessage = "Start date cannot be greater than end date.";
        return;
      }

      // Case 5: End date is in the future
      if (endDate > today) {
        this.errorMessage = "End date cannot be in the future.";
        return;
      }

      // Clear the error message if no errors
      this.errorMessage = "";
    },
    selectOption(option) {
      this.selectedOption = option;
      if (this.selectOption !== "Custom") {
        this.fetchData();
      }
    },

    async fetchData() {
      // if (!this.selectedLine) {
      //   alert("Please select a line first.");
      //   return;
      // }
      const formattedData = {
        selected_option: this.selectedOption,
        start_date: this.selectedStartDate,
        end_date: this.selectedEndDate,
        selected_line_id: this.selectedLineId,
      };
      console.log(formattedData.selected_option);
      console.log(formattedData.start_date);
      console.log(formattedData.end_date);
      console.log(formattedData.selected_line_id);
      this.$store.commit("setIsLoading", true);
      await axios
        .post("machine-logs/get-machineLogs-count/", formattedData)
        .then((response) => {
          this.result = response.data;
          this.lines = response.data.lines;
          this.pp_count = response.data.pp_count;
          this.spi_count = response.data.spi_count;
          this.aoi_count = response.data.aoi_count;
          console.log("backend data", this.result);
          this.$store.commit("setIsLoading", false);
          // const modalElement = document.getElementById("exampleModal");
          // if (modalElement) {
          //   const modal = new bootstrap.Modal(modalElement);
          //   // Close the modal using plain JavaScript
          //   modal.hide();
          // }
        })
        .catch((error) => {
          console.error(error);
          this.$store.commit("setIsLoading", false);
        });
    },
    setSelectedOptionAndFetchData() {
      // Set the selected option to 'Custom'
      this.selectedOption = "Custom";
      this.validateDates();
      if (this.errorMessage === "") {
        this.fetchData();
      }

      // Call the fetchData() method with 'Custom' option
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
