<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Create Maintenance Calendar</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/">
                  <i class="fas fa-home me-1"></i>Home
                </router-link>
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
          @click="createPlan"
        >
          Create Plan
        </button>
      </div>
    </div>

    <div class="container mt-5">
      <section class="mb-3">
        <label for="dates" class="form-label">Select Dates:</label>
        <select
          id="dates"
          class="form-select"
          v-model="selectedDates"
          @change="openModal"
        >
          <!-- <option disabled value="">Please select</option> -->
          <option
            value="customizable"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Customizable Date
          </option>
          <option value="wholeMonth">Whole Month</option>
        </select>
      </section>
      <section class="mb-3">
        <label for="machine" class="form-label">Machine:</label>
        <select id="machine" class="form-select" v-model="selectedMachine">
          <option disabled value="">Please select</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine.id"
          >
            {{ machine.name }}
          </option>
        </select>
      </section>
      <section class="mb-3">
        <label for="type" class="form-label">Type:</label>
        <input type="text" id="type" class="form-control" v-model="type" />
      </section>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Custom Dates
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- First Row: For Months -->
            <div class="row mb-3">
              <div class="col">
                <label for="monthDropdown" class="form-label"
                  >For Months:</label
                >
                <select
                  id="monthDropdown"
                  class="form-select"
                  multiple
                  v-model="selectedMonths"
                >
                  <!-- Month options here -->
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Month:</label>
                <p>{{ selectedMonths }}</p>
              </div>
            </div>

            <!-- Second Row: For Weeks -->
            <div class="row mb-3">
              <div class="col">
                <label for="weekDropdown" class="form-label">For Weeks:</label>
                <select
                  id="weekDropdown"
                  class="form-select"
                  multiple
                  v-model="selectedWeeks"
                >
                  <!-- Week options here -->
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Week 5">Week 5</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Weeks:</label>
                <p>{{ selectedWeeks }}</p>
              </div>
            </div>

            <!-- Third Row: On Days -->
            <div class="row mb-3">
              <div class="col">
                <label for="dayDropdown" class="form-label">On Days:</label>
                <select
                  id="dayDropdown"
                  class="form-select"
                  multiple
                  v-model="selectedDays"
                >
                  <!-- Day options here -->
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Days:</label>
                <p>{{ selectedDays }}</p>
              </div>
            </div>

            <!-- Additional Form Elements (if any) -->

            <!-- Except -->
            <div class="mt-4">
              <label for="exceptInput" class="form-label fw-bold fs-5"
                >Except:</label
              >
              <!-- <input type="text" id="exceptInput" class="form-control" /> -->
            </div>

            <!-- For Week on Day -->
            <div class="row mb-3">
              <div class="col">
                <label for="weekOnDayDropdown" class="form-label"
                  >For Week:</label
                >
                <select
                  id="weekOnDayDropdown"
                  class="form-select"
                  multiple
                  v-model="selectedWeeksExcept"
                >
                  <!-- Week options here -->
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Week 5">Week 5</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Week:</label>
                <p>{{ selectedWeeksExcept }}</p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="dayOnDayDropdown" class="form-label">On Day:</label>
                <select
                  id="dayOnDayDropdown"
                  class="form-select"
                  multiple
                  v-model="selectedDaysExcept"
                >
                  <!-- Day options here -->
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Day:</label>
                <p>{{ selectedDaysExcept }}</p>
              </div>
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
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDates: null,
      selectedMachine: null,
      type: "",
      formChoices: [
        {
          id: 1,
          selectedMonths: [],
          selectedWeeks: [],
          selectedDays: [],
          selectedWeeksExcept: [],
          selectedDaysExcept: [],
        },
      ],
    };
  },
  methods: {
    createPlan() {
      console.log("Selected Dates:", this.selectedDates);
      console.log("Selected Machine:", this.selectedMachine);
      console.log("Type:", this.type);
    },
    openModal() {
      // Check if the selectedDates is 'customizable'
      if (this.selectedDates === "customizable") {
        // Find the modal trigger button element
        const modalTriggerButton = document.querySelector(
          '[data-bs-target="#exampleModal"]'
        );
        // Trigger the modal using data-bs-toggle attribute
        if (modalTriggerButton) {
          modalTriggerButton.click();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
