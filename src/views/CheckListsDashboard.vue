<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Dashboard</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container">
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
              <!-- <li
                @click="selectOption('Custom')"
                :class="{ active: selectedOption === 'Custom' }"
              >
                <a class="dropdown-item" href="#">Custom Date range</a>
                <div v-if="selectedOption === 'Custom'" class="mb-3">
                  <label for="startDate" class="form-label">Start Date:</label>
                  <input
                    id="startDate"
                    type="date"
                    v-model="selectedStartDate"
                    class="form-control"
                    placeholder="Select start date"
                  />
                </div>
                <div class="mb-3" v-if="selectedOption === 'Custom'">
                  <label for="endDate" class="form-label">End Date:</label>
                  <input
                    id="endDate"
                    type="date"
                    v-model="selectedEndDate"
                    class="form-control"
                    placeholder="Select end date"
                  />
                </div>
                <button
                  v-if="selectedOption === 'Custom'"
                  class="btn btn-primary"
                  @click="fetchData()"
                >
                  Fetch Data
                </button>
              </li> -->
              <li>
                <!-- Button trigger modal -->
                <button
                  type="button"
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Custom Date ange
                </button>
              </li>

              <!-- Custom date range input -->
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row mt-4"
      style="display: flex; gap: 30px; justify-content: space-between"
    >
      <div class="small-box bg-gradient-success" style="flex: 1">
        <div class="inner">
          <h3>
            {{
              result.completed_checklists
                ? result.completed_checklists.length
                : "Loading"
            }}
          </h3>
          <p>Completed</p>
        </div>
        <div class="icon">
          <i class="fa-solid fa-check"></i>
        </div>
      </div>

      <div class="small-box bg-gradient-primary" style="flex: 1">
        <div class="inner">
          <h3>
            {{ result.in_progress ? result.in_progress.length : "Loading" }}
          </h3>
          <p>In Progress</p>
        </div>
        <div class="icon">
          <i class="fa-solid fa-spinner"></i>
        </div>
      </div>

      <div class="small-box bg-gradient-danger" style="flex: 1">
        <div class="inner">
          <h3>
            {{
              result.failed_checklists
                ? result.failed_checklists.length
                : "Loading"
            }}
          </h3>
          <p>Failed</p>
        </div>
        <div class="icon">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
    <div class="row mt-4 d-flex">
      <!-- Card 1 -->
      <div class="col-6">
        <div class="card card-primary">
          <div class="card-header">
            <h3 class="card-title">In Progress Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <button
                class="btn btn-primary btn-sm"
                @click="redirectToGeneratedChecklistPage"
              >
                View All
              </button>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <div
                v-if="
                  result && result.in_progress && result.in_progress.length > 0
                "
              >
                <ul class="list-group list-group-flush">
                  <li
                    v-for="(checklist, index) in result.in_progress"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    style="cursor: pointer"
                  >
                    {{ checklist.bom.product.name }} -
                    {{ checklist.updated_at }}
                    <!-- Right Column for Eye Icon Button -->
                    <i
                      class="fas fa-eye"
                      @click="InProgressRedirectToChecklist()"
                    ></i>
                  </li>
                </ul>
              </div>
              <div v-else>None</div>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>
      <div class="col-6">
        <div class="card card-success">
          <div class="card-header">
            <h3 class="card-title">Completed Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <button
                class="btn btn-success btn-sm"
                @click="redirectToGeneratedChecklistPage()"
              >
                View All
              </button>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <!-- Check if result is defined and has completed_checklists -->
              <div
                v-if="
                  result &&
                  result.completed_checklists &&
                  result.completed_checklists.length > 0
                "
              >
                <ul class="list-group list-group-flush">
                  <li
                    v-for="(checklist, index) in result.completed_checklists"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    style="cursor: pointer"
                  >
                    {{ checklist.bom.product.name }} -
                    {{ checklist.updated_at }}

                    <!-- Right Column for Eye Icon Button -->
                    <i
                      class="fas fa-eye"
                      @click="CompletedRedirectToDetailsChecklist(checklist.id)"
                    >
                    </i>
                  </li>
                </ul>
              </div>
              <!-- If result is undefined or has no completed_checklists, display a message -->
              <div v-else>None</div>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>

      <!-- Card 2 (Completed) -->
      <!-- <div class="col-6">
        <div class="col-6">
          <div class="card" style="width: 30rem">
            <div class="card-header">
              <h4><strong>Completed Checklists:</strong></h4>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(checklist, index) in result.completed_checklists"
                  :key="index"
                  class="list-group-item"
                >
                  {{ checklist.bom.product.name }} - {{ checklist.updated_at }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="row mt-4 d-flex">
      <!-- Card 1 -->
      <div class="col-6">
        <div class="card card-danger">
          <div class="card-header">
            <h3 class="card-title">Failed Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <button
                class="btn btn-danger btn-sm"
                @click="redirectToGeneratedChecklistPage"
              >
                View All
              </button>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <div
                v-if="
                  result &&
                  result.failed_checklists &&
                  result.failed_checklists.length > 0
                "
              >
                <ul class="list-group list-group-flush">
                  <li
                    v-for="(checklist, index) in result.failed_checklists"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    @click="FailedRedirectToDetailsChecklist(checklist.id)"
                    style="cursor: pointer"
                  >
                    {{ checklist.bom.product.name }} -
                    {{ checklist.updated_at }}
                    <!-- Right Column for Eye Icon Button -->
                    <i class="fas fa-eye"> </i>
                  </li>
                </ul>
              </div>
              <div v-else>None</div>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>
      <div class="col-6">
        <div class="card card-light">
          <div class="card-header">
            <h3 class="card-title">Sample Cloning In Progress Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <span class="badge badge-primary">View All</span>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <ul class="">
                <li
                  v-for="(checklist, index) in result.in_progress"
                  :key="index"
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ checklist.bom.product.name }} -
                  {{ checklist.updated_at }}
                  <!-- Right Column for Eye Icon Button -->
                  <i class="fas fa-eye"> </i>
                </li>
              </ul>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>

      <!-- Card 2 (Completed) -->
      <!-- <div class="col-6">
        <div class="col-6">
          <div class="card" style="width: 30rem">
            <div class="card-header">
              <h4><strong>Completed Checklists:</strong></h4>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(checklist, index) in result.completed_checklists"
                  :key="index"
                  class="list-group-item"
                >
                  {{ checklist.bom.product.name }} - {{ checklist.updated_at }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <!-- Modal -->
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
            >
              Fetch Checklists
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Second Row -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {
    // Datepicker,
  },
  data() {
    return {
      // selectedDate: null,
      selectedOption: "Today",
      result: {},
      selectedCustomDate: null,
      selectedStartDate: "",
      selectedEndDate: "",
      errorMessage: "",
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
  mounted() {
    this.fetchData();
  },
  methods: {
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
      const formattedData = {
        selected_option: this.selectedOption,
        start_date: this.selectedStartDate,
        end_date: this.selectedEndDate,
      };
      console.log(formattedData.selected_option);
      console.log(formattedData.start_date);
      console.log(formattedData.end_date);

      axios
        .post("store/get-checklist-count/", formattedData)
        .then((response) => {
          this.result = response.data;
          console.log("backend data", this.result);
          // const modalElement = document.getElementById("exampleModal");
          // if (modalElement) {
          //   const modal = new bootstrap.Modal(modalElement);
          //   // Close the modal using plain JavaScript
          //   modal.hide();
          // }
        })
        .catch((error) => {
          console.error(error);
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
    redirectToGeneratedChecklistPage() {
      //   const id = this.result?.in_progress?.[0]?.bom?.id;
      //   console.log(id);

      //   // Check if id is available before navigating
      //   if (id !== undefined && id !== null) {
      //     // Assuming you have a router or some way to navigate to the generated checklist page
      //     // Replace this line with your actual routing logic
      //     this.$router.push(`/generated-checklists/${id}`);
      //   } else {
      //     // Handle the case where id is not available
      //     console.error("id is not available");
      //   }
      const allChecklists = [
        ...this.result.in_progress,
        ...this.result.completed_checklists,
        ...this.result.failed_checklists,
      ];

      // Find the first checklist with a valid id
      const firstChecklistWithId = allChecklists.find(
        (checklist) =>
          checklist.bom?.id !== undefined && checklist.bom?.id !== null
      );

      // Check if a valid checklist with id is found
      if (firstChecklistWithId) {
        const id = firstChecklistWithId.bom.id;
        console.log(id);

        // Assuming you have a router or some way to navigate to the generated checklist page
        // Replace this line with your actual routing logic
        this.$router.push(`/generated-checklists/${id}`);
      } else {
        // Handle the case where no valid id is available
        console.error("No valid id found in the checklists");
      }
    },
    InProgressRedirectToChecklist() {
      const id = this.result?.in_progress?.[0]?.bom?.id;
      console.log(id);

      // Check if id is available before navigating
      if (id !== undefined && id !== null) {
        // Assuming you have a router or some way to navigate to the generated checklist page
        // Replace this line with your actual routing logic
        this.$router.push(`/begin-checklist/${id}`);
      } else {
        // Handle the case where id is not available
        console.error("id is not available");
      }
    },
    FailedRedirectToDetailsChecklist(checklistId) {
      // Check if checklistId is available before navigating
      if (checklistId !== undefined && checklistId !== null) {
        // Assuming you have a router or some way to navigate to the checklist page
        // Replace this line with your actual routing logic
        this.$router.push(`/checklist-details/${checklistId}`);
      } else {
        // Handle the case where checklistId is not available
        console.error("checklistId is not available");
      }
    },
    CompletedRedirectToDetailsChecklist(checklistId) {
      // Check if checklistId is available before navigating
      if (checklistId !== undefined && checklistId !== null) {
        // Assuming you have a router or some way to navigate to the checklist page
        // Replace this line with your actual routing logic
        this.$router.push(`/checklist-details/${checklistId}`);
      } else {
        // Handle the case where checklistId is not available
        console.error("checklistId is not available");
      }
    },
  },
};
</script>
<style scoped>
/* Add styles for highlighting on hover */
</style>
